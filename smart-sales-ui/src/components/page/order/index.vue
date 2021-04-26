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
    </b-container>
</template>

<script>
import { 
    Indicator, 
    MessageBox
} from 'mint-ui';

import { 
    getOrderList
} from "api/order";

export default {
    data() {
        return {
            
        }
    },
    methods: {
        onSubmit() {

        }
    }
}
</script>