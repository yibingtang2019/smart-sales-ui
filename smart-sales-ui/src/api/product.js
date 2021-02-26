import { 
    request, 
    requestUpload 
} from './api';

export const getByID = (id, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/product/${id}`, "get", {}, resolve);
}

export const getProductList = (params, resolve, reject) => {
    return request(`${process.env.VUE_APP_API_URL}/products/search`, "get", params, resolve, reject);
}

export const getHomeProductList = (resolve, reject) => {
    return request(`${process.env.VUE_APP_API_URL}/products`, "get", { 'is_home': true }, resolve, reject);
}

export const getRecommendProductList = (resolve, reject) => {
    return request(`${process.env.VUE_APP_API_URL}/products`, "get", { 'is_recommend': true }, resolve, reject);
}

export const saveProduct = (productCode, data, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/product/${productCode}`, "post", data, resolve);
}

export const editProduct = (productCode, data, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/product/${productCode}`, "put", data, resolve);
}

export const updateProduct = (productCode, data, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/product/${productCode}/update`, "put", data, resolve);
}

export const deleteProduct = (productCode, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/product/${productCode}`, "delete", {}, resolve);
}

export const updateProducts = (data, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/products/update`, "put", data, resolve);
}

export const getPictures = (productCode, resolve, reject) => {
    return request(`${process.env.VUE_APP_API_URL}/product/${productCode}/pictures`, "get", {}, resolve, reject);
}

export const uploadPicture = (productCode, file, resolve, reject) => {
    return requestUpload(`${process.env.VUE_APP_API_URL}/product/${productCode}/picture`, file, resolve, reject);
}

export const setPrimaryPicture = (pictureId, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/product/picture/${pictureId}`, "put", {}, resolve);
}

export const updatePictures = (data, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/product/pictures/update`, "put", data, resolve);
}

export const deletePicture = (pictureId, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/product/picture/${pictureId}`, "delete", {}, resolve);
}