import { ResponseMessage, ErrorResponse, tokenResponse, RequestResponse, AnimeNode, ListPagination, Season } from "../../MALWrapper/BasicTypes";
import { RefreshFetch } from '../../helpers/refresher';

export async function GetSeasonal(tokens: tokenResponse, sort: "anime_score" | "anime_num_list_users", year: number, season: "summer" | "winter" | "fall" | "spring", limit?: number | undefined, offset?: number | undefined): Promise<RequestResponse<ListPagination<AnimeNode> & {season:Season}>> {
    let url = `https://api.myanimelist.net/v2/anime/season/${year}/${season}?sort=${sort}&limit=${limit ? limit : 10}&offset=${offset ? offset : 0}`;
    let data = await RefreshFetch(tokens,url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${tokens.access_token}`
        }
    });

    let newTokens = data.tokens;

    let json: (ListPagination<AnimeNode> & {season:Season}) | ErrorResponse = data.responseJson;
    if ((json as ErrorResponse).error) {
        return { response: <ErrorResponse>json };
    }
    
    return { response: { response: (json as ListPagination<AnimeNode> & {season:Season}), tokens: newTokens } };
}