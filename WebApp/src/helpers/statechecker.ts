import { Request, Response } from 'express';
import { getDict, pending } from '../controllers/AuthedController';
import { isUUID } from './randomCodes';
import { ERROR_STATUS } from './GLOBALVARS';
import { tokenResponse } from '../MALWrapper/BasicTypes';

export function DoState(req: Request, res: Response, codeDict: Map<string, tokenResponse | pending | "canceled" | "error">) : boolean | string {
    

        //state is one of the paramaters
        if (!req.query.state) {
            res.status(403).json({
                status: ERROR_STATUS,
                message: "Missing parameter status"
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

        //state exists
        if (!codeDict.has(state)) {
            res.status(403).json({
                status: ERROR_STATUS,
                message: "Incorrect State"
            });
            return false;
    }
    
    return state;
}