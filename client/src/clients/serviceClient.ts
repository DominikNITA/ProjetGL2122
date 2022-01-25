import { Month } from '../../../shared/enums';
import { ApiResponse, IMission, INote, IService, IUser } from '../types';
import { axiosClient, returnErrorResponse } from './common';

export const getService = async (
    serviceId?: string
): Promise<ApiResponse<IService>> => {
    const response = axiosClient
        .get(`/service/${serviceId}`)
        .then((resp) => ApiResponse.getOkResponse<IService>(resp.data))
        .catch((e) => returnErrorResponse<IService>(e));
    return response;
};

export const createService = async (service: {
    name: string;
    leader?: string;
}): Promise<ApiResponse<IService> | null> => {
    return axiosClient
        .post(`/service`, { service: service })
        .then((resp) => ApiResponse.getOkResponse<IService>(resp.data))
        .catch((e) => returnErrorResponse<IService>(e));
};

export const getServiceUsers = async (
    serviceId?: string
): Promise<ApiResponse<IUser[]>> => {
    const response = axiosClient
        .get(`/service/${serviceId}/users`)
        .then((resp) => ApiResponse.getOkResponse<IUser[]>(resp.data))
        .catch((e) => returnErrorResponse<IUser[]>(e));
    return response;
};

export const getMissionsByService = async (
    serviceId?: string
): Promise<ApiResponse<IMission[]>> => {
    const response = axiosClient
        .get(`/service/${serviceId}/mission`)
        .then((resp) => ApiResponse.getOkResponse<IMission[]>(resp.data))
        .catch((e) => returnErrorResponse<IMission[]>(e));
    return response;
};

export const getMissionById = async (
    missionId?: string
): Promise<ApiResponse<IMission>> => {
    const response = axiosClient
        .get(`/service/mission/${missionId}`)
        .then((resp) => ApiResponse.getOkResponse<IMission>(resp.data))
        .catch((e) => returnErrorResponse<IMission>(e));
    return response;
};

export const createMission = async (
    mission: {
        name: string;
        description: string;
        startDate: Date;
        endDate: Date;
    },
    serviceId?: string
): Promise<ApiResponse<IMission> | null> => {
    return axiosClient
        .post(`/service/${serviceId}/mission`, { mission })
        .then((resp) => ApiResponse.getOkResponse<IMission>(resp.data))
        .catch((e) => returnErrorResponse<IMission>(e));
};

export const updateMission = async (
    mission: {
        name: string;
        description: string;
        service: IService['_id'];
        startDate: Date;
        endDate: Date;
    },
    missionId?: string
): Promise<ApiResponse<IMission> | null> => {
    return axiosClient
        .put(`/service/mission/${missionId}`, { mission })
        .then((resp) => ApiResponse.getOkResponse<IMission>(resp.data))
        .catch((e) => returnErrorResponse<IMission>(e));
};
