<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="success">
            <b-container style="width:90%">
                <b-navbar-brand href="#">韵晴皮具销售管理系统</b-navbar-brand>
                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item-dropdown right>
                            <template slot="button-content"><em style="font-style:normal">{{menuItem}}</em></template>
                            <b-dropdown-item href="#" @click="product">产品信息管理</b-dropdown-item>
                            <b-dropdown-item href="#" @click="homeSort">产品排序管理</b-dropdown-item>
                            <b-dropdown-item href="#" @click="sales">销售信息管理</b-dropdown-item>
                            <b-dropdown-item href="#" @click="profile">登录用户</b-dropdown-item>
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
                this.menuItem = this.$router.currentRoute.meta.title;
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
        sales() {
            this.$router.push("/sale");
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