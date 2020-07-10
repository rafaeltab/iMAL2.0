import { CLIENT_ID, CLIENT_SECRET, ERROR_STATUS, SUCCESS_STATUS } from '../helpers/GLOBALVARS';
import { getPKCE, getUUID, isUUID } from '../helpers/randomCodes';
import { Logger } from '@overnightjs/logger';
import fetch from 'node-fetch';

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

export async function GetToken(code: string) : Promise<ResponseMessage | tokenResponse> {
    let url = `https://myanimelist.net/v1/oauth2/token`;
    let verifier = getPKCE(128);
   
    try {
        let data = await fetch(url, {
            method: "POST",
            headers: {
                'Authorization': `Basic ${CLIENT_SECRET}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `client_id=${CLIENT_ID}&grant_type=authorization_code&code=${code}&code_verifier=${verifier}`
        });

        try {
            let jsData: tokenResponse = await data.json();
    
            return jsData;
        } catch (e) {
            return {
                status: ERROR_STATUS,
                message: "Error connecting with MyAnimeList"
            }
        }
    } catch (e) {
        return {
            status: ERROR_STATUS,
            message: "Error connecting with MyAnimeList"
        };
    }
}