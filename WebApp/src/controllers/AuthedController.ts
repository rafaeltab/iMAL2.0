import { Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { getPKCE, getUUID, isUUID } from '../helpers/randomCodes';
import { tokenResponse, GetToken, ResponseMessage } from '../MALWrapper/Authentication';
import { CLIENT_ID, CLIENT_SECRET, ERROR_STATUS, SUCCESS_STATUS } from '../helpers/GLOBALVARS';

const PENDING_STATE = "pending";
const CANCELED_STATE = "canceled";



let codeDict: Map<string, tokenResponse | "pending" | "canceled"> = new Map<string, tokenResponse | "pending" | "canceled">(); 


@Controller('authed')
export class AuthedController {

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

    @Get("start")
    private startAuth(req: Request, res: Response) {
        let codeVerif : string = getPKCE(128);
        let uuidState: string = getUUID();

        codeDict.set(uuidState, PENDING_STATE);
        let url = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&code_challenge=${codeVerif}&state=${uuidState}`;
        Logger.Info(`Starting auth for ${req.ip} with uuidState: ${uuidState}`);
        res.status(200).json({
            status: SUCCESS_STATUS,
            message: url,
            code: uuidState
        });
    }

    @Get()
    private authed(req: Request, res: Response) {
        //No state defined
        if (!req.query.state) {
            Logger.Warn("missing parameter in request to /authed");
            res.status(422).json({
                status: ERROR_STATUS,
                message: "you are missing a required parameter"
            });
            return;
        }

        //user canceled probably
        if (req.query.error) {
            let state = String(req.query.state);
            Logger.Info(`Auth ERR for ${state}: ${req.query.hint}`);

            codeDict.set(state,CANCELED_STATE);
            res.status(200).json({
                status: SUCCESS_STATUS,
                message: `authentication for ${state} has been canceled`
            });
            return;
        }

        //No code defined
        if (!req.query.code) {
            Logger.Warn("missing parameter in request to /authed");
            res.status(422).json({
                status: ERROR_STATUS,
                message: "you are missing a required parameter"
            });
            return;
        }

        let state: string = String(req.query.state);
        let code: string = String(req.query.code);

        //state wrong format
        if (!isUUID(state)) {
            Logger.Warn("State parameter was of incorrect format in request to /authed");
            res.status(422).json({
                status: ERROR_STATUS,
                message:"There is a problem with one of your parameters"
            });
            return;
        }

        const codeRe = /[0-9a-z]{700,1300}/ 
        //code wrong format
        if (!code.match(codeRe)) {
            Logger.Warn("Code parameter was of incorrect format in request to /authed");
            res.status(422).json({
                status: ERROR_STATUS,
                message:"There is a problem with one of your parameters"
            });
            return;
        }
        
        //life is good!
        if (!codeDict.has(state)) {
            res.status(403).json({
                status: ERROR_STATUS,
                message: "Authentication needs to be started first. This error might be caused by the system restarting"
            });
            return;
        } else if (codeDict.get(state) == PENDING_STATE) {
            //codeDict.set(state, code);
            let token = GetToken(code);
            //TODO doesnt correctly prevent errors from making it into codeDict
            if (!(token as ResponseMessage).status) {
                codeDict.set(state, <tokenResponse>token);
                res.status(200).json({
                    status: SUCCESS_STATUS,
                    message: "Authentication successfull"
                });
            } else {
                res.status(500).json(<ResponseMessage>token);
            }           
            return;
        } else if(codeDict.get(state) == CANCELED_STATE){
            res.status(403).json({
                status: ERROR_STATUS,
                message: "authentication for this state has been canceled already, you might want to retry"
            });
            return;
        } else {
            res.status(403).json({
                status: ERROR_STATUS,
                message: "code already saved"
            });
        }
    }  
}