import { axiosClient } from './common';

export const clearDB = async (): Promise<any | null> => {
    const response = axiosClient
        .post('/dev/clearDB', {})
        .then((resp) => resp.data)
        .catch((x) => console.log(x));
    return response;
};

export const initializeDB = async (): Promise<any | null> => {
    const response = axiosClient
        .post('/dev/initializeDB', {})
        .then((resp) => resp.data)
        .catch((x) => console.log(x));
    return response;
};
