<template>
    <b-container>
        <div style="margin:5px;">
            <b-row>
                <div class="card" style="margin:5px 20px;width:100%">
                    <div class="card-body">
                        <b-form @submit="onSubmit">
                            <b-form-group id="groupIsReplied" label="" label-for="is_replied">
                                <b-form-select id="is_replied"
                                    v-model="form.is_replied" 
                                    :options="optionsIsReplied">
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
        <div v-if="feedbacks.length > 0" 
            style="margin:5px auto;width:90%;">
            <b-row style="justify-content:space-around;">
                <b-table :items="feedbacks" :fields="fields" 
                    small responsive hover selectable select-mode="single"
                    @row-selected="onRowSelected">
                    <template #cell(category)="data">
                        {{getCategory(data.item.category)}}
                    </template>
                    <template #cell(is_replied)="data">
                        <span :style="{color: getStatusColor(data.item.is_replied)}">
                            {{data.item.is_replied == true ? "已回复" : "未回复"}}
                        </span>
                    </template>
                    <template #cell(name)="data">
                        <span>
                            {{data.item.name == null ? data.item.nick_name : data.item.name}}
                        </span>
                    </template>
                    <template #cell(create_time)="data">
                        {{dateFormat(data.item.create_time)}}
                    </template>
                    <template #cell(reply_time)="data">
                        {{data.item.is_replied == true ? dateFormat(data.item.reply_time) : ''}}
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
            <h6>没有反馈</h6>
        </div>

        <b-modal id="feedback-info" title="客户反馈信息" size="lg"
            hide-footer
            v-model="modalShow">
            <div class="card feedback-info">
                <div class="card-header header">
                    <div style="width:80%">反馈信息</div>
                    <div v-if="selectedFeedback != null" 
                        :style="{color: getStatusColor(selectedFeedback.is_replied)}">
                        {{selectedFeedback.is_replied == false ? '未回复': '已回复' }}
                    </div>
                </div>
                <div v-if="selectedFeedback != null" class="card-body body">
                    <div class="item">
                        <div style="width:30%;">反馈类别:</div>
                        <div style="width:70%">
                            {{getCategory(selectedFeedback.category)}}
                        </div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">反馈时间:</div>
                        <div style="width:70%">
                            {{dateFormat(selectedFeedback.create_time)}}
                        </div>
                    </div>
                    <div class="item"
                        v-if="selectedFeedback.is_replied == true">
                        <div style="width:30%;">回复时间:</div>
                        <div style="width:70%">
                            {{dateFormat(selectedFeedback.reply_time)}}
                        </div> 
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
            </div>
            <div class="card" style="margin:5px 10px;width:95%;" v-if="selectedFeedback != null">
                <div class="card-header">
                    <div>
                        <b-img thumbnail fluid :src="selectedFeedback.avatar_url" 
                            center lazy width="50" height="50" rounded="circle"
                            v-if="selectedFeedback.avatar_url != ''">
                        </b-img>
                    </div>
                </div>
                <div class="card-body body">
                    <div class="item">
                        <div style="width:30%;">姓名:</div>
                        <div style="width:70%">{{selectedFeedback.name}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">昵称:</div>
                        <div style="width:70%">{{selectedFeedback.nick_name}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">手机号码:</div>
                        <div style="width:70%">{{selectedFeedback.tel}}</div>
                    </div>
                    <div v-if="selectedFeedback.weixin != ''" 
                        class="item">
                        <div style="width:30%;">微信:</div>
                        <div style="width:70%">{{selectedFeedback.weixin}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">性别:</div>
                        <div style="width:70%">{{getGender(selectedFeedback.gender)}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">所在地:</div>
                        <div style="width:70%">{{selectedFeedback.province}} {{selectedFeedback.city}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">加入时间:</div>
                        <div style="width:70%">{{dateFormat(selectedFeedback.customer_create_time)}}</div>
                    </div>
                    <div class="item">
                        <div style="width:30%;">登录时间:</div>
                        <div style="width:70%">{{dateFormat(selectedFeedback.last_login_time)}}</div>
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
    getOptionsIsReplied
} from 'api/config';

import {
    getFeedbackList, replyFeedback
} from "api/feedback";

export default {
    data() {
        return {
            publicPath: process.env.BASE_URL,
            isMobile: false,
            loading: true,
            feedbacks: [],
            form: {
                is_replied: null
            },
            optionsIsReplied: [],
            fields: [],
            fieldsSimple: [
                {
                    key: 'is_replied',
                    label: '状态'
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
            fieldsAll: [
                {
                    key: 'is_replied',
                    label: '状态'
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
                    key: 'name',
                    label: '姓名'
                },
                {
                    key: 'create_time',
                    label: '创建时间'
                },
                {
                    key: 'reply_time',
                    label: '回复时间'
                }
            ],
            showAll: false,
            selected: [],
            selectedFeedback: null,
            modalShow: false,
            total: 0,
            currentPage: 1,
            pageSize: 20
        }
    },
    mounted() {
        this.optionsIsReplied = getOptionsIsReplied();
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
            this.form.is_replied = null;
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
            getFeedbackList(params, response => {
                if(response.status == 200) {
                    this.feedbacks = response.data.data;
                    this.total = response.data.total;
                }
                Indicator.close();
            });
        },
        getFilter() {
            return {
                "is_replied": this.form.is_replied,
                "page_size": this.pageSize,
                "current_page": this.currentPage
            };
        },
        onRowSelected(items) {
            this.selected = items;
            if(this.selected.length > 0) {
                this.selectedFeedback = this.selected[0];
            }
            this.modalShow = !this.modalShow;
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
.feedback-info {
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
    margin-top: 10px;
}

.order-button {
    width: 30%;
}

#feedback-content {
    overflow-y: hidden !important;
    background-color: #FFF;
}
</style>