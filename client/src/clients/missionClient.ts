import { ApiResponse, IMission } from '../types';
import { axiosClient, returnErrorResponse } from './common';

export const getMission = async (
    missionId?: IMission
): Promise<ApiResponse<IMission>> => {
    const response = axiosClient
        .get(`/mission/${missionId}`)
        .then((resp) => ApiResponse.getOkResponse<IMission>(resp.data))
        .catch((e) => returnErrorResponse<IMission>(e));
    return response;
};

export const deleteMission = async (
    missionId: string
): Promise<ApiResponse<void>> => {
    const response = axiosClient
        .delete(`/mission/${missionId}`)
        .then((resp) => ApiResponse.getOkResponse<void>(resp.data))
        .catch((e) => returnErrorResponse<void>(e));
    return response;
};
