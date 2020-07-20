import { ErrorResponse, isErrResp, tokenResponse, isTokenResponse } from '../MALWrapper/BasicTypes';
import * as fetch from 'node-fetch';
import { json } from 'body-parser';
import { RefreshToken } from '../MALWrapper/Authentication'
import { Logger } from '@overnightjs/logger';
import { UserManager } from './UserManager';

//TODO always put authorization in the headers our selves
export async function RefreshFetch(uuid: string, url: fetch.RequestInfo, init?: fetch.RequestInit | undefined): Promise<any> {
    //get current tokens
    let tokens = await UserManager.GetInstance().GetTokensForUUID(uuid);
    
    //make first request
    let ini = addTokenHeader(tokens.token, init);
    let res = await fetch.default(url, ini);
    //get json from the request
    let jsonRes = await res.json();
    //check if the response is an error
    if (isErrResp(jsonRes)) {
        //check if the response is invalid_token error
        if (jsonRes.error == "invalid_token") {
            //get new tokens
            let refresh = await RefreshToken(tokens.refreshtoken);
            //double check the new token is a token
            if (isTokenResponse(refresh)) {
                //put the token in the headers
                let newInit = addTokenHeader(refresh.access_token, init);
                //make the request again with new token
                let res2 = await fetch.default(url, newInit);

                //update the tokens
                await UserManager.GetInstance().TryUpdateTokens(uuid, refresh.access_token, refresh.refresh_token);
                //return new result
                return res2.json();
            }
        }
    }

    //return response in case of any errors
    return jsonRes;
}

//updata a request init with new tokens
function addTokenHeader(token: string, init?: fetch.RequestInit | undefined): fetch.RequestInit {
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