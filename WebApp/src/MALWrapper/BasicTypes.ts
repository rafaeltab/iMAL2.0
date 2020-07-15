export type ResponseMessage = {
    status: string,
    message: any
}

export type ErrorResponse = {
    error: string,
    message?: string
}

export type tokenResponse = {
    token_type: "Bearer",
    expires_in: number,
    access_token: string,
    refresh_token: string
}

export type RequestResponse<T> = {
    response: {
        response: T,
        tokens: tokenResponse
    } | ErrorResponse
}

export function isTokenResponse(obj: any): obj is tokenResponse{
    return 'token_type' in obj;
}

export function isErrResp(obj: any): obj is ErrorResponse {
    return 'error' in obj;
}