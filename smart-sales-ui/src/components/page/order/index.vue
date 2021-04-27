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
                    small responsive hover selectable select-mode="single" 
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
                        {{data.item.status == 2 ? dateFormat(data.item.shipped_time) : ''}}
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
            <div class="card" style="margin:5px 10px;width:95%;">
                <div class="card-header" style="display:flex;flex-direction:row;justify-content:space-between;align-items:center;">
                    <div style="width:80%">订单编号: {{selectedOrder.order_number}}</div> 
                    <div :style="{color: getStatusColor(selectedOrder.status)}">
                        {{getStatus(selectedOrder.status)}}
                    </div> 
                </div>
                <div class="card-body" style="display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-between;align-items:center;">
                    <div style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">收货人:</div>
                        <div style="width:70%">{{selectedOrder.address_user_name}}</div>
                    </div>
                    <div style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">收货手机:</div>
                        <div style="width:70%">{{selectedOrder.address_tel_number}}</div>
                    </div>
                    <div style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">详细地址:</div>
                        <div style="width:70%">{{selectedOrder.address_detail_info}}</div>
                    </div>
                    <div style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">下单时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.create_time)}}</div>
                    </div>
                    <div v-if="selectedOrder.status == 1 || selectedOrder.status == 2 || selectedOrder.status == 3" 
                        style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">付款时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.payment_time)}}</div>
                    </div>
                    <div v-if="selectedOrder.status == 2"
                        style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">发货时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.shipped_time)}}</div>
                    </div>
                    <div v-if="selectedOrder.status == 3"
                        style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">收货时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.received_time)}}</div>
                    </div>
                    <div v-if="selectedOrder.status == 4"
                        style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">取消时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.canceled_time)}}</div>
                    </div>
                    <div v-if="selectedOrder.status == 5"
                        style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">删除时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.deleted_time)}}</div>
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
                <div class="card-body" style="display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-between;align-items:center;">
                    <div style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">姓名:</div>
                        <div style="width:70%">{{selectedOrder.name}}</div>
                    </div>
                    <div style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">昵称:</div>
                        <div style="width:70%">{{selectedOrder.nick_name}}</div>
                    </div>
                    <div style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">手机号码:</div>
                        <div style="width:70%">{{selectedOrder.tel}}</div>
                    </div>
                    <div v-if="selectedOrder.weixin != ''" 
                        style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">微信:</div>
                        <div style="width:70%">{{selectedOrder.weixin}}</div>
                    </div>
                    <div style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">性别:</div>
                        <div style="width:70%">{{getGender(selectedOrder.gender)}}</div>
                    </div>
                    <div style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">所在地:</div>
                        <div style="width:70%">{{selectedOrder.province}} {{selectedOrder.city}}</div>
                    </div>
                    <div style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">加入时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.create_time)}}</div>
                    </div>
                    <div style="width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="width:30%;">登录时间:</div>
                        <div style="width:70%">{{dateFormat(selectedOrder.last_login_time)}}</div>
                    </div>
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
    getOptionsStatus
} from 'api/config';

import { 
    getOrderList
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
            optionsStatus: [],
            fields: [],
            fieldsSimple: [
                {
                    key: 'order_number',
                    label: '订单编号',
                    class: 'W140'
                },
                {
                    key: 'status',
                    label: '状态'
                },
                {
                    key: 'create_time',
                    label: '创建时间',
                    class: 'W100'
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
                    label: '状态'
                },
                {
                    key: 'name',
                    label: '姓名'
                },
                {
                    key: 'tel',
                    label: '手机号码'
                },
                {
                    key: 'create_time',
                    label: '创建时间',
                    class: 'W160'
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
            modalShow: false,
            total: 0,
            currentPage: 1,
            pageSize: 20
        }
    },
    mounted() {
        this.optionsStatus = getOptionsStatus();
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
        getGender: function(value) {
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
                
            } else {
                this.selectedOrder = null;
            }
            this.modalShow = !this.modalShow;
        }
    }
}
</script>

<style>

</style>