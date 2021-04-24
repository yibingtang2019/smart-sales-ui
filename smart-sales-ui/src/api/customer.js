import { 
    request
} from './api';

export const getCustomerList = (params, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/customers/search`, "get", params, resolve);
}