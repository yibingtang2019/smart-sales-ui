import { 
    request
} from './api';

export const getFeedbackList = (params, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/customer/feedback/search`, "get", params, resolve);
}