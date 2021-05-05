<template>
    <div style="margin:5px;">
        <div class="stat-container">
            <div class="item">
                <div id="chartPie" class="pie-wrap"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { 
    Indicator
} from 'mint-ui';

import * as echarts from 'echarts';
// require('echarts/theme/blue');

import { 
    getOrderStatistic
} from "api/order";

export default {
    data() {
        return {
            stats: [],
            statsData: [],
            chartPie: null
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getStats();
        });
    },
    methods: {
        getStats() {
            Indicator.open({ text: '加载中...', spinnerType: 'fading-circle' });
            getOrderStatistic(response => {
                if(response.status == 200) {
                    let stats = response.data.data;
                    if(stats[0] > 0) {
                        this.statsData.push({value: stats[0], name: '待付款'});
                    }
                    if(stats[1] > 0) {
                        this.statsData.push({value: stats[1], name: '待发货'});
                    }
                    if(stats[2] > 0) {
                        this.statsData.push({value: stats[2], name: '待收货'});
                    }
                    if(stats[3] > 0) {
                        this.statsData.push({value: stats[3], name: '已完成'});
                    }
                    if(stats[4] > 0) {
                        this.statsData.push({value: stats[4], name: '已取消'});
                    }
                    if(stats[5] > 0) {
                        this.statsData.push({value: stats[5], name: '已删除'});
                    }
                    this.drawPieChart();
                }
                Indicator.close();
            });
        },
        drawPieChart() {
            let mytextStyle = {
                color: "#333",                          
                fontSize: 18,                            
            };
            let mylabel = {
                show: true,                 
                position: "right",          
                offset: [30, 40],             
                formatter: '{b} : {c} ({d}%)',      
                textStyle: mytextStyle
            };
            this.chartPie = echarts.init(document.getElementById('chartPie'),'macarons');
            this.chartPie.setOption({
                title: {
                    text: '订单状态统计',
                    subtext: '',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)",
                },
                legend: {
                    data: ['待付款', '待发货', '待收货', '已完成', '已取消', '已删除'],
                    left:"center",                              
                    top:"bottom",                              
                    orient:"horizontal",                        
                },
                series: [
                    {
                        name: '订单状态',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center: ['50%', '50%'],
                        data: this.statsData,
                        animationEasing: 'cubicInOut',
                        animationDuration: 2600,
                        label: {           
                            emphasis: mylabel
                        }
                    }
                ]
            });
        }
    }
}
</script>

<style scope>
.stat-container {
    margin:5px auto;
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
}

.item {
    width:100%;
}

.pie-wrap{
    width:100%;
    height:400px;
}
</style>