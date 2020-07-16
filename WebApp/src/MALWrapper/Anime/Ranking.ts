import { ResponseMessage, ErrorResponse, tokenResponse, RequestResponse, AnimeNode, ListPagination } from "../../MALWrapper/BasicTypes";
import { RefreshFetch } from '../../helpers/refresher';
import { Logger } from '@overnightjs/logger';

type ReturnType = AnimeNode & { ranking: {rank:number}}

export async function GetRanking(tokens: tokenResponse, rankingtype?:  undefined|"all" | "airing" | "upcoming" | "tv" | "ova" | "movie" | "special" | "bypopularity" | "favorite", limit?: undefined|number, offset?: undefined|number): Promise<RequestResponse<ListPagination<ReturnType>>> {
    let url = `https://api.myanimelist.net/v2/anime/ranking?ranking_type=${rankingtype != undefined ? rankingtype : "all"}&limit=${limit ? limit : 10}&offset=${offset ? offset : 0}`;
    let data = await RefreshFetch(tokens,url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${tokens.access_token}`
        }
    });

    let newTokens = data.tokens;

    let json: ListPagination<ReturnType> | ErrorResponse = data.responseJson;
    if ((json as ErrorResponse).error) {
        return { response: <ErrorResponse>json };
    }
    
    return { response: { response: (json as ListPagination<ReturnType>), tokens: newTokens } };
}