import axios, { AxiosResponse } from 'axios';
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
): Promise<AxiosResponse<ApiDataType>> => {
    try {
        const response: AxiosResponse<ApiDataType> = await axios.post(
            baseUrl + '/auth/login',
            {
                email: email,
                password: password,
            }
        );

        console.log(response.data);
        return response;
    } catch (error: any) {
        throw new Error(error);
    }
};
