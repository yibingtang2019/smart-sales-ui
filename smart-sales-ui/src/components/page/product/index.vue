<template>
    <b-container>
        <div style="margin:5px;">
            <b-row>
                <div class="card" style="margin:5px 20px;width:100%">
                    <div class="card-body">
                        <b-form @submit="onSubmit">
                            <b-form-group id="groupSearch" label="" label-for="search">
                                <b-form-input id="search"
                                    v-model="form.search"
                                    placeholder="请输入产品名称">
                                </b-form-input>
                            </b-form-group>
                            <b-form-group id="groupOnSale" label="" label-for="onsale">
                                <b-form-select id="onsale"
                                    v-model="form.sort_sale" 
                                    :options="optionsOnSale">
                                </b-form-select>
                            </b-form-group>
                            <b-form-group id="groupCategory" label="" label-for="category">
                                <b-form-select id="category"
                                    v-model="form.category" 
                                    :options="optionsCategory">
                                </b-form-select>
                            </b-form-group>
                            <b-form-group id="groupSize" label="" label-for="size">
                                <b-form-select id="size"
                                    v-model="form.size" 
                                    :options="optionsSize">
                                </b-form-select>
                            </b-form-group>
                            <div style="text-align:right">
                                <b-button type="submit" variant="primary" style="margin-right:5px;">
                                    查询
                                </b-button>
                                <b-button type="button" @click="onReset" variant="secondary" style="margin:0px 5px;">
                                    重置
                                </b-button>
                                <b-button
                                    v-b-toggle.editor
                                    @click="createProduct"
                                    variant="warning"
                                    style="margin-left:5px;">
                                    新建
                                </b-button>
                            </div>
                        </b-form>
                    </div>
                </div>
            </b-row>    
        </div>

        <div v-if="products.length" 
            style="margin:5px;">
            <b-row style="display:flex;justify-content:center;">
                <div v-for="product in products" 
                    v-bind:key="product.product_code" 
                    style="margin:5px;">
                    <b-col l="4">
                        <b-card v-bind:title="product.product_code"
                            v-bind:img-src="product.picture_url"
                            img-alt="Image"
                            img-top
                            tag="article"
                            style="max-width: 20rem;"
                            class="mb-2">
                            <div style="display:flex;align-items:center;justify-content:flex-start;margin-bottom:5px;">
                                <div style="margin-right:5px;width:150px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                                    名称:&nbsp;{{ product.product_name }}
                                </div>
                                <div style="margin-right:5px;width:150px;">分类:&nbsp;
                                    {{ getCategoryName(product.category_id) }}
                                    {{ getSizeName(product.size) }}
                                </div>
                            </div>
                            <div style="display:flex;align-items:center;justify-content:flex-start;margin-bottom:5px;">
                                <div style="margin-right:5px;width:150px;">指导价格:&nbsp;{{ product.price }}</div>
                                <div style="width:150px;">实际价格:&nbsp;{{ product.price_sale }}</div>
                            </div>
                            <div style="display:flex;align-items:center;justify-content:flex-start;margin-bottom:5px;">
                                <div style="margin-right:5px;width:150px;">库存数量:&nbsp;{{ product.count_store }}</div>
                                <div style="width:150px;">销售数量:&nbsp;{{ product.count_sale }}</div>
                            </div>
                            <div style="display:flex;align-items:center;justify-content:flex-start;margin-bottom:5px;">
                                <div style="margin-right:5px;width:150px;">点击量:&nbsp;{{ product.click_count == null ? '0' : product.click_count }}</div>
                            </div>
                            <div style="margin-bottom:10px;">
                                <div style="margin-right:5px;width:300px;">尺寸:&nbsp;{{ product.dimension }}</div>
                            </div>
                            <div style="display:flex;align-items:center;justify-content:flex-start;margin-bottom:10px;">
                                <div style="display:inline-block;margin-right:10px;margin-bottom:5px;">
                                    <b-badge variant="success" v-if="product.is_on_sale==true">在售产品</b-badge>
                                    <b-badge variant="danger" v-if="product.is_on_sale==false">下架产品</b-badge>
                                </div>
                                <div style="display:inline-block;margin-right:10px;margin-bottom:5px;">
                                    <b-badge variant="primary" v-if="product.is_home==true">首页显示</b-badge>
                                    <b-badge variant="secondary" v-if="product.is_home==false">列表显示</b-badge>
                                </div>
                                <div style="display:inline-block;margin-right:10px;margin-bottom:5px;" v-if="product.is_recommend==true">
                                    <b-badge variant="info" v-if="product.is_recommend==true">推荐产品</b-badge>
                                </div>
                                <div style="display:inline-block;margin-right:10px;margin-bottom:5px;" v-if="product.is_new==true">
                                    <b-badge variant="warning" v-if="product.is_new==true">新产品</b-badge>
                                </div>
                            </div>
                            <div style="display:flex;align-items:center;justify-content:flex-start;margin-bottom:10px;">
                                <b-link href="#"
                                    v-b-toggle.editor
                                    @click="editProduct(product.id, product)"
                                    style="font-size:13px;margin-right:10px;">
                                    编辑
                                </b-link>
                                <b-link href="#"
                                    v-b-modal.modalUploader
                                    @click="showUploaded(product.product_code)"
                                    style="font-size:13px;margin-right:25px;">
                                    上传图片
                                </b-link>
                                <b-link href="#"
                                    @click="deleteProduct(product.product_code)"
                                    style="font-size:13px;color:red;">
                                    删除
                                </b-link>
                            </div>
                            <div style="display:flex;align-items:center;justify-content:flex-start;">
                                <b-link href="#"
                                    @click="toggleProduct('sale', product.product_code, product.is_on_sale)"
                                    style="font-size:13px;margin-right:10px;">
                                    {{ product.is_on_sale == true ? '下架' : '上架' }}
                                </b-link>
                                <b-link href="#"
                                    @click="toggleProduct('home', product.product_code, product.is_home)"
                                    style="font-size:13px;margin-right:10px;">
                                    {{ product.is_home == true ? '设为列表页' : '设为首页' }}
                                </b-link>
                                <b-link href="#"
                                    @click="toggleProduct('recommend', product.product_code, product.is_recommend)"
                                    style="font-size:13px;margin-right:10px;">
                                    {{ product.is_recommend == true ? '设为不推荐' : '设为推荐' }}
                                </b-link>
                                <b-link href="#"
                                    @click="toggleProduct('new', product.product_code, product.is_new)"
                                    style="font-size:13px;">
                                    {{ product.is_new == true ? '设为普通产品' : '设为新产品' }}
                                </b-link>
                            </div>
                        </b-card>
                    </b-col>
                </div>
            </b-row>
            <div style="margin-top:10px;width:90%;">
                <b-pagination
                    v-model="currentPage"
                    :total-rows="total"
                    :per-page="pageSize"
                    align="center">
                </b-pagination>
            </div>
        </div>
        <div v-else style="margin:10px;">
            <h6>没有产品</h6>
        </div>

        <b-sidebar id="editor" 
            :title="editForm.id > 0 ? '编辑产品' : '新建产品'" 
            right shadow
            v-model="showEditor"
            width="80%">
            <div class="px-3 py-2"
                style="margin:5px">
                <b-form @reset="onResetForm" ref="editorForm">
                    <b-form-group id="groupProductCode" label="编号:" label-for="productCode">
                        <b-form-input
                            id="productCode"
                            v-model="editForm.productCode"
                            placeholder="请输入产品编号"
                            required
                            :disabled="editForm.id > 0">
                        </b-form-input>
                        <b-form-invalid-feedback :state="checkFormat(this.editForm.productCode)">
                            格式不正确
                        </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group id="groupProductName" label="名称:" label-for="productName">
                        <b-form-input
                            id="productName"
                            v-model="editForm.productName"
                            placeholder="请输入产品名称"
                            required>
                        </b-form-input>
                    </b-form-group>
                    <b-form-group id="groupCategory" label="分类:" label-for="category">
                        <b-form-select id="category"
                            v-model="editForm.category" 
                            :options="optionsCategory"
                            required>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group id="groupSize" label="大小:" label-for="size">
                        <b-form-select id="size"
                            v-model="editForm.size" 
                            :options="optionsSize"
                            required>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group id="groupDimension" label="尺寸:" label-for="dimension">
                        <b-form-input
                            id="dimension"
                            v-model="editForm.dimension"
                            placeholder="请输入产品尺寸">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group id="groupPrice" label="价格:" label-for="price">
                        <b-form-input
                            id="price"
                            type= "number"
                            v-model.number="editForm.price"
                            placeholder="请输入价格"
                            @click.native="selectThis($event)">
                        </b-form-input>
                        <b-form-invalid-feedback :state="checkNumber(this.editForm.price)">
                            格式不正确
                        </b-form-invalid-feedback>
                        <b-form-invalid-feedback :state="checkZero(this.editForm.price)">
                            价格不能小于零
                        </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group id="groupPriceDiscount" label="实际价格:" label-for="priceSale">
                        <b-form-input
                            id="priceSale"
                            type= "number"
                            v-model.number="editForm.priceSale"
                            placeholder="请输入实际价格"
                            @click.native="selectThis($event)">
                        </b-form-input>
                        <b-form-invalid-feedback :state="checkNumber(this.editForm.priceSale)">
                            格式不正确
                        </b-form-invalid-feedback>
                        <b-form-invalid-feedback :state="checkZero(this.editForm.priceSale)">
                            价格不能小于零
                        </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group id="groupCountStore" label="库存数量:" label-for="countStore">
                        <b-form-input
                            id="countStore"
                            type= "number"
                            v-model.number="editForm.countStore"
                            @keyup.native="integer($event)"
                            placeholder="请输入库存数量"
                            @click.native="selectThis($event)">
                        </b-form-input>
                        <b-form-invalid-feedback :state="checkNumber(this.editForm.countStore)">
                            格式不正确
                        </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group id="groupCountSale" label="销售数量:" label-for="countSale">
                        <b-form-input
                            id="countSale"
                            type= "number"
                            v-model.number="editForm.countSale"
                            @keyup.native="integer($event)"
                            placeholder="请输入销售数量"
                            @click.native="selectThis($event)">
                        </b-form-input>
                        <b-form-invalid-feedback :state="checkNumber(this.editForm.countSale)">
                            格式不正确
                        </b-form-invalid-feedback>
                    </b-form-group>
                    <div style="display:flex;align-items:center;flex-wrap:wrap;margin:20px;0px;">
                        <div style="margin-right:20px;margin-bottom:10px;">
                            <mt-switch v-model="editForm.isOnSale">是否在售</mt-switch>
                        </div>
                        <div style="margin-right:20px;margin-bottom:10px;">
                            <mt-switch v-model="editForm.isHome">是否首页显示</mt-switch>
                        </div>
                        <div style="margin-right:20px;margin-bottom:10px;">
                            <mt-switch v-model="editForm.isNew">是否新款</mt-switch>
                        </div>
                        <div style="margin-right:20px;margin-bottom:10px;">
                            <mt-switch v-model="editForm.isRecommend">是否推荐</mt-switch>
                        </div>
                    </div>
                    <b-form-group id="groupDescription" label="描述:" label-for="description">
                        <b-form-textarea
                            id="description"
                            v-model="editForm.description"
                            rows="6"
                            max-rows="12">
                        </b-form-textarea>
                    </b-form-group>
                    <b-form-group id="groupCreatedTime" label="创建时间:" label-for="createdTime" v-if="editForm.id > 0">
                        <b-form-input
                            id="createdTime"
                            v-model.number="editForm.createdTime"
                            :disabled="disabled">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group id="groupUpdatedTime" label="修改时间:" label-for="updatedTime" v-if="editForm.id > 0">
                        <b-form-input
                            id="updatedTime"
                            v-model.number="editForm.updatedTime"
                            :disabled="disabled">
                        </b-form-input>
                    </b-form-group>
                </b-form>
            </div>
            <template>
                <div class="d-flex bg-senconday text-light align-items-center px-3 py-2">
                    <b-button @click="saveProduct"
                        variant="primary" size="md"
                        style="margin-left:10px;margin-top:5px;">
                        保存
                    </b-button>
                </div>
            </template>
        </b-sidebar>

        <b-sidebar id="modalUploader" title="上传图片" 
            right shadow
            v-model="showUploador"
            width="85%">
            <div style="margin:10px;">
                <template>
                    <div class="d-flex bg-light text-light align-items-center px-3 py-2">
                        <b-form-file
                            v-model="fileUpload"
                            :state="Boolean(fileUpload)"
                            placeholder="选择文件上传"
                            drop-placeholder="拖动图片到这里"
                            accept=".jpg, .png, .gif"
                            ref="file-input">
                        </b-form-file>
                        <b-button @click="uploadConfirm"
                            variant="primary" size="md"
                            style="margin-left:10px;width:70px;">
                            上传
                        </b-button>
                    </div>
                </template>
                <div v-if="pictures.length > 0" 
                    style="width:100%;overflow-y:auto;margin:10px;text-align:center" >
                    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;" class="pictures">
                        <div v-for="picture in pictures" :key="picture.id"
                            style="width:320px;height:auto;margin:10px;diaplay:relative">
                            <div>
                                <b-img :src="picture.picture_url" thumbnail style="width:260px;height:auto;"/>
                            </div>
                            <div>
                                <b-link v-if="picture.is_primary == false || picture.is_primary == null"
                                    @click="setPrimaryPicture(picture.id)"
                                    style="font-size:14px;margin:5px;">
                                    设为主图
                                </b-link>
                                <b-link @click="deletePicture(picture.id)"
                                    style="color:red;font-size:14px;margin:5px;">
                                    删除
                                </b-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div style="width:100%;text-align:center;margin-top:20px;margin-bottom:20px;">没有图片</div>
                </div>
                <div style="text-align:right;margin-right:20px;">
                    <b-button type="button" @click="saveSort" variant="primary">
                        保存排序
                    </b-button>
                </div>
            </div>
        </b-sidebar>
    </b-container>
