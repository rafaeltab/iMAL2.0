//AuthedController vs 2.0

import { Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { getPKCE, getUUID, isUUID } from '../helpers/randomCodes';
import { GetToken } from '../MALWrapper/Authentication';
import { CLIENT_ID, CLIENT_SECRET, ERROR_STATUS, SUCCESS_STATUS } from '../helpers/GLOBALVARS';
import * as fs from 'fs';
import { tokenResponse, ResponseMessage } from '../MALWrapper/BasicTypes';
import { UserManager } from '../helpers/UserManager';

//Main controller
@Controller('authed')
export class AuthedController {
    //endpoint for logging the code dict to the console
    @Get("log")
    private logCodeDict(req: Request, res: Response) {
        UserManager.GetInstance().LogDict();
        res.status(200).json({
            status: SUCCESS_STATUS,
            message: "Logged succesfully"
        });
    }

    //endpoint for registering a new user
    @Get("register")
    private Register(req: Request, res: Response) {
        //TODO move to body of request
        //Check if email and password are present
        if (!req.query.email) {
            res.status(422).json({
                status: ERROR_STATUS,
                message: "Missing parameter email"
            });
        }
        if (!req.query.pass) {
            res.status(422).json({
                status: ERROR_STATUS,
                message: "Missing parameter pass"
            });
        }

        if (req.query.email == "") {
            res.status(422).json({
                status: ERROR_STATUS,
                message: "parameter email is empty"
            });
        }
        if (req.query.pass == "") {
            res.status(422).json({
                status: ERROR_STATUS,
                message: "parameter pass is empty"
            });
        }

        let email = <string>req.query.email;
        let pass = <string>req.query.pass;

        UserManager.GetInstance().StartRegister(email, pass).then((url) => {
            //log that we are starting an auth for an ip with the state
            Logger.Info(`Starting auth for ${req.ip}`);
            //send the url and uuid to the user
            res.status(200).json({
                status: SUCCESS_STATUS,
                message: url
            });
        }).catch((e) => {
            res.status(500).json({
                status: ERROR_STATUS,
                message: e.message
            });
        });
    }

    @Get("login")
    private Login(req: Request, res: Response) {
        
        if (!req.query.email || req.query.email == "") {
            res.status(403).json({
                status: ERROR_STATUS,
                message: "No email provided"
            });
        }
        if (!req.query.pass || req.query.pass == "") {
            res.status(403).json({
                status: ERROR_STATUS,
                message: "No pass provided"
            });
        }

        let email = <string>req.query.email;
        let pass = <string>req.query.pass;

        UserManager.GetInstance().Login(email, pass).then((result) => {
            res.status(200).json({
                status: SUCCESS_STATUS,
                message: result
            });
        }).catch((e) => {
            res.status(403).json({
                status: ERROR_STATUS,
                message: e.message
            });
        });
    }

    //endpoint that gets called when the user clicks either of the buttons on mal
    @Get()
    private authed(req: Request, res: Response) {
        let stat = UserManager.CheckRequestState(req,res);
        if (typeof stat === "boolean") {
            return;
        }
        let state = <string>stat;

        //user canceled or some other error we don't know of
        if (req.query.error) {
            let state = String(req.query.state);
            Logger.Info(`Auth ERR for ${state}: ${req.query.hint}`);

            UserManager.GetInstance().SetCanceled(state);
            res.status(200).json({
                status: SUCCESS_STATUS,
                message: `authentication for ${state} has been canceled`
            });
            return;
        }

        //No code defined
        if (!req.query.code) {
            Logger.Warn("missing parameter in request to /authed");
            
            UserManager.GetInstance().SetErrored(state);
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
            
            UserManager.GetInstance().SetErrored(state);
            res.status(422).json({
                status: ERROR_STATUS,
                message:"There is a problem with one of your parameters"
            });
            return;
        }
        
        UserManager.GetInstance().DoPending(state, code).then((redirUrl) => {
            console.log()
            res.redirect(redirUrl);
        }).catch((err) => {
            res.status(403).json({
                status: ERROR_STATUS,
                message: err.message
            });
        });        
    }  

    //TODO add login endpoint
}