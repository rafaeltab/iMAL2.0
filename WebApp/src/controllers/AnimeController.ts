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
import { GetSearch } from '../MALWrapper/Anime/Search';
import { parse } from 'path';
import { GetSeasonal } from '../MALWrapper/Anime/Seasonal';
import { DoState } from '../helpers/statechecker';

//Main controller
@Controller('anime')
export class AnimeController {
    @Get("suggestions")
    private Suggestions(req: Request, res: Response) {        
        let codeDict = getDict();
        let stat = DoState(req, res, codeDict);
        if (typeof stat === "boolean") {
            return;
        }
        let state = <string>stat;
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
            GetSuggested(currStat, limit, offset).then((response) => {
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
        let codeDict = getDict();
        let stat = DoState(req, res, codeDict);
        if (typeof stat === "boolean") {
            return;
        }
        let state = <string>stat;
        let currStat = codeDict.get(state);

        if (!req.query.query) {
            res.status(422).json({
                status: ERROR_STATUS,
                message: "query paramater is missing"
            });
            return;
        }

        let query = <string>req.query.query;
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
            GetSearch(currStat,query,limit, offset).then((response) => {
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

    @Get("details")
    private details(req: Request, res: Response) {
        let codeDict = getDict();
        let stat = DoState(req, res, codeDict);
        if (typeof stat === "boolean") {
            return;
        }
        let state = <string>stat;
        let currStat = codeDict.get(state);
        
        let animeid = 1;
        if (req.query.animeid) {
            try {
                animeid = parseInt(<string>req.query.animeid)
            } catch (e) {
                
            }
        }

        //everything is good
        if (isTokenResponse(currStat)) {
            GetDetails( currStat, animeid).then((response) => {
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
        let codeDict = getDict();
        let stat = DoState(req, res, codeDict);
        if (typeof stat === "boolean") {
            return;
        }
        let state = <string>stat;
        let currStat = codeDict.get(state);

        let year = 2020;
        if (req.query.year) {
            try {
                year = parseInt(<string>req.query.year);
                if (year < 1917) {
                    year = 2020;
                } else if(year > 2021){
                    year = 2020;
                }                
            } catch (e) {}
        }

        let season: "summer" | "winter" | "fall" | "spring" = "summer";
        if (req.query.season) {
            try {
                let tempSeason = <string>req.query.season;
                const seasons = ["winter", "spring", "summer", "fall"];
                if (!seasons.includes(tempSeason)) {
                    season = "summer";
                } else {
                    season = <"summer" | "winter" | "fall" | "spring"> tempSeason;
                }
            } catch (e) {
                
            }
        }

        let sort: "anime_score" | "anime_num_list_users" = "anime_score";
        if (req.query.sort) {
            try {
                const sortScore = ["score", "animescore", "anime_score"];
                const sortUsers = ["users", "listed", "list_users", "listusers", "anime_num_list_users", "num_list_users", "num_listusers"]
                if (sortScore.includes(<string>req.query.sort)) {
                    sort = "anime_score";
                } else if (sortUsers.includes(<string>req.query.sort)) {
                    sort = "anime_num_list_users";
                }
            } catch (e) {
                
            }
        }


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
            GetSeasonal(currStat,sort,year,season, limit, offset).then((response) => {
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

    @Get("ranking")
    private ranking(req: Request, res: Response) {
        let codeDict = getDict();
        let stat = DoState(req, res, codeDict);
        if (typeof stat === "boolean") {
            return;
        }
        let state = <string>stat;
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
            const possible = ["all", "airing", "upcoming", "tv", "ova", "movie", "special", "bypopularity", "favorite"];
            if (possible.includes(<string>req.query.rankingtype)) {
                rankingtype = <"all" | "airing" | "upcoming" | "tv" | "ova" | "movie" | "special" | "bypopularity" | "favorite">req.query.rankingtype;
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