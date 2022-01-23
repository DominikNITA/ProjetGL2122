import { Month } from '../../../shared/enums';
import { ApiResponse, IMission, INote } from '../types';
import { axiosClient, returnErrorResponse } from './common';

export const getMissionsByService = async (
    serviceId?: string
): Promise<ApiResponse<IMission[]>> => {
    const response = axiosClient
        .get(`/service/${serviceId}/mission`)
        .then((resp) => ApiResponse.getOkResponse<IMission[]>(resp.data))
        .catch((e) => returnErrorResponse<IMission[]>(e));
    return response;
};
