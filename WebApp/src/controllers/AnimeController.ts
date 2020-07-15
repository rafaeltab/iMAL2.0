import { Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { isUUID } from '../helpers/randomCodes';
import { CLIENT_ID, CLIENT_SECRET, ERROR_STATUS, SUCCESS_STATUS } from '../helpers/GLOBALVARS';
import { getDict } from './AuthedController';
import { ERR } from '@overnightjs/logger/lib/constants';
import { GetSuggested } from '../MALWrapper/Anime/Suggestions';
import { ErrorResponse, isErrResp, tokenResponse } from '../MALWrapper/BasicTypes';

//Main controller
@Controller('anime')
export class AnimeController {
    @Get("suggestions")
    private logCodeDict(req: Request, res: Response) {        
        let codeDict = getDict();

        //state is one of the paramaters
        if (!req.query.state) {
            res.status(403).json({
                status: ERROR_STATUS,
                message: "Missing parameter status"
            });
            return;
        }

        let state: string = String(req.query.state);

        //state is valid format
        if (!isUUID(state)) {
            res.status(403).json({
                status: ERROR_STATUS,
                message: "State incorrect format"
            });
            return;
        }

        //state exists
        if (!codeDict.has(state)) {
            res.status(403).json({
                status: ERROR_STATUS,
                message: "Incorrect State"
            });
            return;
        }

        let currStat = codeDict.get(state);

        //everything is good
        if ((currStat as tokenResponse).token_type) {
            //TODO implement refreshing tokens
            let tokenStat = <tokenResponse>currStat;
            GetSuggested(5, 0, tokenStat).then((response) => {
                let result = response.response;
                if (isErrResp(result)) {

                } else {
                    codeDict.set(state, result.tokens);
                    res.status(200).json(result.response);

                }
            });
            

        }

        


    }
}