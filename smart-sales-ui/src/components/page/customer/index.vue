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
                                    placeholder="请输入客户姓名/昵称/手机号码/微信">
                                </b-form-input>
                            </b-form-group>
                            <div style="text-align:right">
                                <b-button type="submit" variant="primary" style="margin-right:5px;">
                                    查询
                                </b-button>
                                <b-button type="button" @click="onReset" variant="secondary" style="margin:0px 5px;">
                                    重置
                                </b-button>
                                 <b-button type="button"
                                    @click="toggleShow"
                                    variant="secondary" style="margin:0px 5px;">
                                    {{showAll == true ? "隐藏列" : "显示列" }}
                                </b-button>
                            </div>
                        </b-form>
                    </div>
                </div>
            </b-row>
        </div>
        <div v-if="customers.length" 
            style="margin:5px auto;width:90%;">
            <b-row style="justify-content:space-around;">
                <b-table :items="customers" :fields="fields" 
                    responsive hover selectable select-mode="single" 
                    @row-selected="onRowSelected"
                    ref="customerTable">
                    <template #cell(avatar_url)="data">
                        <b-img thumbnail fluid :src="data.item.avatar_url" 
                            center lazy width="30" height="30"
                            v-if="data.item.avatar_url!=''">
                        </b-img>
                    </template>
                    <template #cell(gender)="data">
                        {{getGender(data.item.gender)}}
                    </template>
                    <template #cell(create_time)="data">
                        {{dateFormat(data.item.create_time)}}
                    </template>
                    <template #cell(last_login_time)="data">
                        {{dateFormat(data.item.last_login_time)}}
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
            <h5>没有客户</h5>
        </div>

        <b-modal id="customer-info" title="客户信息" size="lg"
            hide-footer
            v-model="modalShow">
            <div style="height:30px;line-height:30px">客户收藏</div>
            <div v-if="likes != null && likes.length > 0" 
                style="display: flex;flex-wrap:wrap;justify-content:flex-start;margin-bottom:10px;">
                <div v-for="like in likes" 
                    v-bind:key="like.product_code" 
                    style="cursor:pointer;margin:5px;">
                    <b-img :src="like.picture_url" thumbnail style="width:90px;height:auto;"/>
                    <div border style="width:90px;display:block;overflow:hidden;margin-top:5px;text-align:center;">
                        {{ like.product_code }}
                    </div>
                </div>
            </div>
            <div style="height:30px;line-height:30px;width:100%;display:flex;flex-direction:row;justify-content:space-between;align-items:center;">
                <div style="width:20%">客户反馈</div>
                <b-link href="#"
                    @click="toggleShowFeedback"
                    style="font-size:13px;margin-right:10px;width:20%;text-align:right;font-size:16px;">
                    {{showAllFeedback == true ? "隐藏列" : "显示列" }}
                </b-link>
            </div>
            <div v-if="feedbacks != null && feedbacks.length > 0" style="margin-top:10px;">
                <b-table :items="feedbacks" :fields="feedbackFields" 
                    responsive hover selectable select-mode="single"
                    @row-selected="onFeedbackRowSelected">
                    <template #cell(category)="data">
                        {{getCategory(data.item.category)}}
                    </template>
                    <template #cell(is_replied)="data">
                        {{data.item.is_replied == true ? "已回复" : "未回复"}}
                    </template>
                    <template #cell(create_time)="data">
                        {{dateFormat(data.item.create_time)}}
                    </template>
                    <template #cell(reply_time)="data">
                        {{data.item.is_replied == true ? dateFormat(data.item.reply_time) : ''}}
                    </template>
                </b-table>
            </div>
            <div v-if="selectedFeedback != null" style="margin-top:10px;margin-bottom:10px;">
                <b-form-textarea
                    id="feedback-content"
                    v-model="selectedFeedback.content"
                    rows="6"
                    max-rows="12">
                </b-form-textarea>
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
    getCustomerList
} from "api/customer";

import {
    getFeedbackList
} from "api/feedback";

import {
    getProductListByProductCodes
} from "api/product";

import { 
    getPicturePath 
} from "api/picture";

