class NotImplementedError extends Error {
    constructor() {
        super('Not implemented functionality!');
        Object.setPrototypeOf(this, NotImplementedError.prototype);
    }
}

class InvalidParameterValue extends Error {
    constructor(parameter: any, reason: string) {
        super(
            `Invalid parameter '${
                Object.keys({ parameter })[0]
            }' => ${parameter}. Reason: ${reason}`
        );
        Object.setPrototypeOf(this, NotImplementedError.prototype);
    }
}

class ErrorResponse extends Error {
    statusCode: number;
    constructor(statusCode?: number, message?: string) {
        super(message ?? 'Unknown server error');
        this.statusCode = statusCode ?? 500;
    }
    //Status codes https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    static badRequestStatusCode = 400;
    static unauthorizedStatusCode = 401;
    static forbiddenStatusCode = 403;
    static notFoundStatusCode = 404;
    static internalServerError = 500;
}

export { NotImplementedError, InvalidParameterValue, ErrorResponse };
