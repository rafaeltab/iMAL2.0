import { Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { getPKCE, getUUID, isUUID } from '../helpers/randomCodes';

type dictEntry = {
    state: string,
    code: string
}

let codeDict: Map<string, string> = new Map<string, string>();



let CLIENT_ID = process.env.CLIENT_ID || "noenv";
let CLIENT_SECRET = process.env.CLIENT_SECRET || "noenv";

@Controller('authed')
export class AuthedController {
    @Get("start")
    private startAuth(req: Request, res: Response) {
        let codeVerif : string = getPKCE(128);
        let uuidState: string = getUUID();

        codeDict.set(uuidState, "pending");

        let url = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&code_challenge=${codeVerif}&state=${uuidState}`;
        Logger.Info(`Starting auth for ${req.ip} with uuidState: ${uuidState}`);
        res.status(200).json({
            url: url
        });
    }

    @Get()
    private authed(req: Request, res: Response) {
        //TODO handle rejected
        if (!(req.query.code && req.query.state)) {
            Logger.Warn("missing parameter in request to /authed");
            res.status(422).json({
                error: "you are missing a required parameter"
            });
        }
        let state: string = String(req.query.state);
        let code: string = String(req.query.code);
        if (!isUUID(state)) {
            Logger.Warn("State parameter was of incorrect format in request to /authed");
            res.status(422).json({
                error:"There is a problem with one of your parameters"
            });
        }

        const codeRe = /[0-9a-z]{700,1300}/    
        if (code.match(codeRe)) {
            Logger.Warn("Code parameter was of incorrect format in request to /authed");
            res.status(422).json({
                error:"There is a problem with one of your parameters"
            });
        }
    }    
}