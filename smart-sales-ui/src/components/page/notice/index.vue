<template>
    <b-container>
        <div style="margin:5px;">
            <b-row>
                <div class="card" style="margin:5px 20px;width:100%">
                    <div class="card-body">
                        <b-form @submit="onSubmit">
                            <div style="text-align:right">
                                <b-button type="submit" variant="primary" style="margin-right:5px;">
                                    刷新
                                </b-button>
                                <b-button
                                    v-b-toggle.editor
                                    @click="createNotice"
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
        <div v-if="notices.length > 0" 
            style="margin:5px auto;width:90%;">
            <b-row style="justify-content:space-around;">
                <b-table :items="notices" :fields="fields" 
                    small responsive hover selectable select-mode="single"
                    @row-selected="onRowSelected">
                    <template #cell(status)="data">
                        <span :style="{color: getStatusColor(data.item.status)}">
                            {{data.item.status == true ? "已启用" : "未启用"}}
                        </span>
                    </template>
                    <template #cell(create_time)="data">
                        {{dateFormat(data.item.create_time)}}
                    </template>
                </b-table>
            </b-row>
        </div>
        <div v-else style="margin:10px;">
            <h6>没有公告</h6>
        </div>

         <b-sidebar id="editor" 
            :title="editForm.id > 0 ? '编辑公告' : '新建公告'" 
            right shadow
            v-model="showEditor"
            width="80%">
            <div class="px-3 py-2"
                style="margin:5px">
                <b-form @reset="onResetForm" ref="editorForm">
                    <b-form-group id="groupNoticeName" label="公告名称:" label-for="name">
                        <b-form-input
                            id="name"
                            v-model="editForm.name"
                            placeholder="请输入公告名称"
                            required>
                        </b-form-input>
                    </b-form-group>
                    <div style="display:flex;align-items:center;flex-wrap:wrap;margin:20px;0px;">
                        <div style="margin-right:20px;margin-bottom:10px;">
                            <mt-switch v-model="editForm.status">是否发布</mt-switch>
                        </div>
                    </div>
                    <b-form-group id="groupContent" label="内容:" label-for="content">
                        <b-form-textarea
                            id="content"
                            v-model="editForm.content"
                            rows="6"
                            max-rows="12">
                        </b-form-textarea>
                    </b-form-group>
                    <b-form-group id="groupCreatedTime" label="创建时间:" label-for="create_time" v-if="editForm.id > 0">
                        <b-form-input
                            id="create_time"
                            v-model="editForm.create_time"
                            :disabled="disabled">
                        </b-form-input>
                    </b-form-group>
                </b-form>
            </div>
            <template>
                <div class="d-flex bg-senconday text-light align-items-center px-3 py-2">
                    <b-button @click="saveNotice"
                        variant="primary" size="md"
                        style="margin-left:10px;margin-top:5px;">
                        保存
                    </b-button>
                    <b-button href="#"
                        @click="deleteNotice"
                        style="margin-left:10px;margin-top:5px;">
                        删除
                    </b-button>
                </div>
            </template>
         </b-sidebar>
    </b-container>
</template>

<script>
import { 
    Indicator, 
    MessageBox
} from 'mint-ui';

import {
    getNoticeList, saveNotice, editNotice, updateNoticeStatus, deleteNotice
} from "api/notice";

export default {
    data() {
        return {
            disabled: true,
            notices: [],
            fields: [
                {
                    key: 'name',
                    label: '公告名称'
                },
                {
                    key: 'status',
                    label: '状态'
                },
                {
                    key: 'create_time',
                    label: '创建时间'
                }
            ],
            selected: [],
            selectedNotice: null,
            showEditor: false,
            editForm: {
                id: 0,
                status: false,
                name: '',
                content: ''
            },
            total: 0
        }
    },
    mounted() {
        this.search();
    },
    methods: {
        getStatusColor(status) {
            return status ? "#28a745" : "#007bff";
        },
        dateFormat: function(time) {
            return this.dateFormatString(time);
        },
        onSubmit() {
            this.search();
        },
        search() {
            Indicator.open({ text: '加载中...', spinnerType: 'fading-circle' });
            getNoticeList(response => {
                if(response.status == 200) {
                    this.notices = response.data.data;
                    this.total = response.data.total;
                }
                Indicator.close();
            });
        },
        onRowSelected(items) {
            this.selected = items;
            if(this.selected.length > 0) {
                this.selectedNotice = this.selected[0];
                this.editNotice(this.selectedNotice.id, this.selectedNotice);
                this.showEditor = true;
            }
        },
        setStatus(status) {
            if(this.selectedNotice != null) {
                let _this = this;
                MessageBox.confirm('确定改变此公告状态?').then(action => {
                    updateNoticeStatus(_this.selectedNotice.id, {}, response => {
                        if(response.status == 200) {
                            MessageBox('保存成功', '保存成功');
                            _this.selectedNotice.status = status;
                        }
                    });
                }).catch(()=>{});
            }
        },
        onResetForm(event) {
            if(event) {
                event.preventDefault();
            }
            this.editForm.id = 0;
            this.editForm.name = '';
            this.editForm.content = '';
            this.editForm.status = false;
            this.editForm.create_time = '';
        },
        createNotice() {
            this.onResetForm();
        },
        editNotice(id, notice) {
            this.editForm.id = id;
            this.editForm.name = notice.name;
            this.editForm.content = notice.content;
            this.editForm.status = notice.status;
            this.editForm.create_time = this.dateFormatString(notice.create_time);
        },
        saveNotice() {
            let form = this.$refs['editorForm'];
            let valid = form.checkValidity();
            if(valid) {
                valid = this.editForm.content.length <= 26;
                if(valid == false) {
                    MessageBox('保存失败', '内容不能超过26个字符');
                    return;
                }
            }
            if(valid) {
                let saveObject = Object.assign({}, this.editForm);
                if(this.editForm.id == 0) {
                    saveNotice(saveObject, response => {
                        if(response.status == 201) {
                            MessageBox('保存成功', '保存成功');
                            this.search();
                        }
                    });
                } else {
                    editNotice(saveObject, response => {
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
        deleteNotice() {
            MessageBox.confirm(`确定删除此公告? 请注意此项操作不能回退！`).then(action => {
                deleteNotice(this.editForm.id, response => {
                    if(response.status == 200) {
                        MessageBox('删除成功', '删除成功');
                        this.search();
                        this.showEditor = false;
                        this.onResetForm();
                    }
                });
            }).catch(()=>{});
        }
    }
}
</script>