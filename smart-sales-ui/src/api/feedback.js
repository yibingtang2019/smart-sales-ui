import { 
    request
} from './api';

export const getFeedbackList = (params, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/customer/feedback/search`, "get", params, resolve);
}

export const replyFeedback = (feedback_id, resolve) => {
    return request(`${process.env.VUE_APP_API_URL}/customer/feedback/update?feedback_id=${feedback_id}`, "put", {}, resolve);
}