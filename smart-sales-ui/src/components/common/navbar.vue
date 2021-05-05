<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="success">
            <b-container class="nav-container">
                <b-navbar-brand href="#" class="nav-brand">韵晴皮具销售管理系统</b-navbar-brand>
                <b-navbar-toggle target="nav-collapse" class="nav-toggle"></b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item-dropdown right>
                            <template slot="button-content"><em style="font-style:normal">{{menuItem}}</em></template>
                            <b-dropdown-item href="#" @click="product">产品信息管理</b-dropdown-item>
                            <b-dropdown-item href="#" @click="homeSort">产品排序管理</b-dropdown-item>
                            <b-dropdown-item href="#" @click="customers">客户信息管理</b-dropdown-item>
                            <b-dropdown-item href="#" @click="orders">订单信息管理</b-dropdown-item>
                            <b-dropdown-item href="#" @click="orderstats">订单信息统计</b-dropdown-item>
                            <b-dropdown-item href="#" @click="feedbacks">反馈信息管理</b-dropdown-item>
                            <b-dropdown-item href="#" @click="notices">公告信息管理</b-dropdown-item>
                            <b-dropdown-item href="#" @click="profile">当前登录用户</b-dropdown-item>
                            <b-dropdown-item href="#" @click="quit">退出</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
    </div>  
</template>

<script>
import { MessageBox } from 'mint-ui';

export default {
    data() {
        return {
            menuItem: ''
        }
    },
    mounted() {
        this.setMenuItem();
    },
    methods: {
        setMenuItem() {
            if(this.$router.currentRoute.meta && this.$router.currentRoute.meta.title) {
                let _this = this;
                setTimeout(() => {
                    _this.menuItem = _this.$router.currentRoute.meta.title;
                    document.title = "韵晴皮具信息管理系统 - " + _this.menuItem;
                }, 1000);
            }
        },
        product() {
            this.$router.push("/product");
            this.setMenuItem();
        },
        homeSort() {
            this.$router.push("/home-sort");
            this.setMenuItem();
        },
        customers() {
            this.$router.push("/customer");
            this.setMenuItem();
        },
        orders() {
            this.$router.push("/order");
            this.setMenuItem();
        },
        orderstats() {
            this.$router.push("/order-statistic");
            this.setMenuItem();
        },
        feedbacks() {
            this.$router.push("/feedback");
            this.setMenuItem();
        },
        notices() {
            this.$router.push("/notice");
            this.setMenuItem();
        },
        profile() {
            let userName = this.getLocalItem("user") && this.getLocalItem("user").userName;
            MessageBox('当前登录用户', userName);
        },
        quit() {
            this.clearLocalItems();
            this.$router.push("/login");
        }
    }
}    
</script>

<style scoped>
.nav-container {
    width:100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.nav-brand {
    width: 70%;
    padding-left: 10px;
}

.nav-toggle {
    width: 20%;
}
</style>