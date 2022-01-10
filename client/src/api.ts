import axios from 'axios';
import { IUser } from './types';

const baseUrl = 'http://localhost:4000';

type ApiDataType = {
    message: string;
    status: string;
    user?: IUser;
    token?: string;
};

export const login = async (
    email: string,
    password: string
): Promise<ApiDataType | null> => {
    const response = axios
        .post(baseUrl + '/auth/login', {
            email: email,
            password: password,
        })
        .then((resp) => resp.data)
        .catch((x) => console.log(x));
    return response;
};

export const clearDB = async (): Promise<any | null> => {
    const response = axios
        .post(baseUrl + '/dev/clearDB', {})
        .then((resp) => resp.data)
        .catch((x) => console.log(x));
    return response;
};

export const initializeDB = async (): Promise<any | null> => {
    const response = axios
        .post(baseUrl + '/dev/initializeDB', {})
        .then((resp) => resp.data)
        .catch((x) => console.log(x));
    return response;
};
