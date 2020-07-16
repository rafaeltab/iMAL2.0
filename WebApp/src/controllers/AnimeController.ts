import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { isUUID } from '../helpers/randomCodes';
import { ERROR_STATUS } from '../helpers/GLOBALVARS';
import { getDict } from './AuthedController';
import { GetSuggested } from '../MALWrapper/Anime/Suggestions';
import { isErrResp, isTokenResponse } from '../MALWrapper/BasicTypes';
import { GetDetails } from '../MALWrapper/Anime/Details';
import { GetRanking } from '../MALWrapper/Anime/Ranking';

//Main controller
@Controller('anime')
export class AnimeController {
    @Get("suggestions")
    private Suggestions(req: Request, res: Response) {        
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

        let limit;
        let offset;
        //check if limit is a parameter (non-breaking)
        if (req.query.limit) {
            try {
                limit = Number.parseInt(<string>req.query.limit);
                if (limit > 100) {
                    limit = 100;
                }
            } catch (e) {
                
            }
        }
        //check if offset is a parameter (non-breaking)
        if (req.query.offset) {
            try {
                offset = Number.parseInt(<string>req.query.offset);
            } catch (e) {
                
            }
        }

        //everything is good
        if (isTokenResponse(currStat)) {
            GetSuggested(limit, offset, currStat).then((response) => {
                let result = response.response;
                if (isErrResp(result)) {
                    res.status(500).json(result);
                } else {
                    codeDict.set(state, result.tokens);
                    res.status(200).json(result.response);
                }
                return;
            //Maybe it isnt :()
            }).catch(() => {
                res.status(500).json({
                    status: ERROR_STATUS,
                    message: "A server error occurred"
                });
            });
        //not ok
        } else {
            Logger.Info(JSON.stringify(currStat));
            res.status(403).json({
                status: ERROR_STATUS,
                message: "state has no tokens, authenticate properly first"
            });
        }
        
    }

    @Get("search")
    private search(req: Request, res: Response) {
        //TODO implement
        res.status(404).json({
            status: ERROR_STATUS,
            message: "not implemented"
        });
    }

    @Get("details")
    private details(req: Request, res: Response) {
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
        let animeid = 1;
        if (req.query.animeid) {
            try {
                animeid = parseInt(<string>req.query.animeid)
            } catch (e) {
                
            }
        }
        //TODO implement fields

        //everything is good
        if (isTokenResponse(currStat)) {
            GetDetails(animeid, currStat).then((response) => {
                let result = response.response;
                if (isErrResp(result)) {
                    res.status(500).json(result);
                } else {
                    codeDict.set(state, result.tokens);
                    res.status(200).json(result.response);
                }
                return;
            //Maybe it isnt :()
            }).catch(() => {
                res.status(500).json({
                    status: ERROR_STATUS,
                    message: "A server error occurred"
                });
            });
        //not ok
        } else {
            Logger.Info(JSON.stringify(currStat));
            res.status(403).json({
                status: ERROR_STATUS,
                message: "state has no tokens, authenticate properly first"
            });
        }
    }

    @Get("seasonal")
    private seasonal(req: Request, res: Response) {
        //TODO implement
        res.status(404).json({
            status: ERROR_STATUS,
            message: "not implemented"
        });
    }

    @Get("ranking")
    private ranking(req: Request, res: Response) {
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
        
        let limit: number|undefined;
        let rankingtype : undefined|"all" | "airing" | "upcoming" | "tv" | "ova" | "movie" | "special" | "bypopularity" | "favorite";
        let offset: undefined|number;
        if (req.query.limit) {
            try {
                limit = parseInt(<string>req.query.limit);
            } catch (e) {
                
            }
        }
        if (req.query.offset) {
            try {
                offset = parseInt(<string>req.query.offset);
            } catch (e) {
                
            }
        }
        if (req.query.rankingtype) {
            Logger.Info(req.query.rankingtype)
            const possible = ["all", "airing", "upcoming", "tv", "ova", "movie", "special", "bypopularity", "favorite"];
            if (possible.includes(<string>req.query.rankingtype)) {
                Logger.Info("Jay")
                rankingtype = <"all" | "airing" | "upcoming" | "tv" | "ova" | "movie" | "special" | "bypopularity" | "favorite">req.query.rankingtype;
            } else {
                Logger.Info(<string>req.query.rankingtype);
            }
        }

        //everything is good
        if (isTokenResponse(currStat)) {
            GetRanking(currStat,rankingtype,limit,offset).then((response) => {
                let result = response.response;
                if (isErrResp(result)) {
                    res.status(500).json(result);
                } else {
                    codeDict.set(state, result.tokens);
                    res.status(200).json(result.response);
                }
                return;
            //Maybe it isnt :()
            }).catch(() => {
                res.status(500).json({
                    status: ERROR_STATUS,
                    message: "A server error occurred"
                });
            });
        //not ok
        } else {
            Logger.Info(JSON.stringify(currStat));
            res.status(403).json({
                status: ERROR_STATUS,
                message: "state has no tokens, authenticate properly first"
            });
        }
    }
}