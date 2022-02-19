import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import moment from 'moment';
import { ApiResponse } from '../types';

const baseUrl = 'http://localhost:4000';

const config: AxiosRequestConfig = {
    baseURL: baseUrl,
};
const axiosClient = axios.create(config);

axiosClient.interceptors.request.use(function (config) {
    const token = JSON.parse(localStorage.getItem('token') ?? '');
    if (token !== null) {
        config.headers!.auth = token;
    }
    return config;
});

axiosClient.interceptors.response.use((originalResponse) => {
    handleDates(originalResponse.data);
    return originalResponse;
});

const isoDateFormat =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

function isIsoDateString(value: any): boolean {
    return value && typeof value === 'string' && isoDateFormat.test(value);
}

function parseISO(value: string): moment.Moment {
    return moment(value);
}

export function handleDates(body: any) {
    if (body === null || body === undefined || typeof body !== 'object')
        return body;

    for (const key of Object.keys(body)) {
        const value = body[key];
        if (isIsoDateString(value)) body[key] = parseISO(value);
        else if (typeof value === 'object') handleDates(value);
    }
}

function returnErrorResponse<Type>(err: Error | AxiosError) {
    if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        return ApiResponse.getErrorResponse<Type>(error.response?.data.message);
    } else {
        return ApiResponse.getErrorResponse<Type>('Unknown error');
    }
}

export { axiosClient, returnErrorResponse };
