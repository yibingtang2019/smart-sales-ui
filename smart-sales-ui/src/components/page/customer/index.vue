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
                                    placeholder="请输入客户姓名/昵称/手机号码">
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
            <div class="card" style="margin:5px 10px;width:95%;"
                v-if="selectedCustomer != null">
                <div class="card-header">
                    <div>
                        <b-img thumbnail fluid :src="selectedCustomer.avatar_url" 
                            center lazy width="50" height="50" rounded="circle"
                            v-if="selectedCustomer.avatar_url != ''">
                        </b-img>
                    </div>
                </div>
                <div class="card-body body">
                    <div class="item">
                        <div v-if="selectedCustomer.name != null" style="width:30%;">姓名:</div>
                        <div style="width:70%">{{selectedCustomer.name}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">昵称:</div>
                        <div style="width:70%">{{selectedCustomer.nick_name}}</div>
                    </div>
                    <div v-if="selectedCustomer.customer_tel != null" class="item">
                        <div style="width:30%;">手机号码:</div>
                        <div style="width:70%">{{selectedCustomer.customer_tel}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">性别:</div>
                        <div style="width:70%">{{getGender(selectedCustomer.gender)}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">所在地:</div>
                        <div style="width:70%">{{selectedCustomer.province}} {{selectedCustomer.city}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">加入时间:</div>
                        <div style="width:70%">{{dateFormat(selectedCustomer.create_time)}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">登录时间:</div>
                        <div style="width:70%">{{dateFormat(selectedCustomer.last_login_time)}}</div>
                    </div>
                </div>
            </div>
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
                <div class="buttons">
                    <b-link v-if="selectedFeedback.is_replied == false"
                        @click="setReplied"
                        class="order-button">
                        设为已回复
                    </b-link>
                </div>
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
    getFeedbackList, replyFeedback
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
                    key: 'is_replied',
                    label: '状态',
                    sortable: true 
                },
                {
                    key: 'category',
                    label: '类别'
                },
                {
                    key: 'tel',
                    label: '手机号码'
                }
            ],
            feedbackFieldsAll: [
                {
                    key: 'is_replied',
                    label: '状态',
                    sortable: true 
                },
                {
                    key: 'category',
                    label: '类别'
                },
                {
                    key: 'tel',
                    label: '手机号码'
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
        this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
            if(modalId == 'customer-info') {
                this.selectedFeedback = null;
            }
        });
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
            return this.getCategoryString(value);
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
                this.selectedFeedback = null;
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
                            this.selectedFeedback = null;
                        }
                    });
                }
            }
            this.modalShow = !this.modalShow;
        },
        onFeedbackRowSelected(items) {
            if(items.length > 0) {
                this.selectedFeedback = items[0];
            }
        },
        setReplied() {
            if(this.selectedFeedback != null) {
                let _this = this;
                MessageBox.confirm('确定设置此反馈为已回复?').then(action => {
                    replyFeedback(_this.selectedFeedback.id, response => {
                        if(response.status == 200) {
                            MessageBox('保存成功', '保存成功');
                            _this.selectedFeedback.is_replied = true;
                            _this.selectedFeedback.reply_time = response.data.reply_time;
                        }
                    });
                }).catch(()=>{});
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

.buttons {
    width: 100%;
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    margin-top: 10px;
}

.order-button {
    width: 30%;
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
</style>