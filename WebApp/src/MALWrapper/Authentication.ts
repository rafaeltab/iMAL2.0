import { CLIENT_ID, CLIENT_SECRET, ERROR_STATUS, SUCCESS_STATUS } from '../helpers/GLOBALVARS';
import { getPKCE, getUUID, isUUID } from '../helpers/randomCodes';
import { Logger } from '@overnightjs/logger';
import fetch from 'node-fetch';
import e = require('express');

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

type ErrorResponse = {
    error: string,
    message: string
}

export async function GetToken(code: string, state:string) : Promise<ResponseMessage | tokenResponse> {
    let url = `https://myanimelist.net/v1/oauth2/token`;   
    try {
        let data = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&code=${code}&code_verifier=${state}`
        });
        
        try {
            let jsData: tokenResponse | ErrorResponse= await data.json();
            if ((jsData as ErrorResponse).error) {
                let jsErr: ErrorResponse = <ErrorResponse>jsData;
                return {
                    status: ERROR_STATUS,
                    message: `error: ${jsErr.error} message: ${jsErr.message}`
                }
            } else {
                return <tokenResponse>jsData;
            }            
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