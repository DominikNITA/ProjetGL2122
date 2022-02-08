import { ApiResponse, IMission, IAvance } from '../types';
import { axiosClient, returnErrorResponse } from './common';

export const getAvance = async (
    avanceId?: string
): Promise<ApiResponse<IAvance>> => {
    const response = axiosClient
        .get(`/avance/${avanceId}`)
        .then((resp) => ApiResponse.getOkResponse<IAvance>(resp.data))
        .catch((e) => returnErrorResponse<IAvance>(e));
    return response;
};
