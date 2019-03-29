<template>
    <div style="padding: 30px">
      <div class="dis_top">
        <h3>离散量监控</h3>
        <div class="RxData">
          <el-button :disabled="isStart" @click="startMonitor()" type="success" size="small"
                     style="font-size: 12px;margin-right: 20px" icon="el-icon-circle-check-outline ">开始
          </el-button>
          <el-button :disabled="!isStart" @click="stopMonitor()" type="danger" size="small"
                     style="font-size: 12px;margin-right: 20px" icon="el-icon-circle-close-outline">结束
          </el-button>
          <el-button type="warning" @click="clearMonitor()" style="margin-right: 30px" size="small"
                     icon="el-icon-delete">清空
          </el-button>
          <el-popover placement="bottom-end" width="300" v-model="saveData">
            <h4 style="margin-bottom: 20px">请输入文件名</h4>
            <label>文件名：</label>
            <el-input style="width: 200px" v-model="fileName" size="small" placeholder="请输入文件名" clearable></el-input>
            <div style="text-align: right; margin: 20px">
              <el-button size="mini" type="text" @click="saveData = false">取消</el-button>
              <el-button type="primary" size="mini" @click="saveData = false">保存</el-button>
            </div>
            <el-button type="primary" :disabled="isSave" size="small" icon="el-icon-upload" slot="reference">储存
            </el-button>
          </el-popover>
        </div>
        <div id="main" style="width: 1600px;height:400px;"></div>
      </div>
      <div class="dis_bottoom">
        <div class="dis_left">
          <h3>数据</h3>
          <div id="affiche">
            <div class="affiche_text">
              0100101011010101101010110101010110101010101010112312321321
            </div>
          </div>
        </div>
        <div class="dis_right">
          <h3>翻译</h3>
        </div>
      </div>
    </div>
</template>

<script>
  import $ from 'jquery'
    export default {
        name: "Discrete",
      data(){
          return{
            saveData: false,
            fileName: '',
            isSave: true,
            isStart: false,
          }
      },
      methods:{
          drawChart(){
            var echarts = require('echarts/lib/echarts.js')
            var myChart = echarts.init(document.getElementById('main'));
            // 显示标题，图例和空的坐标轴
            myChart.setOption({
              title: {
                text: '离散量数据'
              },
              tooltip: {},
              legend: {
                data:['离散量']
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
              },
              yAxis: {
                min:-2,
                max:2,
                boundaryGap: [0, '100%'],
                type: 'value'
              },
              series: [{
                name: '离散量',
                type:'line',
                step:'middle'
              }],
              itemStyle:{

              }

            });
          },
        marquee(){
          var scrollWidth = $('#affiche').width();
          var textWidth = $('.affiche_text').width();
          var i = scrollWidth;
          setInterval(function() {
            i--;
            if(i < -textWidth ) {
              i = scrollWidth;
            }
            $('.affiche_text').animate({'left': i+'px'}, 10);
          }, 1);
        },
        //监听控制
        startMonitor() {
          console.log('开始监听')
          var echarts = require('echarts/lib/echarts.js')
          var myChart = echarts.init(document.getElementById('main'));
          var date = [];
          var data =[];
          for(var i=0;i<20;i++){
            date.push('');
            data.push('')
          };
          this.marquee()
          setInterval(function () {
            var now = new Date();
            var Today = now.toLocaleTimeString() +'.'+now.getMilliseconds()
            date.push(Today);
            var temp = Math.round(Math.random())
            if(temp==0){
              temp=-1
            }
            data.push(temp)
              data.shift()
              date.shift()
            myChart.setOption({
              xAxis: {
                data: date,
              },
              series: [{
                name:'成交',
                data: data
              }]
            });
          }, 500);
          this.isStart = true
          this.isSave = true
        },
        stopMonitor() {
          console.log('停止监听')
          this.isStart = false
          this.isSave = false
        },
        clearMonitor() {
          console.log('清空数据')
          this.isSave = true
        },
      },
      mounted(){
          this.drawChart()
      }
    }
</script>

<style scoped>
  .dis_left{ flex: 3}
  .dis_right{flex: 2}
  #affiche {
    margin-top: 20px;
    color: #71abff;
    display: block;
    font-size: 40px;
    font-weight: 700;
    width: 96%;
    height: 90px;
    border-top: 5px solid #ccc;
    border-left: 10px solid #ccc;
    border-right: 10px solid #ccc;
    border-bottom: 5px solid #ccc;
    box-shadow: 2px 2px 10px #ccc;
    background: #f3f5f8;
    position: relative;
    overflow: hidden;
  }
  .affiche_text {
    position: absolute;
    top: 0;
    left: 100%;
    line-height: 80px;
    display: block;
    word-break: keep-all;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .RxData{
    position: absolute;
    top: 20px;
    right: 40px;
  }
  .dis_top,.dis_bottoom{
    padding: 10px 20px;
    background: #fff;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 10px #919191;
  }
  .dis_top{
    position: relative;
    min-height: 550px;
  }
  .dis_bottoom{
    display: flex;
    flex-direction: row;
    min-height: 200px;
    margin-top: 30px;
  }
</style>
