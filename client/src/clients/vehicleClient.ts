import { ApiResponse, IVehicle } from '../types';
import { axiosClient, returnErrorResponse } from './common';

export const getVehiclesForUser = async (
    userId?: string
): Promise<ApiResponse<IVehicle[]>> => {
    const response = axiosClient
        .get('/vehicle', { params: { owner: userId } })
        .then((resp) => ApiResponse.getOkResponse<IVehicle[]>(resp.data))
        .catch((e) => returnErrorResponse<IVehicle[]>(e));
    return response;
};

export const createVehicle = async (
    vehicle: Partial<IVehicle>
): Promise<ApiResponse<IVehicle> | null> => {
    return axiosClient
        .post(`/vehicle`, { vehicle: vehicle })
        .then((resp) => ApiResponse.getOkResponse<IVehicle>(resp.data))
        .catch((e) => returnErrorResponse<IVehicle>(e));
};
