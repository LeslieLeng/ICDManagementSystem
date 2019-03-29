<template>
  <div class="cont">
    <div class="cont_left">
      <div class="top">
        <router-link tag="div" class="box box1" to="/editicd">
          <img src="../assets/images/circle.svg" class="box-img" >
          <div style="overflow:hidden;">
            <h4 style="float: left">ICD管理</h4>
            <i style=" float: right" class="el-icon-menu"></i>
          </div>
          <h2 >ICD Message</h2>
          <h6>ICD编辑，XML文件导入、导出</h6>
        </router-link>
        <router-link tag="div" class="box box2" to="/a664monitor">
          <img src="../assets/images/circle.svg" class="box-img" >
          <div style="overflow:hidden;">
            <h4 style="float: left">总线监控</h4>
            <i style=" float: right" class="el-icon-setting"></i>
          </div>
          <h2>Monitor</h2>
          <h6>A429总线、A664总线、离散量</h6>
        </router-link>
        <router-link tag="div" class="box box3" to="/simulate">
          <img src="../assets/images/circle.svg" class="box-img" >
          <div style="overflow:hidden;">
            <h4 style="float: left">总线仿真</h4>
            <i style=" float: right" class="el-icon-edit"></i>
          </div>
          <h2>Simulate</h2>
          <h6>自定义数据</h6>
        </router-link>
      </div>
      <div class="chart">
        <h3>最新ICD消息</h3>
        <div class="table" style="padding-top: 5px">
          <el-table :data="ICDMessage" :highlight-current-row="true"  :header-cell-style="tableHeaderColor" height="350" style="width: 99%;background: transparent ">
            <el-table-column  label="序号" type="index" width="50" align="center">
            </el-table-column>
            <el-table-column prop='Name' label="ICD名称" align="center">
            </el-table-column>
            <el-table-column type="expand" prop="Describe" label="描述" width="100">
              <template slot-scope="props">
                <el-form label-position="left" class="demo-table-expand">
                  <el-form-item label="描述:">
                    <span>{{ props.row.Describe}}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop='CreateMan' label="创建者" align="center">
            </el-table-column>
            <el-table-column prop='CreateTime' label="创建时间" align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="cont_right">
      <div style="border-bottom: 5px solid #71abff">
        <h3>当前消息</h3>
      </div>
      <div class="block">
        <el-timeline v-for="(item,index) in userMsg" :key="index">
          <el-timeline-item size="normal " color="#71ABFF" :timestamp="item.Time" placement="top">
            <el-card>
              <h4>{{item.Title}}</h4>
              <p>{{item.Describe}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'Home',
    data(){
      return{
        userMsg:[{
          Time:'2019/3/8 16:02',
          Title:'用户登录',
          Describe:'用户admin登录'
        },{
            Time:'2019/3/8 16:05',
            Title:'ICD操作',
            Describe:'用户admin新建ICD'
          },{
          Time:'2019/3/8 16:20',
          Title:'总线监控',
          Describe:'用户admin进行A429总线监控'
        }
        ],
        ICDMessage:[{
          Name:'Display control',
          Describe:'这是一条显示控制ICD消息',
          CreateMan:'admin',
          CreateTime:'2019/3/8 18:05',
        },{
          Name:'Operating',
          Describe:'这是一条操作ICD消息',
          CreateMan:'admin',
          CreateTime:'2019/3/9 09:35',
        },{
          Name:'Basic Parameter ',
          Describe:'这是一条基本参数ICD消息',
          CreateMan:'admin',
          CreateTime:'2019/3/9 12:07',
        },{
          Name:'State',
          Describe:'这是一条状态ICD消息',
          CreateMan:'admin',
          CreateTime:'2019/3/9 14:20',
        },{
          Name:'Operating',
          Describe:'这是一条操作ICD消息',
          CreateMan:'admin',
          CreateTime:'2019/3/10 11:25',
        },{
          Name:'Display control',
          Describe:'这是一条显示控制ICD消息',
          CreateMan:'admin',
          CreateTime:'2019/3/11 14:49',
        }]
      }
    },
    methods:{
      tableHeaderColor({row, column, rowIndex, columnIndex}) {
        if (rowIndex == 0) {
          return 'color:#047edf;font-size:14px;'
        } else {
          return ''
        }
      },
      Memory(){
        this.axios.post('/getdisksatate',{
        }).then((res)=>{
          console.log(res)
        }).catch((err)=>{

        })
      }
    },
    created() {
      this.Memory()
    }
  }
</script>
<style scoped>

  .cont_left .top{
    display: flex;
    flex-direction: row;
    padding: 30px;
  }
  .cont_left .top .box{
    cursor: pointer;
    color: #fff;
    padding: 20px;
    flex: 1;
    border-radius:5px;
    position: relative;
  }
  .cont_left .top .box .box-img{
    position: absolute;
    top: 0;
    right: 0;
    height: 170px;
  }
  .cont_left .top .box h2{
    margin-top: 20px;
    text-align: center;
    font: italic 2em Georgia, serif;
  }
  .cont_left .top .box h6{
    margin-top: 15px;
  }
  .box1{
    background: linear-gradient(to right, #ffbf96, #fe7096);
    margin-right: 30px;
  }
  .box2{
    background: linear-gradient(to right, #90caf9, #047edf 99%);
    margin-right: 30px;
  }
  .box3{
    background: linear-gradient(to right, #84d9d2, #07cdae);
  }
  .cont {
    padding: 40px;
    display: flex;
    flex-direction: row;
    /*background: linear-gradient(to top, #F3F5F8 0%, #9ff0db 20%, #72acff 50%, #9ff0db 80%, #F3F5F8 100%);*/
    background-image: url("../assets/images/map.png");
    background-size: 100% 100%;
  }

  .cont_right {
    flex: 1;
    height: 730px;
    background: rgba(255, 255, 255, 0.5);
    box-shadow: 2px 2px 10px #919191;
    padding: 30px;
  }

  .cont_left {
    flex: 4;
    margin-right: 40px;
  }

  .cont_left .top {
    height: 230px;
    background: rgba(255, 255, 255, 0.5);
    box-shadow: 2px 2px 10px #919191;
  }

  .cont_left .chart {
    padding: 20px 30px;
    margin-top: 40px;
    height: 460px;
    background: rgba(255, 255, 255, 0.5);
    box-shadow: 2px 2px 10px #919191;
  }
  .block{
    margin-top: 10px;
  }
</style>
<style>
  .table .el-table th{
    background: transparent !important;
  }
  .table .el-table tr{
    background: transparent !important;
  }
</style>


