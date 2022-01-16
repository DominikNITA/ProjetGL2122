import { IUser } from '../types';
import { axiosClient } from './common';

type LoginReturnType = {
    user?: IUser;
    accessToken?: string;
};

export const login = async (
    email: string,
    password: string
): Promise<LoginReturnType | null> => {
    try {
        const response = await axiosClient.post('/auth/login', {
            email: email,
            password: password,
        });
        return response.data;
    } catch {
        return null;
    }
};
