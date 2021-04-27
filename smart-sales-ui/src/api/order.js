import { 
    request
} from './api';

export const getOrderList = (params, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/orders/search`, "get", params, resolve);
}