import { ApiResponse, IMission } from '../types';
import { axiosClient, returnErrorResponse } from './common';

export const getMission = async (
    missionId?: string | IMission
): Promise<ApiResponse<IMission>> => {
    const response = axiosClient
        .get(`/mission/${missionId}`)
        .then((resp) => ApiResponse.getOkResponse<IMission>(resp.data))
        .catch((e) => returnErrorResponse<IMission>(e));
    return response;
};
