<template>
    <div id="bar" style="width:100%;height:400px;"></div>
</template>

<script>
    import * as echarts from 'echarts';
    import {getNum} from "@/api/api";
 //   import {getBar} from '../api/api';

    export default {
        name: 'Bar',
        data() {
            return {
                wenshuNum:[
                    {value: 1048, name: '搜索引擎'},
                    {value: 735, name: '直接访问'},
                    {value: 580, name: '邮件营销'},
                    {value: 484, name: '联盟广告'},
                    {value: 300, name: '视频广告'}
                ]
            }
        },
        mounted: function() {
           // this.getPie();
            this.getBar();
        },
        methods: {
            async getBar(){
               var data = (await getNum()).data;
               if(data.status===200){
                   this.InitBar(data.data.wenshuNum);
               }



            },
            InitBar(data){
                var myChart = echarts.init(document.getElementById('bar'));
                // 指定图表的配置项和数据
                var option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        top: '2%',
                        left: 'center',
                        bottom:'2%'
                    },
                    series: [
                        {
                            name: '案件类型',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '40',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: data
                        }]
                };
                myChart.setOption(option)

            }

        }

    }
</script>

<style scoped>

</style>
