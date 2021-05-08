<template>
    <div style="margin:5px;">
        <div class="stat-container">
            <div class="item">
                <div id="lineWeekChart" class="chart-wrap" ></div>
            </div>
            <div class="item">
                <div id="lineMonthChart" class="chart-wrap" ></div>
            </div>
            <div class="item">
                <div id="chartPie" class="chart-wrap"></div>
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
            statsData: [],
            weekData: [],
            monthData: [],
            weekDays: [],
            monthDays: [],
            chartPie: null,
            lineWeekChart: null,
            lineMonthChart: null
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getLineChartXData(7);
            this.getLineChartXData(30);
            this.getStats();
        });
    },
    methods: {
        getLineChartXData(days) {
            var now = new Date();
            var currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - days);
            var dates = [];
            while(currentDate < now) {
                dates.push(this.getDate(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            if(days == 7) {
                this.weekDays = dates;
            } else if(days == 30) {
                this.monthDays = dates;
            }
        },
        getDate(time) {
            var t = new Date(time);
            var year = t.getFullYear();
            var month = t.getMonth() + 1;
            var day = t.getDate();
            var newTime = year + '-' +
                (month < 10 ? '0' + month : month) + '-' +
                (day < 10 ? '0' + day : day);
            return newTime;
        },
        getStats() {
            getOrderStatistic({ method: "status" }, response => {
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
            });

            getOrderStatistic({ method: "week" }, response => {
                if(response.status == 200) {
                    this.weekData = response.data.data;
                    this.drawWeekLine();
                }
            });

            getOrderStatistic({ method: "month" }, response => {
                if(response.status == 200) {
                    this.monthData = response.data.data;
                    this.drawMonthLine();
                }
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
                    text: '实时订单状态统计',
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
        },
        drawWeekLine() {
            this.lineWeekChart = echarts.init(document.getElementById('lineWeekChart'));
            this.lineWeekChart.setOption({
                title: { text: '过去七日付款订单', x: 'center' },
                tooltip: { trigger: 'axis' },
                xAxis: {
                    data: this.weekDays
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'line',
                    data: this.weekData
                }]
            });
        },
        drawMonthLine() {
            this.lineMonthChart = echarts.init(document.getElementById('lineMonthChart'));
            this.lineMonthChart.setOption({
                title: { text: '过去三十日付款订单', x: 'center' },
                tooltip: {},
                xAxis: {
                    data: this.monthDays
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'line',
                    data: this.monthData
                }]
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

.chart-wrap{
    width:100%;
    height:400px;
}
</style>