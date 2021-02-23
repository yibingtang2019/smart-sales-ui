import MintUI from 'mint-ui';
import router from 'vue-router' 

export const getLocalItem = (name) => {
    let item = localStorage.getItem(name);
    let returnItem = item;
    try {
        returnItem = JSON.parse(item);
    } catch (error) {
        returnItem = item;
    }
    if (returnItem && returnItem.startTime) {
        let date = new Date().getTime();
        if (date - returnItem.startTime > returnItem.expires) {
            localStorage.removeItem(name);
            MintUI.MessageBox({message: '登录过期，请重新登录'});
            setTimeout(function() {
                router.push('/login');
            }, 1000);
            return false;
        } else {
            return returnItem.value;
        }
    } else {
        return returnItem;
    }
}

export const setLocalItem = (params) => {
    let obj = {
        name: '',
        value: '',
        expires: '',
        startTime: new Date().getTime()
    };
    let options = {};
    Object.assign(options, obj, params);
    if (options.expires) {
        localStorage.setItem(options.name, JSON.stringify(options));
    } else {
        let type = Object.prototype.toString.call(options.value);
        if (Object.prototype.toString.call(options.value) == '[object Object]') {
            options.value = JSON.stringify(options.value);
        }
        if (Object.prototype.toString.call(options.value) == '[object Array]') {
            options.value = JSON.stringify(options.value);
        }
        localStorage.setItem(options.name, options.value);
    }
}

export const removeLocalItem = (name) => {
    localStorage.removeItem(name);
}

export const clearLocalItems = () => {
    localStorage.clear();
}