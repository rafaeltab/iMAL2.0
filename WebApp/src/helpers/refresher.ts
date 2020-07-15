import { ErrorResponse, isErrResp, tokenResponse, isTokenResponse } from '../MALWrapper/BasicTypes';
import * as fetch from 'node-fetch';
import { json } from 'body-parser';
import {RefreshToken } from '../MALWrapper/Authentication'
import { Logger } from '@overnightjs/logger';

export type RefreshType = {
    tokens: tokenResponse,
    response: fetch.Response
}

export async function RefreshFetch(tokens: tokenResponse, url: fetch.RequestInfo, init?: fetch.RequestInit | undefined): Promise<RefreshType> {
    //make first request
    let res = await fetch.default(url, init);
    //get json from the request
    let jsonRes = await res.json();
    //check if the response is an error
    if (isErrResp(jsonRes)) {
        //check if the response is invalid_token error
        if (jsonRes.error == "invalid_token") {
            //get new tokens
            let refresh = await RefreshToken(tokens.refresh_token);
            //double check the new token is a token
            if (isTokenResponse(refresh)) {
                //put the token in the headers
                let newInit = addTokenHeader(refresh.access_token, init);
                //make the request again with new token
                let res2 = await fetch.default(url, newInit);

                //return new result
                return {
                    tokens: refresh,
                    response: res2
                }
            }
        }
    }

    //return old tokens + response in case of any errors
    return {
        tokens: tokens,
        response: res
    }
}

//updata a request init with new tokens
function addTokenHeader(token: string, init?: fetch.RequestInit | undefined) : fetch.RequestInit {
    if (!init) {
        return {
            headers: {
                'Authorization': "Bearer " + token
            }
        }
    } else {
        if (!init.headers) {
            init.headers = {
                'Authorization': "Bearer " + token
            }
        }
        if (init.headers instanceof fetch.Headers) {            
            init.headers.set('Authorization',"Bearer " + token)            
        } else {
            if (Array.isArray(init.headers)) {
                Logger.Info(JSON.stringify(init.headers));
            } else {
                init.headers["Authorization"] = "Bearer " + token
            }
        }

        return init;
    }

    
}