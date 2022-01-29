import { Month, NoteState } from '../enums';
import { ApiResponse, INote, INoteLine } from '../types';
import { axiosClient, returnErrorResponse } from './common';

export const getNotesForUser = async (
    userId?: string
): Promise<ApiResponse<INote[]>> => {
    const response = axiosClient
        .get('/note', { params: { owner: userId } })
        .then((resp) => ApiResponse.getOkResponse<INote[]>(resp.data))
        .catch((e) => returnErrorResponse<INote[]>(e));
    return response;
};

export const getNotesForUserWithState = async (
    userId: string,
    queryNoteState: NoteState[],
    limit = 1000,
    page = 1
): Promise<ApiResponse<INote[]>> => {
    const response = axiosClient
        .get('/note', {
            params: {
                owner: userId,
                states: queryNoteState,
                limit: limit,
                page: page,
            },
        })
        .then((resp) => ApiResponse.getOkResponse<INote[]>(resp.data))
        .catch((e) => returnErrorResponse<INote[]>(e));
    return response;
};

export const getNote = async (
    noteId: string
): Promise<ApiResponse<INote> | null> => {
    const response = axiosClient
        .get(`/note/${noteId}`)
        .then((resp) => ApiResponse.getOkResponse<INote>(resp.data))
        .catch((e) => returnErrorResponse<INote>(e));
    return response;
};

export const createNote = async (note: {
    owner?: string;
    year: number;
    month: Month;
}): Promise<ApiResponse<INote> | null> => {
    return axiosClient
        .post(`/note`, { note: note })
        .then((resp) => ApiResponse.getOkResponse<INote>(resp.data))
        .catch((e) => returnErrorResponse<INote>(e));
};

export const createNoteLine = async (
    noteLine: INoteLine,
    note: INote
): Promise<ApiResponse<INoteLine> | null> => {
    console.log(note);
    return axiosClient
        .post(`/note/line`, { noteLine: noteLine, noteId: note._id })
        .then((resp) => ApiResponse.getOkResponse<INoteLine>(resp.data))
        .catch((e) => returnErrorResponse<INoteLine>(e));
};

export const updateNoteLine = async (
    noteLine: INoteLine
): Promise<ApiResponse<INoteLine> | null> => {
    return axiosClient
        .patch(`/note/line`, { noteLineId: noteLine._id, noteLine: noteLine })
        .then((resp) => ApiResponse.getOkResponse<INoteLine>(resp.data))
        .catch((e) => returnErrorResponse<INoteLine>(e));
};
