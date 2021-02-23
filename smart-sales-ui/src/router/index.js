import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/product'
        },
        {
            path: '/404',
            component: resolve => require(['components/404.vue'], resolve),
            meta: { title: '404' }
        },
        {
            path: '/',
            component: resolve => require(['components/common/home.vue'], resolve),
            meta: { title: '首页' },
            children: [
                {
                    path: '/product',
                    component: resolve => require(['components/page/product/index.vue'], resolve),
                    meta: { title: '产品信息管理', auth: true }
                },
                {
                    path: '/home-sort',
                    component: resolve => require(['components/page/product/product-sort.vue'], resolve),
                    meta: { title: '产品排序管理', auth: true }
                },
                {
                    path: '/sale',
                    component: resolve => require(['components/page/sale/index.vue'], resolve),
                    meta: { title: '销售信息管理', auth: true }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['components/page/login/index.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
