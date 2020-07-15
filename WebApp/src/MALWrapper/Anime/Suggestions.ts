import { ResponseMessage, ErrorResponse, tokenResponse, RequestResponse } from "../../MALWrapper/BasicTypes";
import { RefreshFetch } from '../../helpers/refresher';
import { Logger } from '@overnightjs/logger';

type ResponseType = {
    data: ResponseNode[],
    paging: {
        next : string
    }
}

type ResponseNode = {
    node: {
        id: number,
        title: string,
        main_picture: {
            medium: string,
            large: string
        }
    }
}


export async function GetSuggested(limit: number | undefined, offset: number, tokens: tokenResponse): Promise<RequestResponse<ResponseType>> {
    //try {
        let url = `https://api.myanimelist.net/v2/anime/suggestions?limit=${limit ? limit : 10}&offset=${offset ? offset : 0}`;
        let data = await RefreshFetch(tokens,url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${tokens.access_token}`
            }
        });

        let newTokens = data.tokens;

        let json: ResponseType | ErrorResponse = await data.response.json();
        if ((json as ErrorResponse).error) {
            return { response: <ErrorResponse>json };
        }
    
        return { response: { response: (json as ResponseType), tokens: newTokens } };
    /*} catch (e) {
        Logger.Info(JSON.stringify(e))
        return {
            response: {
                error: "connection",
                message: "Error connecting to MyAnimeList"
            }
        }
    }*/
}