import axios, { AxiosRequestConfig } from 'axios';

const baseUrl = 'http://localhost:4000';

const config: AxiosRequestConfig = {
    baseURL: baseUrl,
};
const axiosClient = axios.create(config);

axiosClient.interceptors.request.use(function (config) {
    const token = JSON.parse(localStorage.getItem('token') ?? '');
    if (token !== null) {
        config.headers!.auth = token;
    }
    return config;
});

export { axiosClient };