export default {
    data() {
        return {
            isMobile: false,
            loading: true,
            disabled: true,
            customers: [],
            form: {
                search: null
            },
            fields: [],
            fieldsSimple: [
                {
                    key: 'avatar_url',
                    label: '头像',
                    align: "left"
                },
                {
                    key: 'name',
                    label: '姓名'
                },
                {
                    key: 'nick_name',
                    label: '昵称'
                },
                {
                    key: 'tel',
                    label: '手机'
                }
            ],
            fieldsAll: [
                {
                    key: 'avatar_url',
                    label: '头像'
                },
                {
                    key: 'name',
                    label: '姓名'
                },
                {
                    key: 'nick_name',
                    label: '昵称'
                },
                {
                    key: 'gender',
                    label: '性别'
                },
                {
                    key: 'city',
                    label: '城市'
                },
                {
                    key: 'province',
                    label: '省份'
                },
                {
                    key: 'tel',
                    label: '手机号码'
                },
                {
                    key: 'weixin',
                    label: '微信'
                },
                {
                    key: 'create_time',
                    label: '创建时间'
                },
                {
                    key: 'last_login_time',
                    label: '最后登录时间'
                }
            ],
            showAll: false,
            feedbackFields: [],
            feedbackFieldsSimple: [
                {
                    key: 'category',
                    label: '类别'
                },
                {
                    key: 'tel',
                    label: '手机号码'
                },
                {
                    key: 'is_replied',
                    label: '状态'
                }
            ],
            feedbackFieldsAll: [
                {
                    key: 'category',
                    label: '类别'
                },
                {
                    key: 'tel',
                    label: '手机号码'
                },
                {
                    key: 'is_replied',
                    label: '状态'
                },
                {
                    key: 'create_time',
                    label: '反馈时间'
                },
                {
                    key: 'reply_time',
                    label: '回复时间'
                }
            ],
            showAllFeedback: false,
            selected: [],
            selectedCustomer: null,
            likes: [],
            feedbacks: [],
            selectedFeedback: null,
            modalShow: false,
            total: 0,
            currentPage: 1,
            pageSize: 20
        }
    },
    mounted() {
        this.getIsMobile();
        this.search();
        if(this.isMobile) {
            this.showAll = false;
            this.fields = this.fieldsSimple;
            this.showAllFeedback = false;
            this.feedbackFields = this.feedbackFieldsSimple;
        } else {
            this.showAll = true;
            this.fields = this.fieldsAll;
            this.showAllFeedback = true;
            this.feedbackFields = this.feedbackFieldsAll;
        }
    },
    watch: {
        currentPage: function(newValue, oldValue) {
            this.search();
        }
    },
    methods: {
        getIsMobile() {
            this.flag = navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            );
            if(this.flag === null) {
                this.isMobile = false;
            } else {
                this.isMobile = true;
            }
        },
        getGender: function(value) {
            if(value == 0) {
                return '未知';
            }
            if(value == 1) {
                return '男';
            }
            if(value == 2) {
                return '女';
            }
        },
        getCategory(value) {
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
        },
        dateFormat: function(time) {
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
        },
        toggleShow() {
            this.showAll = !this.showAll;
            if(this.showAll == true) {
                this.fields = this.fieldsAll;
            } else {
                this.fields = this.fieldsSimple;
            }
        },
        toggleShowFeedback() {
            this.showAllFeedback = !this.showAllFeedback;
            if(this.showAllFeedback == true) {
                this.feedbackFields = this.feedbackFieldsAll;
            } else {
                this.feedbackFields = this.feedbackFieldsSimple;
            }
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
            getCustomerList(params, response => {
                if(response.status == 200) {
                    this.customers = response.data.data;
                    this.total = response.data.total;
                }
                Indicator.close();
            });
        },
        getFilter() {
            return {
                "search": this.form.search == null ? '' : this.form.search,
                "page_size": this.pageSize,
                "current_page": this.currentPage
            };
        },
        onRowSelected(items) {
            this.selected = items;
            if(this.selected.length > 0) {
                this.selectedCustomer = this.selected[0];
                if(this.selectedCustomer.likes != "") {
                    const query_likes_data = {
						product_codes: this.selectedCustomer.likes
					};
                    getProductListByProductCodes(query_likes_data, respLikes => {
                        if(respLikes.status == 200) {
                            this.likes = respLikes.data.data;
                            if(this.likes.length > 0) {
                                this.likes.forEach(like => {
                                    if(like.picture_url) {
                                        like.picture_url = getPicturePath(like.picture_url);
                                    }
                                });
                            }
                        }
                    });
                    const query_feedbacks_data = {
						customer_id: this.selectedCustomer.id
					};
                    getFeedbackList(query_feedbacks_data, respFeedbacks => {
                        if(respFeedbacks.status == 200) {
                            this.feedbacks = respFeedbacks.data.data;
                        }
                    });
                }
            } else {
                this.selectedCustomer = null;
            }
            this.modalShow = !this.modalShow;
        },
        onFeedbackRowSelected(items) {
            if(items.length > 0) {
                this.selectedFeedback = items[0];
            } else {
                this.selectedFeedback = null;
            }
        }
    }
}
</script>

<style scoped>

</style>