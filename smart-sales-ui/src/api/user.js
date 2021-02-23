import { request } from './api';

export const login = (username, password, resolve, reject) => {
    let data = { "username": username, password: password };
    return request(`${process.env.VUE_APP_API_BASE_URL}/auth/login`, "post", data, resolve, reject);
}