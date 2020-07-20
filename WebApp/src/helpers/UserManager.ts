import { getPKCE, getUUID, isUUID } from '../helpers/randomCodes';
import { CLIENT_ID, CLIENT_SECRET, ERROR_STATUS, SUCCESS_STATUS } from '../helpers/GLOBALVARS';
import { GetToken } from '../MALWrapper/Authentication';
import { tokenResponse, ResponseMessage } from '../MALWrapper/BasicTypes';
import { Database } from './database/Database';
import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';

/*
Manage all user data instead of the codeDict
*/

type DictData = {
    token: string,
    RefreshToken: string,
    email: string
}

type RegisterData = {
    email: string,
    pass: string,
    verifier: string
}

type DictEntry = {
    state: "done" | "pending" | "errored" | "canceled",
    data?: DictData | RegisterData
}

export class UserManager {
    private codeDict: Map<string, DictEntry>;

    //TODO remove old pending, canceled and errored states

    public LogDict() {
        let strRep = "";
        this.codeDict.forEach((value, key) => {
            strRep += `${key}: ${JSON.stringify(value)}\n`;
        });
        Logger.Info(strRep);
    }

    /** Start the registration, returns url for authentication */
    public async StartRegister(email: string, password: string): Promise<string> {
        //TODO: Check format for email and password
        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!email.match(emailReg)) {
            throw new Error("Email incorrect format");
        }

        const passReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)^[a-zA-Z\d\W]{8,30}$/;
        if (!password.match(passReg)) {
            throw new Error("Password incorrect format");
        }
        
        //check if email exists in db
        if ((await Database.GetInstance().GetEmailUsed(email))) throw new Error("Email in use");

        //Create a uuid and code verifier
        let uuid = getUUID();
        let codeVerifier: string = getPKCE(128);
        //create a dict entry with state pendign and the email, password and verifier
        let dictEntry : DictEntry = {
            state: "pending",
            data: {
                email: email,
                pass: password,
                verifier: codeVerifier
            }
        }
        //add the entry to the dict with the uuid
        this.codeDict.set(uuid, dictEntry);
        
        //return the authentication url
        return `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&code_challenge=${codeVerifier}&state=${uuid}&redirect_uri=${process.env.LOCALMODE?"http://localhost:3000/authed":"http://api.imal.ml/authed"}`;
    }

    public async CheckUUID(uuid: string): Promise<"pending"|"done"|"errored"|"canceled"> {
        if (this.codeDict.has(uuid)) {
            let entry = <DictEntry>this.codeDict.get(uuid);
            return entry.state;
        }

        let dbEntry = await Database.GetInstance().GetUserUUID(uuid);
        let dictEntry : DictEntry = {
            state: "done",
            data: {
                email: dbEntry.email,
                token: dbEntry.token,
                RefreshToken: dbEntry.refreshtoken
            }
        }
        this.codeDict.set(dbEntry.id, dictEntry);
        return "done";
    }

    /** end the registration, add user to database */
    public async DoPending(uuid: string, code: string) {
        //check if the uuid exists in the dict
        if (!this.codeDict.has(uuid)) throw new Error("uuid does not exist yet");

        //get the dict entry and check if the state is pending
        let dictEntry = <DictEntry>this.codeDict.get(uuid);
        if (dictEntry.state != "pending") throw new Error("uuid is not pending, it is: " + dictEntry.state);
        

        //get the dict data in the correct type
        let dictData = <RegisterData>dictEntry.data;
        //get the tokens from MAL
        let tokens = await GetToken(code, dictData.verifier);
        //check if we errored while connecting to MAL
        if ((tokens as ResponseMessage).status) {
            let err = (tokens as ResponseMessage);
            if (err.status == "error") {
                throw new Error(err.message);
            }
        }

        //get the token data in correct type
        let tokenData = <tokenResponse>tokens;

        //All good so add user to the database
        Database.GetInstance().CreateUser(uuid, dictData.email, dictData.pass, tokenData.access_token, tokenData.refresh_token);
        //return `imal://${uuid}`;
        return `api.imal.ml/suggestions?state=${uuid}`;
    }

    public async TryUpdateTokens(uuid: string, token: string, refreshtoken: string) {
        //check if the tokens have changed
        let tokens = await this.GetTokensForUUID(uuid);
        if (tokens.token != token || tokens.refreshtoken != refreshtoken) {
            let dictEntry = <DictEntry>this.codeDict.get(uuid);

            let curr = <DictData>dictEntry.data;
            curr.token = token;
            curr.RefreshToken = refreshtoken;
            
            this.codeDict.set(uuid, { state: dictEntry.state, data: curr });

            //Update token in database
            await Database.GetInstance().UpdateTokens(uuid, token, refreshtoken);
        }
    }

    /** Get token associated with uuid */
    public async GetTokensForUUID(uuid: string): Promise<{ token: string, refreshtoken: string }> {
        let state = await this.CheckUUID(uuid);
        if (state == "done") {
            let dictEntry = <DictEntry>this.codeDict.get(uuid);
            let dictData = <DictData>dictEntry.data;
            return {
                token: dictData.token,
                refreshtoken: dictData.RefreshToken
            };
        } else {
            throw new Error("Authentication is not done but " + state);
        }
    }

    /** Set the state for a uuid to canceled */
    public SetCanceled(uuid: string) {
        this.codeDict.set(uuid, {
            state: "canceled"
        })
    }

    public async Login(email: string, password: string): Promise<string> {
        let data = await Database.GetInstance().GetUserLogin(email, password);
        let dictEntry: DictEntry = {
            state: "done",
            data: {
                email: data.email,
                token: data.token,
                RefreshToken: data.refreshtoken
            }
        }
        this.codeDict.set(data.id, dictEntry);
        return data.id;
    }

    public static CheckRequestState(req: Request, res: Response) {
        //state is one of the paramaters
        if (!req.query.state) {
            res.status(422).json({
                status: ERROR_STATUS,
                message: "Missing parameter state"
            });
            return false;
        }

        let state: string = String(req.query.state);

        //state is valid format
        if (!isUUID(state)) {
            res.status(403).json({
                status: ERROR_STATUS,
                message: "State incorrect format"
            });
            return false;
        }

        this.GetInstance().CheckUUID(state)
        
        return state;
    }

    /** Set the state for a uuid to errored */
    public SetErrored(uuid: string) {
        this.codeDict.set(uuid, {
            state: "errored"
        })
    }
    /* #region  singleton */
    private static instance: UserManager;
    /** Initialize codeDict */
    private constructor() {
        this.codeDict = new Map<string, DictEntry>()
    }
    public static GetInstance() {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }
    /* #endregion */
}