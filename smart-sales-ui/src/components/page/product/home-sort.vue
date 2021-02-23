<template>
    <b-container>
        <div style="margin:5px;">
            <div style="text-align:right;margin-right:20px;">
                <span style="margin-right:10px;font-size:14px;line-height:14px;color:#6c757d">
                    提示：拖拽图片卡片进行排序
                </span>
                <b-button type="button" @click="search" variant="primary" style="margin-right:5px;">
                    刷新
                </b-button>
                <b-button type="button" @click="save" variant="secondary" style="margin-left:5px;">
                    保存排序
                </b-button>
            </div>
            <div v-if="products.length" 
                style="display: flex;flex-wrap: wrap;margin:5px;"
                class="products">
                <div v-for="product in products" :key="product.id"
                    style="cursor:pointer;margin:5px;">
                    <b-img :src="product.picture_url" thumbnail style="width:260px;height:auto;"/>
                    <div border style="width:260px;display:block;overflow:hidden;margin-top:5px;text-align:center;">
                        {{ product.product_code }}
                    </div>
                </div>
            </div>
            <div v-else>
                <h5>没有产品</h5>
            </div>
        </div>
    </b-container>
</template>

<script>
import { 
    Indicator, 
    MessageBox
} from 'mint-ui';

import Sortable from 'sortablejs';

import { 
    getHomeProductList,
    updateProducts
} from "api/product";

import { 
    getPicturePath 
} from "api/picture"

export default {
    data() {
        return {
            loading: true,
            products: [],
            total: 0
        }
    },
    mounted() { 
        this.search();
    },
    methods: {
        search() {
            Indicator.open({ text: '加载中...', spinnerType: 'fading-circle' });
            getHomeProductList(response => {
                if(response.status == 200) {
                    this.products = response.data.data;
                    if(this.products.length > 0) {
                        this.products.forEach(product => {
                            if(product.picture_url) {
                                product.picture_url = getPicturePath(product.picture_url);
                            }
                        });
                    }
                    this.total = response.data.total;
                    this.$nextTick(() => {
                        const el = document.querySelectorAll('.products')[0];
                        let self = this;
                        Sortable.create(el, {
                            onEnd({ newIndex, oldIndex }) {
                                const targetRow = self.products.splice(oldIndex, 1)[0];
                                self.products.splice(newIndex, 0, targetRow);
                            }
                        });
                    });
                }
                Indicator.close();
            }, error => {
                MessageBox('查询失败', '查询失败，登录过期请重新登录');
                setTimeout(() => { Indicator.close(); }, 1000);
            });
        },
        save() {
            if(this.products.length == 0) {
                this.$message({
                type: 'warning',
                message: '查询结果为空!'
                });
                return;
            }
            let saveItems = [];
            this.products.forEach((item, index) => {
                saveItems.push(item.product_code);
            });
            let saveObject = { 'method': 'home', 'products': saveItems };
            updateProducts(saveObject, response => {
                if (response.status == 200) {
                    MessageBox('保存成功', '保存成功');
                    this.search();
                } else {
                    MessageBox('保存失败', '保存失败');
                }
            });
        }
    }
}
</script>