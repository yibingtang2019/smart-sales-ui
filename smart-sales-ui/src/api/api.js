import axios from 'axios';
import MintUI from 'mint-ui';

import { getLocalItem } from './storage'

const axiosRequest = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 1000 * 60,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
});

axiosRequest.interceptors.request.use(config => {
    const token = getLocalItem('token');
    if (token) {
        config.headers['Authorization'] = `FLASK ${token}`;
    }
    return config;
}, err);

axiosRequest.interceptors.response.use((response) => {
    const res = response.data;
    if(response.status === 200 || response.status === 201) {
        return response;
    } else {
        if(response.status  === 403 || response.status === 405) {
            MintUI.MessageBox({message: '用户无访问权限'});
        } else if(response.status == 401) {
            MintUI.MessageBox({message: '登录过期，请重新登录'});
            setTimeout(() => { MintUI.Indicator.close(); }, 1000);
        }
        return Promise.reject(res);
    }
}, err);

const err = (error) => {
    console.log(error);
    if(error.message == 'Network Error') {
        error.message = "网络故障无法连接服务器";
    }
    return Promise.reject(error);
}

const handleError = (res) => {
    if(res.response.status != 404 && res.response.status != 401) {
        let errorMessage = "";
        if(res.response.data && res.response.data.errors) {
            errorMessage = window.JSON.stringify(res.response.data.errors);
        }
        if((res.response.data && res.response.data.message != "") || errorMessage != "") {
            if((typeof res.response.data.message) == "object") {
                errorMessage = window.JSON.stringify(res.response.data.message);
            }
            MintUI.MessageBox({message: `${res.response.data.message} ${errorMessage}`});
        }
    }
    if(res.response.status == 401) {
        MintUI.MessageBox({message: '登录过期，请重新登录'});
        setTimeout(() => { MintUI.Indicator.close(); }, 1000);
    }
    if(res.response.status != 404) {
        console.log(res);
    }
}

const get = async(url, params, resolve, reject) => {
    try {
        if(checkIsExpired()) {
            MintUI.MessageBox({message: '登录过期，请重新登录'});
            setTimeout(() => { MintUI.Indicator.close(); }, 1000);
            if(reject) {
                return reject('err');
            } else {
                return Promise.reject();
            }
        } else {
            return handleGet(url, params, resolve, reject);
        }
    } catch (err) {
        return Promise.reject(err);
    }
}

const handleGet = async(url, params, resolve, reject) => {
    if(!reject) {
        reject = (error) => {
            handleError(error);
        };
    }
    if(resolve) {
        return await axiosRequest.get(url, { params: params }).then(resolve).catch(reject);
    } else {
        return await axiosRequest.get(url, { params: params }).catch(reject);
    }
}

const post = async(url, params, resolve, reject) => {
    try {
        if(url.indexOf("/api/user/login") > 0) {
            return handlePost(url, params, resolve, reject);
        } else {
            if(checkIsExpired()) {
                MintUI.MessageBox({message: '登录过期，请重新登录'});
                setTimeout(() => { MintUI.Indicator.close(); }, 1000);
                if(reject) {
                    return reject('err');
                } else {
                    return Promise.reject();
                }
            } else {
                return handlePost(url, params, resolve, reject);
            }
        }
    } catch (err) {
        return Promise.reject(err);
    }
}

const handlePost = async(url, params, resolve, reject) => {
    if(!reject) {
        reject = (error) => {
            handleError(error);
        };
    }
    if(resolve) {
        return await axiosRequest.post(url, params).then(resolve).catch(reject);
    } else {
        return await axiosRequest.post(url, params).catch(reject);
    }
}

const put = async(url, params, resolve, reject) => {
    try {
        if(checkIsExpired()) {
            MintUI.MessageBox({message: '登录过期，请重新登录'});
            setTimeout(() => { MintUI.Indicator.close(); }, 1000);
            if(reject) {
                return reject('err');
            } else {
                return Promise.reject();
            }
        } else {
            return handlePut(url, params, resolve, reject);
        }
    } catch (err) {
        return Promise.reject(err);
    }
}

const handlePut = async(url, params, resolve, reject) => {
    if(!reject) {
        reject = (error) => {
            handleError(error);
        };
    }
    if(resolve) {
        await axiosRequest.put(url, params).then(resolve).catch(reject);
    } else {
        await axiosRequest.put(url, params).catch(reject);
    }
}

const remove = async(url, params, resolve, reject) => {
    try {
        if(checkIsExpired()) {
            MintUI.MessageBox({message: '登录过期，请重新登录'});
            setTimeout(() => { MintUI.Indicator.close(); }, 1000);
            if(reject) {
                return reject('err');
            } else {
                return Promise.reject();
            }
        } else {
            return handleDelete(url, params, resolve, reject);
        }
    } catch (err) {
        return Promise.reject(err);
    }
}

const handleDelete = async(url, params, resolve, reject) => {
    if(!reject) {
        reject = (error) => {
            handleError(error);
        };
    }
    if(resolve) {
        await axiosRequest.delete(url, { params: params }).then(resolve).catch(reject);
    } else {
        await axiosRequest.delete(url, { params: params }).catch(reject);
    }
}

export const request = async(url, method = 'get', params = {}, resolve = null, reject = null) => {
	try {
        let res = {};
        if(method === "get") {
            res = await get(url, params, resolve, reject);
        } else if(method === "post") {
            res = await post(url, params, resolve, reject);
        }  else if(method === "put") {
            res = await put(url, params, resolve, reject);
        } else if(method === "delete") {
            res = await remove(url, params, resolve);
        } else {
            MintUI.MessageBox({message: `${method} method is not supported`});
        }
        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}

export const requestUpload = async (url, file, resolve, reject = null) => {
    if(!reject) {
        reject = (error) => {
            handleError(error);
        };
    }
    try {
        const token = getLocalItem("token");
        return axios.create({
            timeout: 1000 * 60,
            headers: { 
                token: `FLASK ${token}`, 
                "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Origin": "*"
            }
        }).put(url, file).then(resolve).catch(reject);
    } catch (error) {
        return Promise.reject(err);
    }
}

const checkIsExpired = () => {
    let login_date = getLocalItem('login_time');
        if(login_date != undefined) {
        let expired_date = new Date(new Date(login_date).setHours(new Date(login_date).getHours() + 8));
        let now = new Date();
        return (expired_date < now);
    } else {
        return false;
    }
}