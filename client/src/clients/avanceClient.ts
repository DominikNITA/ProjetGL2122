import { AvanceState } from '../../../shared/enums';
import { ApiResponse, IMission, IAvance, INoteLine } from '../types';
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

export const getAvancesForUser = async (
    userId: string,
    queryAvancesState: AvanceState[]
): Promise<ApiResponse<IAvance[]>> => {
    const response = axiosClient
        .get(`/avance`, {
            params: { owner: userId, states: queryAvancesState },
        })
        .then((resp) => ApiResponse.getOkResponse<IAvance[]>(resp.data))
        .catch((e) => returnErrorResponse<IAvance[]>(e));
    return response;
};

export const createAvance = async (avance: {
    owner?: string;
    description: number;
    mission: IMission;
    amount: number;
}): Promise<ApiResponse<IAvance[]>> => {
    const response = axiosClient
        .post(`/avance`, { avance })
        .then((resp) => ApiResponse.getOkResponse<IAvance[]>(resp.data))
        .catch((e) => returnErrorResponse<IAvance[]>(e));
    return response;
};

export const deleteAvance = async (
    avanceId?: string
): Promise<ApiResponse<any>> => {
    const response = axiosClient
        .delete(`/avance/${avanceId}`)
        .then((resp) => ApiResponse.getOkResponse<any>(resp.data))
        .catch((e) => returnErrorResponse<any>(e));
    return response;
};

export const getUserBalance = async (
    userId: string
): Promise<ApiResponse<Number>> => {
    const response = axiosClient
        .get(`/avance/${userId}/balance`)
        .then((resp) => ApiResponse.getOkResponse<Number>(resp.data))
        .catch((e) => returnErrorResponse<Number>(e));
    return response;
};

export const getAvanceBalance = async (
    avanceId: string
): Promise<ApiResponse<Number>> => {
    const response = axiosClient
        .get(`/avance/${avanceId}/balance`)
        .then((resp) => ApiResponse.getOkResponse<Number>(resp.data))
        .catch((e) => returnErrorResponse<Number>(e));
    return response;
};

export const getCorrelateNoteLines = async (
    avanceId: string
): Promise<ApiResponse<INoteLine[]>> => {
    const response = axiosClient
        .get(`/avance/${avanceId}/notelines`)
        .then((resp) => ApiResponse.getOkResponse<INoteLine[]>(resp.data))
        .catch((e) => returnErrorResponse<INoteLine[]>(e));
    return response;
};

export const updateCorrolatedNoteLines = async (
    avanceId: string,
    noteLines: INoteLine[]
): Promise<ApiResponse<IAvance>> => {
    const response = axiosClient
        .get(`/avance/${avanceId}/notelines`, { params: noteLines })
        .then((resp) => ApiResponse.getOkResponse<IAvance>(resp.data))
        .catch((e) => returnErrorResponse<IAvance>(e));
    return response;
};
