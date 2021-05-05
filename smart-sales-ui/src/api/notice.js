import { 
    request
} from './api';

export const getNoticeList = (resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/notice/search`, "get", {}, resolve);
}

export const saveNotice = (data, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/notice`, "post", data, resolve);
}

export const editNotice = (data, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/notice`, "put", data, resolve);
}

export const updateNoticeStatus = (notice_id, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/notice/status/${notice_id}`, "put", {}, resolve);
}

export const deleteNotice = (id, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/notice/delete/${id}`, "delete", {}, resolve);
}