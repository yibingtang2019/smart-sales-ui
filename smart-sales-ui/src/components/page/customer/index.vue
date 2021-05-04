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
                            </div>
                        </b-form>
                    </div>
                </div>
            </b-row>
        </div>
        <div v-if="customers.length > 0" 
            style="margin:5px auto;width:90%;">
            <b-row style="justify-content:space-around;">
                <b-table :items="customers" :fields="fields" 
                    small responsive hover selectable select-mode="single" 
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
        <div v-else style="margin:10px;">
            <h6>没有客户</h6>
        </div>

        <b-modal id="customer-info" title="客户信息" size="lg"
            hide-footer
            v-model="modalShow">
            <div class="feedback-header">
                <div style="width:20%">客户反馈</div>
            </div>
            <div v-if="feedbacks != null && feedbacks.length > 0" style="margin-top:10px;">
                <b-table :items="feedbacks" :fields="feedbackFields" 
                    small responsive hover selectable select-mode="single"
                    @row-selected="onFeedbackRowSelected">
                    <template #cell(category)="data">
                        {{getCategory(data.item.category)}}
                    </template>
                    <template #cell(is_replied)="data">
                        <span :style="{color: getStatusColor(data.item.is_replied)}">
                            {{data.item.is_replied == true ? "已回复" : "未回复"}}
                        </span>
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
                <div style="height:28px;line-height:28px;margin-bottom:10px;margin-left:10px;">
                    反馈时间: {{dateFormat(selectedFeedback.create_time)}} 
                    <img :src="`${publicPath}arrow-up.png`" alt="" style="height:28px;width:20px;cursor:pointer;margin-left:5px;"
                        v-if="selectedFeedback != null" 
                        @click="selectedFeedback = null">
                </div>
                <div style="height:28px;line-height:28px;margin-bottom:10px;margin-left:10px;"
                    v-if="selectedFeedback.is_replied == true">
                    回复时间: {{dateFormat(selectedFeedback.reply_time)}}
                </div>
                <b-form-textarea
                    id="feedback-content"
                    v-model="selectedFeedback.content"
                    rows="6"
                    max-rows="12"
                    disabled>
                </b-form-textarea>
            </div>
            <div style="height:30px;line-height:30px;margin-top:10px;margin-bottom:10px;">客户收藏</div>
            <div v-if="likes != null && likes.length > 0" 
                class="likes">
                <div v-for="like in likes" 
                    v-bind:key="like.product_code" 
                    class="like-item">
                    <b-img :src="like.picture_url" thumbnail class="like-item-image"/>
                    <div border class="like-item-info">
                        <div class="like-item-value">
                            {{ like.product_code }} 
                        </div>
                        <div class="like-item-value like-item-name">
                            {{ like.product_name }}
                        </div>
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
            publicPath: process.env.BASE_URL,
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
                    key: 'province',
                    label: '省份'
                },
                {
                    key: 'city',
                    label: '城市'
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
                    label: '状态',
                    sortable: true 
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
                    label: '状态',
                    sortable: true 
                },
                {
                    key: 'create_time',
                    label: '反馈时间',
                    sortable: true 
                },
                {
                    key: 'reply_time',
                    label: '回复时间',
                    sortable: true 
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
        this.search();
        this.isMobile = this.getIsMobile();
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
        getGender: function(value) {
            return this.getGenderString(value);
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
        getStatusColor(is_replied) {
            return is_replied ? "#28a745" : "#007bff";
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
            }
        }
    }
}
</script>

<style scoped>
.feedback-header {
    height:30px;
    line-height:30px;
    width:100%;
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
}

.likes {
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    margin-bottom:10px;
}

.like-item {
    cursor:pointer;
    margin-bottom:5px;
    width:100%;
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    margin-bottom: 10px;
}

.like-item-image {
    width:30%;
    height:auto;
}

.like-item-info {
    width: 70%;
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    align-items:center;
    margin-left: 10px;
}

.like-item-value {
    width: 100%;
    text-align: left;
    line-height: 150%;
    height: 28px;
}

.like-item-name {
    height: 52px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

#feedback-content {
    overflow-y: hidden !important;
    background-color: #FFF;
}
</style>