import axios, { AxiosError, AxiosRequestConfig } from 'axios';
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

function returnErrorResponse<Type>(err: Error | AxiosError) {
    if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        return ApiResponse.getErrorResponse<Type>(error.response?.data.message);
    } else {
        return ApiResponse.getErrorResponse<Type>('Unknown error');
    }
}

export { axiosClient, returnErrorResponse };
