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

        Vue.prototype.dateFormatString = function(time) {
            if (time === null || time.length === 0) {
                return '-';
            }
            var t = new Date(time);
            var year = t.getFullYear();
            var month = t.getMonth() + 1;
            var day = t.getDate();
            var hour = t.getHours();
            var min = t.getMinutes();
            var sec = t.getSeconds();
            var newTime = year + '-' +
                (month < 10 ? '0' + month : month) + '-' +
                (day < 10 ? '0' + day : day) + ' ' +
                (hour < 10 ? '0' + hour : hour) + ':' +
                (min < 10 ? '0' + min : min) + ':' +
                (sec < 10 ? '0' + sec : sec);
            return newTime;
        }

        Vue.prototype.to2Fixed = function(value) {
            value = Number(value);
            value = value.toFixed(2);
            return value;
        };

        Vue.prototype.getIsMobile = function() {
            let flag = navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            );
            return flag !== null;
        }

        Vue.prototype.getGenderString = function(value) {
            if(value == 0) {
                return '未知';
            }
            if(value == 1) {
                return '男';
            }
            if(value == 2) {
                return '女';
            }
        }

        Vue.prototype.getCategoryString = function(value) {
            if(value == 0) {
                return '未知';
            }
            if(value == 1) {
                return '商品相关';
            }
            if(value == 2) {
                return '物流相关';
            }
            if(value == 3) {
                return '客户服务相关';
            }
            if(value == 4) {
                return '其它';
            }
        }

        Vue.prototype.getLocalItem = getLocalItem;
        Vue.prototype.setLocalItem = setLocalItem;
        Vue.prototype.removeLocalItem = removeLocalItem;
        Vue.prototype.clearLocalItems = clearLocalItems;
    }
}