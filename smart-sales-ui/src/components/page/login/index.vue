<template>
    <div class="card" style="margin:20px;width:90%">
        <div class="card-header" style="text-align:center">
            登录
        </div>
        <div class="card-body">
            <b-form @submit="onSubmit" @reset="onReset">
                <b-form-group id="groupUserName" label="登录用户名:" label-for="userName">
                    <b-form-input
                        id="userName"
                        v-model="form.userName"
                        placeholder="请输入登录用户名"
                        required>
                    </b-form-input>
                    <b-form-invalid-feedback :state="checkFormat(this.form.userName)">
                        格式不正确
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group id="groupPassword" label="密码:" label-for="password">
                    <b-form-input
                        id="password"
                        v-model="form.password"
                        type="password"
                        placeholder="请输入登录密码"
                        required>
                    </b-form-input>
                    <b-form-invalid-feedback :state="checkFormat(this.form.password)">
                        格式不正确
                    </b-form-invalid-feedback>
                </b-form-group>
                <div style="text-align:center">
                    <b-button type="submit" variant="primary" style="margin-right:5px;">确定</b-button>
                    <b-button type="reset" variant="secondary" style="margin-left:5px;">重置</b-button>
                </div>
            </b-form>
        </div>
    </div>
</template>

<script>
import { login } from 'api/user';

import { 
    Toast, 
    MessageBox 
} from 'mint-ui';

export default {
    data() {
        return {
            title: "韵晴皮具信息管理系统",
            form: {
                userName: '',
                password: ''
            }
        }
    },
    computed: {
        
    },
    methods: {
        checkFormat(value) {
            let reg = /^[0-9a-zA-Z]*$/;
            return reg.test(value);
        },
        onSubmit(event) {
            event.preventDefault();
            login(this.form.userName, this.form.password, res => {
                if(res.status == 200) {
                    Toast({
                        message: '登录成功正在跳转',
                        position: 'top',
                        duration: 1000
                    });
                    this.clearLocalItems();
                    let logonUser = {
                        userName: this.form.userName
                    };
                    let user = {
                        name: "user", 
                        value: logonUser,
                        expires: 8 * 60 * 60 * 1000
                    };
                    this.setLocalItem(user);
                    this.setLocalItem({
                        name: "login_time", 
                        value: new Date()
                    });
                    this.setLocalItem({
                        name: "token", 
                        value: res.data.access_token
                    });
                    this.$router.push('/product');
                } else {
                    this.form.userName = '';
                    this.form.password = '';
                    MessageBox('登录失败', '用户名或密码错误');
                    return false;
                }
            }, error => {
                this.onReset(event);
                MessageBox('登录失败', '用户名或密码错误');
            });
        },
        onReset(event) {
            event.preventDefault();
            this.form.userName = '';
            this.form.password = '';
        }
    },
    mounted() {
        if(process.env.NODE_ENV == 'development') {
            this.form.userName = 'admin';
            this.form.password = 'password';
        }
        this.clearLocalItems();

        document.title = this.title + "登录";
    }
}
</script>