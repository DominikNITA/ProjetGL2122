import axios, { Axios, AxiosError } from 'axios';
import { Month } from '../../../shared/enums';
import { ApiResponse, INote } from '../types';
import { axiosClient } from './common';

export const getNotesForUser = async (userId?: string): Promise<INote[]> => {
    const response = axiosClient
        .get('/note', { params: { owner: userId } })
        .then((resp) => resp.data)
        .catch(() => []);
    return response;
};

export const getNote = async (noteId: string): Promise<INote | null> => {
    const response = axiosClient
        .get(`/note/${noteId}`)
        .then((resp) => resp.data)
        .catch((x) => console.log(x));
    return response;
};

export const createNote = async (note: {
    owner: string;
    year: number;
    month: Month;
}): Promise<ApiResponse<INote> | null> => {
    return axiosClient
        .post(`/note`, { note: note })
        .then((resp) => {
            return ApiResponse.getOkResponse<INote>(resp.data);
        })
        .catch((err: Error | AxiosError) => {
            if (axios.isAxiosError(err)) {
                const error = err as AxiosError;
                return ApiResponse.getErrorResponse<INote>(
                    error.response?.data.message
                );
                // Access to config, request, and response
            } else {
                return ApiResponse.getErrorResponse<INote>('Unknown error');
            }
        });
};
