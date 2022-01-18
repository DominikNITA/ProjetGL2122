import { Month } from '../../../shared/enums';
import { INote } from '../types';
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
}): Promise<INote | null> => {
    const response = axiosClient
        .post(`/note`, { note: note })
        .then((resp) => resp.data)
        .catch((x) => console.log(x));
    return response;
};
