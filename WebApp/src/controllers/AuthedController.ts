import { Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { getPKCE, getUUID, isUUID } from '../helpers/randomCodes';
import { GetToken, ResponseMessage } from '../MALWrapper/Authentication';
import { CLIENT_ID, CLIENT_SECRET, ERROR_STATUS, SUCCESS_STATUS } from '../helpers/GLOBALVARS';
import * as fs from 'fs';
import * as fetch from 'node-fetch';
import { tokenResponse } from 'src/MALWrapper/BasicTypes';

//Different states that can go in the codeDict
const PENDING_STATE = "pending";
const CANCELED_STATE = "canceled";
const ERRORED_STATE = "error";

const PENDING_TIMEOUT = 600 * 1000;
const CANCELED_TIMEOUT = 60 * 1000;
const ERRORED_TIMEOUT = 60 * 1000;

//special state that also saves the code verifier
type pending = {
    state: "pending",
    verifier: string
}

function setPending(uuid: string, verifier: string) {
    codeDict.set(uuid, { state: PENDING_STATE, verifier: verifier });
    setTimeout(() => {
        if ((codeDict.get(uuid) as pending).verifier) {
            codeDict.delete(uuid);
        }                    
    },PENDING_TIMEOUT);   
}

function setCanceled(uuid: string) {
    codeDict.set(uuid, CANCELED_STATE);
    setTimeout(() => {
        if (codeDict.get(uuid) == CANCELED_STATE) {
            codeDict.delete(uuid);
        }                    
    },CANCELED_TIMEOUT);   
}

function setError(uuid: string) {
    codeDict.set(uuid, ERRORED_STATE);
    setTimeout(() => {
        if (codeDict.get(uuid) == ERRORED_STATE) {
            codeDict.delete(uuid);
        }                    
    },ERRORED_TIMEOUT);   
}

//Code list with all the user codes
let codeDict: Map<string, tokenResponse | pending | "canceled" | "error"> = new Map<string, tokenResponse | pending | "canceled" | "error">(); 

function saveDict() {
    let stringRep = JSON.stringify(Array.from(codeDict.entries()));
    fs.writeFileSync("./save.txt",stringRep,"utf-8");
}

function restoreDict() {
    if (fs.existsSync("./save.txt")) {
        let stringRep : string = fs.readFileSync("./save.txt", "utf-8");
        let parsed = JSON.parse(stringRep);
        codeDict = new Map<string, tokenResponse | pending | "canceled" | "error">(parsed);
        codeDict.forEach((value, key) => {
            //purge unchanged unimportant entries after a time
            if ((codeDict.get(key) as pending).verifier) {
                setTimeout(() => {
                    if ((codeDict.get(key) as pending).verifier) {
                        codeDict.delete(key);
                        console.log("removed");
                    }                    
                },PENDING_TIMEOUT);  
            } else if (codeDict.get(key) == CANCELED_STATE) {
                setTimeout(() => {
                    if (codeDict.get(key) == CANCELED_STATE) {
                        codeDict.delete(key);
                    }                    
                },CANCELED_TIMEOUT);  
            } else if (codeDict.get(key) == ERRORED_STATE) {
                setTimeout(() => {
                    if (codeDict.get(key) == ERRORED_STATE) {
                        codeDict.delete(key);
                    }                    
                },ERRORED_TIMEOUT);   
            }             
        });
    }    
}

export function getDict(): Map<string, tokenResponse | pending | "canceled" | "error">{
    return codeDict;
}

export function SaveDict(test: string) {
    if (test === "10") {
        Logger.Info("called");
        saveDict();
    }
}

export function RestoreDict(test: string) {
    if (test === "10") {
        restoreDict();
    }
}

//Main controller
@Controller('authed')
export class AuthedController {
    //endpoint for logging the code dict to the console
    @Get("log")
    private logCodeDict(req: Request, res: Response) {
        Logger.Info("Current CodeDict");
        codeDict.forEach((value,key) => { 
            Logger.Info(`${key}: ${JSON.stringify(value)}`);
        });
        res.status(200).json({
            status: SUCCESS_STATUS,
            message: "Logged succesfully"
        });
    }

    //endpoint for starting the authentication process
    @Get("start")
    private startAuth(req: Request, res: Response) {
        //verifier needed for extra security
        let codeVerif: string = getPKCE(128);
        //unique id used to verify authentication attempt
        let uuidState: string = getUUID();

        //set the unique id to pending with the code verifier
        setPending(uuidState, codeVerif);

        //build the url that the user needs to go to 
        let url = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&code_challenge=${codeVerif}&state=${uuidState}`;
        //log that we are starting an auth for an ip with the state
        Logger.Info(`Starting auth for ${req.ip} with uuidState: ${uuidState}`);
        //send the url and uuid to the user
        res.status(200).json({
            status: SUCCESS_STATUS,
            message: url,
            code: uuidState
        });
    }

    //endpoint that gets called when the user clicks either of the buttons on mal
    @Get()
    private authed(req: Request, res: Response) {
        //No state defined
        if (!req.query.state) {
            Logger.Warn("missing parameter in request to /authed");
            res.status(422).json({
                status: ERROR_STATUS,
                message: "You are missing a required parameter"
            });
            return;
        }

        //user canceled or some other error we don't know of
        if (req.query.error) {
            let state = String(req.query.state);
            Logger.Info(`Auth ERR for ${state}: ${req.query.hint}`);

            setCanceled(state);
            res.status(200).json({
                status: SUCCESS_STATUS,
                message: `authentication for ${state} has been canceled`
            });
            return;
        }

        //stringify the state
        let state: string = String(req.query.state);

        //state wrong format
        if (!isUUID(state)) {
            Logger.Warn("State parameter was of incorrect format in request to /authed");
            res.status(422).json({
                status: ERROR_STATUS,
                message:"There is a problem with one of your parameters"
            });
            return;
        }

        //No code defined
        if (!req.query.code) {
            Logger.Warn("missing parameter in request to /authed");
            setError(state);
            res.status(422).json({
                status: ERROR_STATUS,
                message: "you are missing a required parameter"
            });
            return;
        }

        //strinfiy the code
        let code: string = String(req.query.code);        

        const codeRe = /[0-9a-z]{700,1300}/ 
        //code wrong format
        if (!code.match(codeRe)) {
            Logger.Warn("Code parameter was of incorrect format in request to /authed");
            setError(state);
            res.status(422).json({
                status: ERROR_STATUS,
                message:"There is a problem with one of your parameters"
            });
            return;
        }
        
        //put the codeDict in a variable for efficieny
        let codeDictState = codeDict.get(state);

        //no parameter issues so onto the rest

        //state doesn't exist in the list meaning the user either timed out or something weird happend
        if (!codeDict.has(state)) {
            res.status(403).json({
                status: ERROR_STATUS,
                message: "Authentication needs to be started first. This error might be caused by the system restarting"
            });
            return;
        //everything is 👍
        } else if ((codeDictState as pending).verifier) {
            //get the verifier
            let verifier = (<pending>codeDictState).verifier;

            //get the token from the MAL server
            let tokenPromise = GetToken(code,verifier);
            tokenPromise.then((token) => {
                //The authentication was a success
                if (!(token as ResponseMessage).status) {
                    codeDict.set(state, <tokenResponse>token);
                    res.status(200).json({
                        status: SUCCESS_STATUS,
                        message: "Authentication successfull"
                    });
                //the authentication gave an error
                } else {
                    setError(state);
                    res.status(500).json(<ResponseMessage>token);
                }           
                return;
            });
        
        //the state was already canceled
        } else if(codeDictState == CANCELED_STATE){
            res.status(403).json({
                status: ERROR_STATUS,
                message: "authentication for this state has been canceled already, you might want to retry"
            });
            return;
        //the code was already saved this is very weird
        } else if (codeDictState == ERRORED_STATE) {
            res.status(403).json({
                status: ERROR_STATUS,
                message: "code errored"
            });
        }else {
            res.status(403).json({
                status: ERROR_STATUS,
                message: "code already saved"
            });
        }
    }  
}