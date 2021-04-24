import { 
    request
} from './api';

export const getFeedbackList = (params, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/customer/feedbacks`, "get", params, resolve);
}