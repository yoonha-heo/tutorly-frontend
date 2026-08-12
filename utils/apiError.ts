export interface ApiErrorResponse {
    statusCode: number;
    code: string;
    message: string;
    details?: any;
    traceId?: string;
    timestamp?: string;
    path?: string;
}

export class ApiError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly details?: any;
    readonly traceId?: string;
    readonly timestamp?: string;
    readonly path?: string;

    constructor(data: ApiErrorResponse) {
        super(data.message);

        this.name = 'ApiError';
        this.statusCode = data.statusCode;
        this.code = data.code;
        this.details = data.details;
        this.traceId = data.traceId;
        this.timestamp = data.timestamp;
        this.path = data.path;

        Object.setPrototypeOf(this, ApiError.prototype);
    }


    static isApiError(error: unknown): error is ApiError {
        return error instanceof ApiError;
    }

    get isClientError(): boolean {
        return this.statusCode >= 400 && this.statusCode < 500;
    }

    get isServerError(): boolean {
        return this.statusCode >= 500;
    }
}