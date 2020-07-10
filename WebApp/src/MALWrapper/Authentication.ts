import { CLIENT_ID, CLIENT_SECRET, ERROR_STATUS, SUCCESS_STATUS } from '../helpers/GLOBALVARS';
import { getPKCE, getUUID, isUUID } from '../helpers/randomCodes';
import { Logger } from '@overnightjs/logger';

export type tokenResponse = {
    token_type: "Bearer",
    expires_in: number,
    access_token: string,
    refresh_token: string
}

export type ResponseMessage = {
    status: string,
    message: any
}

export function GetToken(code: string) : ResponseMessage | tokenResponse {
    let url = `https://myanimelist.net/v1/oauth2/token`;
    let verifier = getPKCE(128);
    fetch(url,{
        method: "POST",
        headers: {
            'Authorization': `Basic ${CLIENT_SECRET}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `client_id=${CLIENT_ID}&grant_type=authorization_code&code=${code}&code_verifier=${verifier}`
    }).then((data : Response) => {
        data.json().then((data: tokenResponse) => {
            return data;
        }).catch((e) => {
            Logger.Err("Could not parse JSON from data received by MAL API");
            return {
                status: ERROR_STATUS,
                message: "Error with data received from MyAnimeList"
            }
        });        
    }).catch((e) => {
        Logger.Err("Could not connect to MAL API");
        return {
            status: ERROR_STATUS,
            message: "Error connecting with MyAnimeList"
        }
    });
    return {
        status: ERROR_STATUS,
        message: "not sure what happened"
    };
}