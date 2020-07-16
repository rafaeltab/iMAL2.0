import { ResponseMessage, ErrorResponse, tokenResponse, RequestResponse, AnimeNode, ListPagination } from "../../MALWrapper/BasicTypes";
import { RefreshFetch } from '../../helpers/refresher';

export async function GetSearch(tokens: tokenResponse,query : string,limit?: number | undefined, offset?: number|undefined): Promise<RequestResponse<ListPagination<AnimeNode>>> {
    let url = `https://api.myanimelist.net/v2/anime?q=${query}&limit=${limit ? limit : 10}&offset=${offset ? offset : 0}`;
    let data = await RefreshFetch(tokens,url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${tokens.access_token}`
        }
    });

    let newTokens = data.tokens;

    let json: ListPagination<AnimeNode> | ErrorResponse = data.responseJson;
    if ((json as ErrorResponse).error) {
        return { response: <ErrorResponse>json };
    }
    
    return { response: { response: (json as ListPagination<AnimeNode>), tokens: newTokens } };
}