import { ApiResponse, IUser } from '../types';
import { axiosClient, returnErrorResponse } from './common';

export const getUserById = async (
    userId?: IUser
): Promise<ApiResponse<IUser>> => {
    const response = axiosClient
        .get(`/user/${userId}`)
        .then((resp) => ApiResponse.getOkResponse<IUser>(resp.data))
        .catch((e) => returnErrorResponse<IUser>(e));
    return response;
};
