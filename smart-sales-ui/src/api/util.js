import { 
    getLocalItem, 
    setLocalItem, 
    removeLocalItem, 
    clearLocalItems 
} from './storage'

export default {
    install(Vue)  {
        Vue.prototype.dateFormat = function(value) {
            if(value === undefined) {
                return '';
            }
        
            if(value === "") {
                return '';
            }
            
            if(typeof value === String && value.startsWith('1900-01-01')) {
                return '';
            }
        
            let date = new Date(value);
            
            if(value.replace) {
                date = new Date(value.replace(/-/g, "/"));  //support safari
            }
        
            let month = date.getMonth() + 1;
            if(month < 10) {
                month = "0" + month;
            }
        
            let day = date.getDate();
            if(day < 10) {
                day = "0" + day;
            }
        
            return date.getFullYear() + '-' + month + '-' + day;
        };

        Vue.prototype.to2Fixed = function(value) {
            value = Number(value);
            value = value.toFixed(2);
            return value;
        };

        Vue.prototype.getLocalItem = getLocalItem;
        Vue.prototype.setLocalItem = setLocalItem;
        Vue.prototype.removeLocalItem = removeLocalItem;
        Vue.prototype.clearLocalItems = clearLocalItems;
    }
}