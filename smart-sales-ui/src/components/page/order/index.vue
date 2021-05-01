<template>
    <b-container>
        <div style="margin:5px;">
            <b-row>
                <div class="card" style="margin:5px 20px;width:100%">
                    <div class="card-body">
                        <b-form @submit="onSubmit">
                            <b-form-group id="groupName" label="" label-for="search">
                                <b-form-input id="search"
                                    v-model="form.search"
                                    placeholder="请输入订单编号">
                                </b-form-input>
                            </b-form-group>
                            <b-form-group id="groupStatus" label="" label-for="status">
                                <b-form-select id="status"
                                    v-model="form.status" 
                                    :options="optionsStatus">
                                </b-form-select>
                            </b-form-group>
                            <div style="text-align:right">
                                <b-button type="submit" variant="primary" style="margin-right:5px;">
                                    查询
                                </b-button>
                                <b-button type="button" @click="onReset" variant="secondary" style="margin:0px 5px;">
                                    重置
                                </b-button>
                            </div>
                        </b-form>
                    </div>
                </div>
            </b-row>
        </div>
        <div v-if="orders.length > 0" 
            style="margin:5px auto;width:90%;">
            <b-row style="justify-content:space-around;">
                <b-table :items="orders" :fields="fields" 
                    small fixed hover selectable select-mode="single" 
                    @row-selected="onRowSelected"
                    ref="orderTable">
                    <template #cell(status)="data">
                        <span :style="{color: getStatusColor(data.item.status)}">
                            {{getStatus(data.item.status)}}
                        </span>
                    </template>
                    <template #cell(create_time)="data">
                        {{dateFormat(data.item.create_time)}}
                    </template>
                    <template #cell(payment_time)="data">
                        {{data.item.status == 1 || data.item.status == 2 || data.item.status == 3 ? dateFormat(data.item.payment_time) : ''}}
                    </template>
                    <template #cell(shipped_time)="data">
                        {{data.item.status == 2 || data.item.status == 3 ? dateFormat(data.item.shipped_time) : ''}}
                    </template>
                    <template #cell(received_time)="data">
                        {{data.item.status == 3 ? dateFormat(data.item.received_time) : ''}}
                    </template>
                </b-table>
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
        <div v-else>
            <h5>没有订单</h5>
        </div>

        <b-modal id="customer-info" title="订单信息:" size="lg"
            hide-footer
            v-model="modalShow"
            v-if="selectedOrder != null">
            <div class="card customer-info">
                <div class="card-header header">
                    <div style="width:80%">订单编号: {{selectedOrder.order_number}}</div> 
                    <div :style="{color: getStatusColor(selectedOrder.status)}">
                        {{getStatus(selectedOrder.status)}}
                    </div> 
                </div>
                <div class="card-body body">
                    <div class="item">
                        <div style="width:30%;">收货人:</div>
                        <div style="width:70%">{{selectedOrder.address_user_name}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">收货手机:</div>
                        <div style="width:70%">{{selectedOrder.address_tel_number}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">详细地址:</div>
                        <div style="width:70%">{{selectedOrder.address_detail_info}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">下单时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.create_time)}}</div>
                    </div>
                    <div v-if="selectedOrder.status == 1 || selectedOrder.status == 2 || selectedOrder.status == 3" 
                        class="item">
                        <div style="width:30%;">付款时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.payment_time)}}</div>
                    </div>
                    <div v-if="selectedOrder.status == 2 || selectedOrder.status == 3"
                        class="item">
                        <div style="width:30%;">发货时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.shipped_time)}}</div>
                    </div>
                    <div v-if="selectedOrder.status == 3"
                        class="item">
                        <div style="width:30%;">收货时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.received_time)}}</div>
                    </div>
                    <div v-if="selectedOrder.status == 4"
                        class="item">
                        <div style="width:30%;">取消时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.canceled_time)}}</div>
                    </div>
                    <div v-if="selectedOrder.status == 5"
                        class="item">
                        <div style="width:30%;">删除时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.deleted_time)}}</div>
                    </div>
                    <div class="detail" v-if="order_items.length > 0">
                        <div v-for="order_item in order_items" :key="order_item.id" class="detail-item">
                            <b-img :src="order_item.picture_url" thumbnail class="detail-item-image"/>
                            <div class="detail-item-info">
                                <div class="detail-item-value detail-item-name">
                                    {{ order_item.product_code }} {{order_item.product_name}}
                                </div>
                                <div class="detail-item-value">
                                    数量: {{ order_item.count }} 个
                                </div>
                                <div class="detail-item-value">
                                    价格: {{order_item.price}} 元
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="buttons">
                        <b-link v-if="selectedOrder.status == 1"
                            @click="popupTrackingNumber"
                            class="order-button">
                            填快递单号
                        </b-link>
                    </div>
                </div>
            </div>
            <div class="card customer-info"
                v-if="selectedOrder.status == 2 || selectedOrder.status == 3">
                <div class="card-header header">
                    <div style="width:80%">快递信息</div> 
                </div>
                <div class="card-body body">
                    <div class="item">
                        <div style="width:30%;">快递公司:</div>
                        <div style="width:70%">{{getExpress(selectedOrder.express_company)}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">快递单号:</div>
                        <div style="width:70%">{{selectedOrder.tracking_number}}</div>
                    </div>
                    <div class="buttons">
                        <b-link v-if="selectedOrder.status == 2"
                            @click="editTrackingNumber"
                            class="order-button">
                            修改快递单号
                        </b-link>
                        <b-link v-if="selectedOrder.status == 2"
                            @click="setFinished"
                            class="order-button">
                            设为已收货
                        </b-link>
                    </div>
                </div>
            </div>
            <div class="card" style="margin:5px 10px;width:95%;">
                <div class="card-header">
                    <div>
                        <b-img thumbnail fluid :src="selectedOrder.avatar_url" 
                            center lazy width="50" height="50" rounded="circle"
                            v-if="selectedOrder.avatar_url != ''">
                        </b-img>
                    </div>
                </div>
                <div class="card-body body">
                    <div class="item">
                        <div style="width:30%;">姓名:</div>
                        <div style="width:70%">{{selectedOrder.name}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">昵称:</div>
                        <div style="width:70%">{{selectedOrder.nick_name}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">手机号码:</div>
                        <div style="width:70%">{{selectedOrder.tel}}</div>
                    </div>
                    <div v-if="selectedOrder.weixin != ''" 
                        class="item">
                        <div style="width:30%;">微信:</div>
                        <div style="width:70%">{{selectedOrder.weixin}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">性别:</div>
                        <div style="width:70%">{{getGender(selectedOrder.gender)}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">所在地:</div>
                        <div style="width:70%">{{selectedOrder.province}} {{selectedOrder.city}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">加入时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.create_time)}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">登录时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.last_login_time)}}</div>
                    </div>
                </div>
            </div>
        </b-modal>

        <b-modal id="customer-info" title="快递单" size="sm"
            hide-footer centered 
            v-model="modalExpressShow"
            v-if="selectedOrder != null">
            <div class="card">
                <div class="card-body body">
                    <b-form @reset="onResetForm" ref="editorForm">
                        <div class="item">
                            <div style="width:100%">
                                <b-form-select id="express_company"
                                    v-model="expressForm.express_company" 
                                    :options="optionsExpressCompany"
                                    required>
                                </b-form-select>
                            </div>
                        </div>
                        <div class="item">
                            <div style="width:100%">
                                <b-form-input id="tracking_number"
                                    v-model="expressForm.tracking_number"
                                    placeholder="请输入快递单号"
                                    required>
                                </b-form-input>
                            </div>
                        </div>
                        <div class="d-flex bg-senconday text-light align-items-center px-3 py-2">
                            <b-button @click="saveExpress"
                                variant="primary" size="md"
                                style="margin-left:10px;margin-top:5px;">
                                保存
                            </b-button>
                        </div>
                    </b-form>
                </div>
            </div>
        </b-modal>
    </b-container>
</template>

<script>
import { 
    Indicator, 
    MessageBox
} from 'mint-ui';

import {
    getOptionsStatus, getExpressCompany
} from 'api/config';

import { 
    getPicturePath 
} from "api/picture";

import { 
    getOrderList, getOrder, saveExpress
} from "api/order";

export default {
    data() {
        return {
            isMobile: false,
            loading: true,
            disabled: true,
            orders: [],
            form: {
                search: null,
                status: null
            },
            expressForm: {
                express_company: null,
                tracking_number: null
            },
            optionsStatus: [],
            fields: [],
            fieldsSimple: [
                {
                    key: 'order_number',
                    label: '订单编号',
                    class: 'W120'
                },
                {
                    key: 'status',
                    label: '状态',
                    class: 'W60',
                    sortable: true 
                },
                {
                    key: 'create_time',
                    label: '创建时间',
                    class: 'W100',
                    sortable: true 
                }
            ],
            fieldsAll: [
                {
                    key: 'order_number',
                    label: '订单编号',
                    class: 'W140'
                },
                {
                    key: 'status',
                    label: '状态',
                    sortable: true 
                },
                {
                    key: 'name',
                    label: '姓名'
                },
                {
                    key: 'tel',
                    label: '手机号码',
                    class: 'W120'
                },
                {
                    key: 'create_time',
                    label: '创建时间',
                    class: 'W160',
                    sortable: true 
                },
                {
                    key: 'payment_time',
                    label: '付款时间',
                    class: 'W160'
                },
                {
                    key: 'shipped_time',
                    label: '发货时间',
                    class: 'W160'
                },
                {
                    key: 'received_time',
                    label: '完成时间',
                    class: 'W160'
                }
            ],
            showAll: false,
            selected: [],
            selectedOrder: null,
            order_items: [],
            modalShow: false,
            modalExpressShow: false,
            total: 0,
            currentPage: 1,
            pageSize: 20,
            optionsExpressCompany: []
        }
    },
    mounted() {
        this.optionsStatus = getOptionsStatus();
        this.optionsExpressCompany = getExpressCompany();
        this.search();
        this.isMobile = this.getIsMobile();
        if(this.isMobile) {
            this.showAll = false;
            this.fields = this.fieldsSimple;
        } else {
            this.showAll = true;
            this.fields = this.fieldsAll;
        }
    },
    watch: {
        currentPage: function(newValue, oldValue) {
            this.search();
        }
    },
    methods: {
        getGender(value) {
            return this.getGenderString(value);
        },
        getStatus(value) {
            let status = '';
            switch(value) {
                case 0:
                    status = '待付款';
                    break;
                case 1:
                    status = '待发货';
                    break;
                case 2:
                    status = '待收货';
                    break;
                case 3:
                    status = '已收货';
                    break;
                case 4:
                    status = '已取消';
                    break;
                case 5:
                    status = '已删除';
                    break;
            }
            return status;
        },
        getStatusColor(value) {
            let color = '';
            switch(value) {
                case 0:
                    color = '#007bff';
                    break;
                case 1:
                    color = '#6610f2';
                    break;
                case 2:
                    color = '#ffc107';
                    break;
                case 3:
                    color = '#28a745';
                    break;
                case 4:
                    color = '#fd7e14';
                    break;
                case 5:
                    color = '#dc3545';
                    break;
            }
            return color;
        },
        getExpress(value) {
            let company = '';
            switch(value) {
                case "sf":
                    company = '顺风快递';
                    break;
                case "ems":
                    company = '邮政快递';
                    break;
            }
            return company;
        },
        dateFormat: function(time) {
            return this.dateFormatString(time);
        },
        onSubmit() {
            this.search();
        },
        onReset() {
            this.form.search = '';
            this.pageSize = 20;
            this.currentPage = 1;
            this.search();
        },
        search(event) {
            if(event) {
                event.preventDefault();
            }
            Indicator.open({ text: '加载中...', spinnerType: 'fading-circle' });
            let params = this.getFilter();
            getOrderList(params, response => {
                if(response.status == 200) {
                    this.orders = response.data.data;
                    this.total = response.data.total;
                }
                Indicator.close();
            });
        },
        getFilter() {
            return {
                "search": this.form.search == null ? '' : this.form.search,
                "status": this.form.status == null ? null : parseInt(this.form.status),
                "page_size": this.pageSize,
                "current_page": this.currentPage
            };
        },
        onRowSelected(items) {
            this.selected = items;
            if(this.selected.length > 0) {
                this.selectedOrder = this.selected[0];
                getOrder(this.selectedOrder.order_number, res => {
                    if(res.status == 200) {
                        let { data } = res.data;
                        this.order_items = data.order_items;
                        this.order_items.forEach(orderItem => {
                            if(orderItem.picture_url) {
                                orderItem.picture_url = getPicturePath(orderItem.picture_url);
                            }
                        });
                    }
                });
            } else {
                this.selectedOrder = null;
            }
            this.modalShow = !this.modalShow;
        },
        popupTrackingNumber() {
            this.modalExpressShow = !this.modalExpressShow;
            this.onResetForm();
        },
        editTrackingNumber() {
            this.modalExpressShow = !this.modalExpressShow;
            this.expressForm.express_company = this.selectedOrder.express_company;
            this.expressForm.tracking_number = this.selectedOrder.tracking_number;
        },
        setFinished() {
            MessageBox.confirm('确定设置此订单为已收货?').then(action => {
                let saveObject = { 'method': "finish" };
                saveExpress(this.selectedOrder.order_number, saveObject, response => {
                    if(response.status == 200) {
                        MessageBox('保存成功', '保存成功');
                        this.selectedOrder.status = 3;
                        this.selectedOrder.received_time = response.data.received_time;
                    }
                });
            }).catch(()=>{});
        },
        onResetForm(event) {
            if(event) {
                event.preventDefault();
            }
            this.expressForm.express_company = null;
            this.expressForm.tracking_number = null;
        },
        saveExpress() {
            let form = this.$refs['editorForm'];
            let valid = form.checkValidity();
            if(valid) {
                let saveObj = Object.assign({}, this.expressForm);
                saveObj.method = "send";
                saveExpress(this.selectedOrder.order_number, saveObj, response => {
                    if(response.status == 200) {
                        MessageBox('保存成功', '保存成功');
                        this.modalExpressShow = !this.modalExpressShow;
                        this.selectedOrder.status = 2;
                        this.selectedOrder.express_company = this.expressForm.express_company;
                        this.selectedOrder.tracking_number = this.expressForm.tracking_number;
                        this.selectedOrder.shipped_time = response.data.shipped_time;
                        this.onResetForm();
                    }
                });
            } else {
                MessageBox('保存失败', '保存失败，数据验证失败');
            }
        }
    }
}
</script>

<style scoped>
.customer-info {
    margin:5px 10px;
    width:95%;
}
.header {
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
}

.body {
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
    justify-content:space-between;
    align-items:center;
}

 .item {
    width:100%;
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    margin-bottom:10px;
}

.detail {
    width: 100%;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
}

.detail-item {
    width: 100%;
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    margin-bottom: 10px;
}

.detail-item-image {
    width:30%;
    height:auto;
}

.detail-item-info {
    width: 70%;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:center;
    margin-left: 10px;
}

.detail-item-value {
    width: 100%;
    text-align: left;
    line-height: 140%;
    height: 28px;
}

.detail-item-name {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}

.buttons {
    width: 100%;
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
}

.order-button {
    width: 30%;
}
</style>