</template>

<script>
import { 
    Indicator, 
    MessageBox
} from 'mint-ui';

import Sortable from 'sortablejs';

import {
    getOptionsOnSale,
    getOptionsCategory,
    getOptionsSize
} from 'api/config';

import { 
    getProductList,
    saveProduct,
    editProduct,
    updateProduct,
    deleteProduct,
    getPictures,
    uploadPicture,
    setPrimaryPicture,
    updatePictures,
    deletePicture
} from "api/product";

import { 
    getPicturePath 
} from "api/picture"

export default {
    data() {
        return {
            loading: true,
            disabled: true,
            products: [],
            form: {
                search: null,
                sort_sale: null,
                category: null,
                size: null
            },
            optionsOnSale: [],
            optionsCategory: [],
            optionsSize: [],
            showEditor: false,
            editForm: {
                id: 0,
                productName: '',
                productCode: '',
                category: 0,
                size: 0,
                dimension: '',
                price: 0,
                priceSale: 0,
                countStore: 0,
                countSale: 0,
                isOnSale: false,
                isHome: false,
                isNew: false,
                isRecommend: false,
                description: '',
                createdTime: '',
                updatedTime: ''
            },
            showUploador: false,
            productCodeUploader: '',
            pictures: [],
            fileUpload: null,
            total: 0,
            currentPage: 1,
            pageSize: 20
        };
    },
    filters: {
        
    },
    mounted() {
        this.optionsOnSale = getOptionsOnSale();
        this.optionsCategory = getOptionsCategory();
        this.optionsSize = getOptionsSize();
        this.search();
    },
    watch: {
        currentPage: function(newValue, oldValue) {
            this.search();
        }
    },
    methods: {
        selectThis(event) {
            event.target.select();
        },
        checkFormat(value) {
            let reg = /^[_ 0-9a-zA-Z]*$/;
            return reg.test(value);
        },
        checkNumber(value) {
            let reg = /^(\d+|\d+\.\d{1,2})$/;
            return reg.test(value);
        },
        checkZero(value) {
            if(value == '' || value == 0) {
                return false;
            }
        },
        integer(e) {
            var keyNum = window.event ? e.keyCode : e.which;
            if(keyNum == 189 || keyNum == 190 || keyNum == 110 || keyNum == 109) {
                e.target.value = '';
            }
        },
        getCategoryName(category_id) {
            let categories = this.optionsCategory.filter(item => item.value == category_id);
            return categories.length > 0 ? categories[0].text : '';
        },
        getSizeName(size) {
            let sizes = this.optionsSize.filter(item => item.value == size);
            return sizes.length > 0 ? sizes[0].text : '';
        },
        onSubmit() {
            this.search();
        },
        search(event) {
            if(event) {
                event.preventDefault();
            }
            Indicator.open({ text: '加载中...', spinnerType: 'fading-circle' });
            let params = this.getFilter();
            getProductList(params, response => {
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
                }
                Indicator.close();
            });
        },
        getFilter() {
            return {
                "sort_sale": this.form.sort_sale == null ? '' : this.form.sort_sale,
                "category_id": this.form.category == null ? 0 : parseInt(this.form.category),
                "size": this.form.size == null ? 0 : parseInt(this.form.size),
                "search": this.form.search == null ? '' : this.form.search,
                "page_size": this.pageSize,
                "current_page": this.currentPage
            };
        },
        onReset() {
            this.form.sort_sale = null;
            this.form.category = null;
            this.form.size = null;
            this.form.search = '';
            this.pageSize = 20;
            this.currentPage = 1;
            this.search();
        },
        createProduct() {
            this.onResetForm();
        },
        editProduct(id, product) {
            this.editForm.id = id;
            this.editForm.productCode = product.product_code;
            this.editForm.productName = product.product_name;
            this.editForm.category = product.category_id;
            this.editForm.size = product.size;
            this.editForm.dimension = product.dimension;
            this.editForm.price = product.price;
            this.editForm.priceSale = product.price_sale;
            this.editForm.countStore = product.count_store;
            this.editForm.countSale = product.count_sale;
            this.editForm.isOnSale = product.is_on_sale;
            this.editForm.isHome = product.is_home;
            this.editForm.isNew = product.is_new;
            this.editForm.isRecommend = product.is_recommend;
            this.editForm.description = product.description;
            this.editForm.createdTime = this.dateFormatString(product.create_time);
            this.editForm.updatedTime = this.dateFormatString(product.update_time);
        },
        saveProduct() {
            let form = this.$refs['editorForm'];
            let valid = form.checkValidity();
            if(valid) {
                valid = this.checkNumber(this.editForm.price);
            }
            if(valid) {
                let price_sale = parseFloat(this.editForm.priceSale) == 0 ? 
                                     parseFloat(this.editForm.price) : 
                                     parseFloat(this.editForm.priceSale);
                let saveObject = {
                    'product_name': this.editForm.productName,
                    'category_id': parseInt(this.editForm.category),
                    'size': parseInt(this.editForm.size),
                    'dimension': this.editForm.dimension,
                    'price': parseFloat(this.editForm.price),
                    'price_sale': price_sale,
                    'count_store': parseInt(this.editForm.countStore),
                    'count_sale': parseInt(this.editForm.countSale),
                    'is_on_sale': this.editForm.isOnSale,
                    'is_home': this.editForm.isHome,
                    'is_new': this.editForm.isNew,
                    'is_recommend': this.editForm.isRecommend,
                    'description': this.editForm.description
                };
                if(this.editForm.id == 0) {
                    saveProduct(this.editForm.productCode, saveObject, response => {
                        if(response.status == 201) {
                            MessageBox('保存成功', '保存成功');
                            this.search();
                        }
                    });
                } else {
                    editProduct(this.editForm.productCode, saveObject, response => {
                        if(response.status == 200) {
                            MessageBox('保存成功', '保存成功');
                            this.search();
                        }
                    });
                }
                this.showEditor = false;
            } else {
                MessageBox('保存失败', '保存失败，数据验证失败');
            }
        },
        onResetForm(event) {
            if(event) {
                event.preventDefault();
            }
            this.editForm.id = 0;
            this.editForm.productCode = '';
            this.editForm.productName = '';
            this.editForm.category = null;
            this.editForm.size = null;
            this.editForm.dimension = '';
            this.editForm.price = 0;
            this.editForm.priceSale = 0;
            this.editForm.countStore = 0;
            this.editForm.countSale = 0;
            this.editForm.isOnSale = false;
            this.editForm.isOnSale = false;
            this.editForm.isNew = false;
            this.editForm.isRecommend = false;
            this.editForm.description = '';
            this.editForm.createdTime = '';
            this.editForm.updatedTime = '';
        },
        toggleProduct(method, productCode, isValue) {
            MessageBox.confirm('确定执行此操作?').then(action => {
                let saveObject = { 'method': method };
                if(method == 'sale') {
                    saveObject.is_on_sale = !isValue;
                } else if(method == 'home') {
                    saveObject.is_home = !isValue;
                } else if(method == 'recommend') {
                    saveObject.is_recommend = !isValue;
                } else if(method == 'new') {
                    saveObject.is_new = !isValue;
                }
                updateProduct(productCode, saveObject, response => {
                    if(response.status == 200) {
                        MessageBox('保存成功', '保存成功');
                        this.search();
                    }
                });
            }).catch(()=>{});
        },
        showUploaded(productCode) {
            this.productCodeUploader = productCode;
            Indicator.open({ text: '加载中...', spinnerType: 'fading-circle' });
            getPictures(productCode, response => {
                if(response.status == 200) {
                    this.pictures = response.data.data;
                    if(this.pictures.length > 0) {
                        this.pictures.forEach(picture => {
                            picture.picture_url = getPicturePath(picture.picture_url);
                        });
                    }
                    this.$nextTick(() => {
                        const el = document.querySelectorAll('.pictures')[0];
                        let self = this;
                        Sortable.create(el, {
                            onEnd({ newIndex, oldIndex }) {
                                const targetRow = self.pictures.splice(oldIndex, 1)[0];
                                self.pictures.splice(newIndex, 0, targetRow);
                            }
                        });
                    });
                }
                Indicator.close();
            }, error => {
                setTimeout(() => { Indicator.close(); }, 1000);
            });
            this.showUploador = true;
        },
        uploadConfirm() {
            if(this.fileUpload == null) { 
                MessageBox('上传失败', `请选择上传的文件`);
                return;
            } else {
                let formData = new FormData();
                formData.append('file', this.fileUpload);
                uploadPicture(this.productCodeUploader, formData, response => {
                    if(response.status == 200) {
                        MessageBox('上传成功', '上传图片成功');
                        this.showUploaded(this.productCodeUploader);
                    }
                    this.resetUpload();
                }, error => {
                    console.log(error);
                    MessageBox('上传失败', `上传图片失败 ${error}`);
                });
            }
        },
        setPrimaryPicture(pictureId) {
            setPrimaryPicture(pictureId, response => {
                if(response.status == 200) {
                    MessageBox('保存成功', '保存成功');
                    this.showUploaded(this.productCodeUploader);
                }
            });
        },
        resetUpload() {
            this.$refs['file-input'].reset();
            this.fileUpload = null;
            this.search();
        },
        cancelUpload() {
            this.productCodeUploader = '';
            this.pictures = [];
            this.resetUpload();
            this.showUploador = false;
        },
        deleteProduct(productCode) {
            MessageBox.confirm(`确定删除此产品 ${productCode} ? 请注意此项操作不能回退！`).then(action => {
                deleteProduct(productCode, response => {
                    if(response.status == 200) {
                        MessageBox('删除成功', '删除成功');
                        this.search();
                    }
                });
            }).catch(()=>{});
        },
        deletePicture(pictureId) {
            MessageBox.confirm('确定执行此操作?').then(action => {
                deletePicture(pictureId, response => {
                    if(response.status == 200) {
                        MessageBox('删除成功', '删除成功');
                        this.showUploaded(this.productCodeUploader);
                    }
                });
            }).catch(()=>{});
        },
        saveSort() {
            if(this.pictures.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '图片列表为空!'
                });
                return;
            }
            let saveItems = [];
            this.pictures.forEach((item, index) => {
                saveItems.push(item.id);
            });
            let saveObject = { 'pictures': saveItems };
            updatePictures(saveObject, response => {
                if (response.status == 200) {
                    MessageBox('保存成功', '保存成功');
                    this.showUploaded(this.productCodeUploader);
                } else {
                    MessageBox('保存失败', '保存失败');
                }
            });
        }
    }
};
</script>

<style scoped>
.badge {
    padding: 4px 8px;
}
</style>