<template>
  <div id="format">
    <div style="padding: 30px;position: relative">
      <div class="a664_top">
        <div class="right-nav">
          <button @click="handleTab(0)">数据</button>
          <button @click="handleTab(1)">统计</button>
        </div>
        <!---------------------------数据------------------------->
        <div v-show="isShow === 0">
          <div>
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
                <el-input style="width: 200px" v-model="fileName" size="small" placeholder="请输入文件名"
                          clearable></el-input>
                <div style="text-align: right; margin: 20px">
                  <el-button size="mini" type="text" @click="saveData = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="savePlayBack">保存</el-button>
                </div>
                <el-button type="primary" :disabled="isSave" size="small" icon="el-icon-upload" slot="reference">储存
                </el-button>
              </el-popover>
            </div>
            <div style="padding:25px">
              <el-table :data="monitorData"
                        height="275"
                        border
                        @row-click="clickRow"
                        :header-cell-style="{background:'#74bbd5',color:'#fff'}"
                        :highlight-current-row=true style="width: 99%">
                <el-table-column align="center" prop="Channel" label="接收通道" width="150">
                  <template slot-scope="scope">
                    <label>{{scope.row.Channel}}</label>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="Time" label="时间" width="220">
                  <template slot-scope="scope">
                    <label>{{scope.row.Time}}</label>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="Label" label="标签" width="100">
                  <template slot-scope="scope">
                    <label>{{scope.row.Label}}</label>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="real_data_16" label="数据（16进制）" width="130">
                  <template slot-scope="scope">
                    <label>{{scope.row.Real_data_16}}</label>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="real_data_2" label="数据（2进制）" min-width="150">
                  <template slot-scope="scope">
                    <label>{{scope.row.Real_data_2}}</label>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="Count" label="标签计数" width="150">
                  <template slot-scope="scope">
                    <label>{{scope.row.Channel_num}}</label>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="Error_num" label="错误计数" width="150">
                  <template slot-scope="scope">
                    <label>{{scope.row.Error_num}}</label>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="Cycle" label="周期" width="150">
                  <template slot-scope="scope">
                    <label>{{scope.row.Cycle}}</label>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="padding-left: 50px">
              <label>总数：</label>
              <span style="margin-right: 20%">{{TotalCount}}</span>
              <label>错误：</label>
              <span style="margin-right: 20%">{{AllErrorCount}}</span>
              <label>错误率：</label>
              <span>{{ErrRate}}</span>
            </div>
          </div>
        </div>
        <!--------------------------------统计--------------------------->
        <div v-show="isShow === 1">
          <div>
            <div class="chart_content">
              <div style="flex: 1" id="myChart">
              </div>
              <div style="flex: 1" id="err">
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="peizhi">
        <!--通道配置-->
        <el-button style="width: 100px" @click="settingDialogVisible= true" type="primary">设置</el-button>
        <el-dialog :visible.sync="settingDialogVisible" width="60%" align="center" title="设置"
                   :before-close="handleClose">
          <div>
            <h5 style="text-align: left;color:#66B1FF">ICD选择</h5>
            <div style="display: flex;flex-direction: row">
              <div style="padding: 10px;border:1px solid #666;border-radius: 10px;flex: 2">
                <span style="margin-left: 10%">检索：</span>
                <el-input size="small" style="width: 200px"><i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-table size="mini" ref="exportDatabase" :data="ICDDatabase"
                          :header-cell-style="{background:'#74bbd5',color:'#fff'}"
                          @selection-change="handleSelectionChange"
                          :highlight-current-row=true style="width: 99%;margin-top: 10px" height="260">
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop='Name' label="ICD名称" align="center">
                  </el-table-column>
                  <el-table-column prop="Describe" label="描述" align="center">
                  </el-table-column>
                </el-table>
                <div style="text-align: center;margin-top: 10px">
                  <el-button size="small" type="primary" @click="checkBoxICD">添加</el-button>
                </div>
              </div>
              <div style="margin: 10px;width: 5px;height:350px;background: cornflowerblue"></div>
              <div style="padding: 10px;border:1px solid #666;border-radius: 10px;flex: 3">
                <el-table size="mini" ref="exportDatabase" :data="settingDatabase"
                          :header-cell-style="{background:'#74bbd5',color:'#fff'}" :highlight-current-row=true
                          style="width: 99%;margin-top: 10px" height="300">
                  <el-table-column type="index" width="70" align="center" label="序号">
                  </el-table-column>
                  <el-table-column prop='ICDName' label="ICD名称" align="center">
                  </el-table-column>
                  <el-table-column prop="ICDChannel" label="通道选择" align="center">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.ICDChannel" placeholder="请选择">
                        <el-option v-for="item in scope.row.ChannelOption" :key="item.channel" :label="item.channel"
                                   :value="item.channel"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

          </div>
          <span slot="footer" class="dialog-footer">
    <el-button @click="settingDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveSetting">确 定</el-button>
  </span>
        </el-dialog>
      </div>
    </div>
    <div style="padding: 0 30px 10px;min-width: 1150px">
      <el-tabs type="border-card" @tab-click="tabsclick">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-news"></i>源码</span>
          <!-------------------------------源码------------------------------->
          <div>
            <el-row class="content">
              <el-col :span="14" style="min-width: 550px" class="c_left">
                <h3>Test Value</h3>
                <div class="c_left_head">
                  <ul style="margin-left: 40px">
                    <li> 通道:<span v-if="a429_data.Channel!=''" class="soundCode">{{a429_data.Channel}}</span></li>
                    <li> Label: <span v-if="a429_data.Label!=''" class="soundCode">{{a429_data.Label}}</span></li>
                    <li> Value: <span v-if="a429_data.Value!=''" class="soundCode">{{a429_data.Value}}</span></li>
                  </ul>

                </div>
                <div class="left_table">
                  <h4>当前位置——源码</h4>
                  <table>
                    <tr>
                      <td>LL</td>
                      <td>LLL</td>
                      <td>LLL</td>
                      <td>SDI</td>
                      <td>DDD</td>
                      <td>DDDD</td>
                      <td>DDDD</td>
                      <td>DDDD</td>
                      <td>DDDD</td>
                      <td>SSM</td>
                      <td>P</td>
                    </tr>
                    <tr id="highlight">
                      <td>{{sCode.L1}}</td>
                      <td>{{sCode.L2}}</td>
                      <td>{{sCode.L3}}</td>
                      <td>{{sCode.SDI}}</td>
                      <td>{{sCode.D1}}</td>
                      <td>{{sCode.D2}}</td>
                      <td>{{sCode.D3}}</td>
                      <td>{{sCode.D4}}</td>
                      <td>{{sCode.D5}}</td>
                      <td>{{sCode.SSM}}</td>
                      <td>{{sCode.P}}</td>
                    </tr>
                  </table>
                  <!--<div style="margin-top: 30px"><span v-if="a429_data.Warning==1" style="color:#E6A23C">异常状态：       自定义异常告警</span></div>-->
                  <div style="margin-top: 30px"><span v-if="a429_data.Error==1" style="color: #F56C6C">错误状态：       奇偶校验错误/编码错误</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="10" class="c_right">
                <h3>Message</h3>
                <div class="right_tree">
                  <el-scrollbar style="height: 100%">
                    <div class="treeStyle">
                      <el-tree :data="XMLTreeData" :expand-on-click-node="false" :highlight-current="true"
                               :default-expand-all="true" @node-click="XMLClick"></el-tree>
                    </div>
                  </el-scrollbar>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-bell"></i>快照</span>
          <!-------------------------------快照--------------------------->
          <div class="snapContent">
            <div class="list">
              <div style="flex: 1;margin-top: 50px;text-align: center">
                <el-button type="primary" @click="getSnapShoot">刷新快照</el-button>
              </div>

              <div class="snapTab" style="flex: 5">
                <el-scrollbar style="height: 100%">
                <ul>
                  <li v-for="(item,index) in snapData">
                    <el-row>
                      <div style="float: left">
                        <span class="blue"><i style="width: 80px">接收通道：</i>{{item.Aisle}}</span><span
                        class="blue"><i style="margin-left: 20px">消息序列：</i>{{index}}</span>
                      </div>
                    </el-row>
                    <el-row style="margin-top: 10px">
                      <div style="float: left">
                  <span><i
                    style="width: 80px">时间：</i><i>{{item.Time}}</i></span><span style="margin-left: 20px"><i>Label：</i><i>{{item.Label}}</i></span>
                        <i style="margin-left: 20px;font-weight: 700;color:#75e689 ">{{item.RealData}}</i>
                      </div>
                      <div style="float: right;">
                        <span class="danger" v-if="item.Error==1"><i>错误状态：</i><i
                          style="width: 170px">奇偶校验错误/编码错误</i></span>
                      </div>
                    </el-row>
                  </li>
                </ul>
                </el-scrollbar>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    name: "a429Monitor",
    data() {
      return {
        // 统计
        count: {},
        errCount: {},
        // 数据
        isShow: 0,
        saveData: false,
        fileName: '',
        isSave: true,
        isStart: false,
        monitorData: [],
        TotalCount: 0,
        AllErrorCount: 0,
        socketFlag: '',
        //源码
        sCode: {
          L1: '',
          L2: '',
          L3: '',
          SDI: '',
          D1: '',
          D2: '',
          D3: '',
          D4: '',
          D5: '',
          SSM: '',
          P: '',
        },
        a429_data: {
          Channel: '',
          Label: '',
          Value: '',
          Error: ''
        },
        XMLTreeData: [],
        // 快照
        snapData: [],
        //----------------配置模块---------------------
        settingDialogVisible: false,
        multipleSelection: [],
        settingDatabase: [],
        ICDDatabase: [
          {Name: 'ICD001', Describe: 'abcd123'},
          {Name: 'ICD002', Describe: 'abcd123'},
          {Name: 'ICD003', Describe: 'abcd123'},
          {Name: 'ICD004', Describe: 'abcd123'},
          {Name: 'ICD005', Describe: 'abcd123'},
          {Name: 'ICD006', Describe: 'abcd123'},
          {Name: 'ICD007', Describe: 'abcd123'},
          {Name: 'ICD008', Describe: 'abcd123'},
          {Name: 'ICD009', Describe: 'abcd123'},
          {Name: 'ICD0011', Describe: 'abcd123'},
          {Name: 'ICD0012', Describe: 'abcd123'},
          {Name: 'ICD0013', Describe: 'abcd123'},
          {Name: 'ICD0014', Describe: 'abcd123'},
          {Name: 'ICD0015', Describe: 'abcd123'},
          {Name: 'ICD0016', Describe: 'abcd123'},
          {Name: 'ICD0017', Describe: 'abcd123'},
        ]
      }
    },
    computed: {
      ErrRate() {
        let rate = 0.0;
        if (this.TotalCount != 0) {
          rate = (this.AllErrorCount / this.TotalCount) * 100;
        }
        return rate.toFixed(2) + '%';
      },

    },
    methods: {
      //统计
      // 错误统计
      statistics() {
        this.TotalCount = 0
        this.AllErrorCount = 0
        var len = this.monitorData.length;
        for (let i = 0; i < len; i++) {
          this.TotalCount += parseInt(this.monitorData[i].Channel_num)
          this.AllErrorCount += parseInt(this.monitorData[i].Error_num)
        }
      },

      drawErr() {
        var str = this.errCount
        var keys = []
        var key_values = []
        for (var k in str) {
          keys.push(k)
          var t = {value: str[k], name: k}
          key_values.push(t)
        }
        var echarts = require('echarts/lib/echarts.js')
        var err = echarts.init(document.getElementById('err'));
        var option = {
          title: {
            text: '错误统计',
            subtext: 'A429',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: keys
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: key_values,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        err.setOption(option)
      },
      drawMychart() {
        var str = this.count
        var keys = []
        var key_values = []
        for (var k in str) {
          keys.push(k)
          var t = {value: str[k], name: k}
          key_values.push(t)
        }
        var echarts = require('echarts/lib/echarts.js')
        var myChart = echarts.init(document.getElementById('myChart'));
        // 指定图表的配置项和数据
        var option = {
          color: ['#6dd8da', '#b6a2de', '#58afed'], //环形图每块的颜色
          title: {
            text: '接收数据统计',
            subtext: 'A429',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: keys
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: key_values,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      },
      handleTab(v) {
        var tabs = $('.right-nav').children()
        for (let i = 0; i < tabs.length; i++) {
          tabs[i].style.background = "#9ae9ff"
        }
        tabs[v].style.background = "#eedfd0"
        this.isShow = v
        if (v === 1) {
          this.drawErr()
          this.drawMychart()
        }
      },
      // 开启websocket
      startWebsocket: function () {
        let that = this
        if (that.socketFlag) {
          that.socketFlag.close()
        }
        /*创建socket连接*/

        var socket = new WebSocket("ws://" + '172.16.3.56:8000' + "/a429analysis");
        console.log(socket)
        if (socket.readyState == WebSocket.OPEN) socket.onopen();
        that.socketFlag = socket;
      },
      sendWebsocket: function (Obj) {
        let that = this
        that.socketFlag.onopen = function () {
          console.log('WebSocket open');//成功连接上Websocket
          that.socketFlag.send(Obj);
        };
      },
      echoWebsocket: function () {
        var _this = this;
        _this.socketFlag.onmessage = function (e) {
          var jsondata = JSON.parse(e.data)
          // _this.monitorData.push(jsondata)
          _this.getMontiorTable(jsondata)

        };
      },
      getMontiorTable(jsondata) {
        console.log(jsondata)
        let that = this
        var flag = true
        for (let i = 0; i < this.monitorData.length; i++) {
          if (that.monitorData[i].Channel == jsondata.Channel) {
            flag = false
            that.monitorData[i].Time = jsondata.Time
            that.monitorData[i].Label = jsondata.Label
            that.monitorData[i].Real_data_2 = jsondata.Real_data_2
            that.monitorData[i].Real_data_16 = jsondata.Real_data_16
            that.monitorData[i].Channel_num = jsondata.Channel_num
            that.monitorData[i].Error_num = jsondata.Error_num
            that.monitorData[i].Cycle = jsondata.Cycle
            that.monitorData[i].Error = jsondata.Error
            that.monitorData[i].Data = jsondata.Data
            var c = that.monitorData[i].Channel
            that.errCount[c] = jsondata.Error_num
            that.count[c] = jsondata.Channel_num
          }
        }
        if (flag) {
          this.monitorData.push(jsondata)
        }
        this.statistics()
      },
      //监听控制
      startMonitor() {
        this.monitorData = []
        console.log('开始监听')
        this.isStart = true
        this.isSave = true
        var item = {
          Option: 'start',
          // BusType: 'A664',
        }
        var obj = JSON.stringify(item)
        this.startWebsocket()
        this.sendWebsocket(obj)
        this.echoWebsocket()
      },
      stopMonitor() {
        console.log('停止监听')
        this.isStart = false
        this.isSave = false
        var item = {
          Option: 'stop',
          // BusType: 'A664'
        }
        var obj = JSON.stringify(item)
        try {
          for (let i = 0; i < 2; i++) {
            this.socketFlag.send(obj)
          }
        } catch (e) {
        }
        this.socketFlag = ''
      },
      clearMonitor() {
        console.log('清空数据')
        this.isSave = true
        this.monitorData = []
      },
      tabsclick(tab, event) {
        if(tab.index==1){
          this.getSnapShoot()
        }
      },
      // 选择单条数据
      clickRow(row) {
        this.a429_data.Channel = row.Channel
        this.a429_data.Label = row.Label
        this.a429_data.Value = row.Real_data_16
        this.a429_data.Error = row.Error
        this.getSoundCode(row.Data)
        this.getXMLTreeData(row.Data)
      },
      getXMLTreeData(d) {
        let that = this
        this.axios.post('/a429detailed',{
          Data:d
        }).then((res)=>{
          console.log(res.data)
          that.XMLTreeData =res.data.Data
        }).catch((err)=>{

        })
        // this.XMLTreeData = [{
        //   label: 'A429',
        //   type: 'A429',
        //   children: [{
        //     label: 'Label_0o201',
        //     type: 'Label'
        //   }, {
        //     label: 'SDI_00',
        //     type: 'SDI'
        //   }, {
        //     label: 'Data_0x24BF2',
        //     type: 'Data'
        //   }, {
        //     label: 'SSM_01',
        //     type: 'SSM'
        //   }, {
        //     label: 'Parity_1',
        //     type: 'Parity'
        //   }]
        // }]
      },
      getSoundCode(code) {
        this.sCode.L1 = code.slice(0, 2);
        this.sCode.L2 = code.slice(2, 5);
        this.sCode.L3 = code.slice(5, 8);
        this.sCode.SDI = code.slice(8, 10);
        this.sCode.D1 = code.slice(10, 14);
        this.sCode.D2 = code.slice(14, 18);
        this.sCode.D3 = code.slice(18, 22);
        this.sCode.D4 = code.slice(22, 26);
        this.sCode.D5 = code.slice(26, 29);
        this.sCode.SSM = code.slice(29, 31);
        this.sCode.P = code.slice(31, 32)
      },
      // 源码
      XMLClick(row) {
        // console.log(row)
        var td = document.getElementById('highlight').children;
        for (let i = 0; i < td.length; i++) {
          td[i].style.color = "#000";
        }
        if (row.type == 'Label') {
          td[0].style.color = "red";
          td[1].style.color = "red";
          td[2].style.color = "red";
        } else if (row.type == 'SDI') {
          td[3].style.color = "red";
        } else if (row.type == 'Data') {
          td[4].style.color = "red";
          td[5].style.color = "red";
          td[6].style.color = "red";
          td[7].style.color = "red";
          td[8].style.color = "red";
        } else if (row.type == 'SSM') {
          td[9].style.color = "red";
        } else if (row.type == 'Parity') {
          td[10].style.color = "red";
        }

      },
      //快照
      getSnapShoot() {
        this.snapData=[]
        this.axios.post('/a429snapshot',{
        }).then((res)=>{
          // console.log(res.data)
          this.snapData = res.data
        }).catch((err)=>{

        })
        // this.snapData = [{Channel: 'Rx_Node1', Time: new Date(), Labe1: '201', Data1: '0xF4582', Warning: 1, Error: 1}]
      },
      //-------------------------------配置模块---------------------------------
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      // 选中的
      handleSelectionChange(row) {
        this.multipleSelection = val;
      },
      checkBoxICD() {
        console.log(this.multipleSelection)
        this.settingDatabase = [{
          id: 1,
          ICDName: 'A429ICD',
          ChannelOption: [{channel: 'A429通道1'}, {channel: 'A429通道2'}, {channel: 'A429通道3'}, {channel: 'A429通道4'}, {channel: 'A429通道5'}],
        }, {
          id: 2,
          ICDName: 'A664ICD',
          ChannelOption: [{channel: 'A664通道1'}, {channel: 'A664通道2'}, {channel: 'A664通道3'}],
        }]
      },
      saveSetting() {
        console.log(this.settingDatabase)
      },
      //数据存储回放
      savePlayBack(){
        this.axios.post('/a429memeary',{
          FileName:this.fileName
        }).then((res)=>{
          if(res.data.success=='存储成功'){
            this.$message({
              message: '存储成功',
              type: 'success'
            });
            this.saveData = false
          }else if(res.data.success=='文件名已存在'){
            this.$message.error('文件名已存在');
          }else {
            this.$message.error('服务器错误');
          }
        }).catch((err)=>{

        })
      }
    },
    mounted() {
      this.drawErr()
      this.drawMychart()
      // this.defaulData()
    }

  }
</script>

<style scoped>
  /*快照*/
  .snapContent {
    background: #bdd7ee;
    border-radius: 5px;
  }

  .snapContent .list {
    height: 338px;
    display: flex;
    flex-direction: row;
  }

  .snapContent .list ul {
    list-style: none;
    padding: 0 20px;
  }

  .snapContent .snapTab {
    box-shadow: 5px 5px 5px #999 inset;
    background: #fff;
    margin:25px 40px;
    width: 84%;
    height: 290px;
  }

  .snapContent .snapTab li {
    border-bottom: 2px dashed #666;
    padding: 5px;
  }

  .snapContent .blue {
    color: #409EFF;
  }

  .snapContent .warning {
    color: #E6A23C;
  }

  .snapContent .danger {
    color: #F56C6C;
  }

  .tab span {
    margin-right: 20px;
  }

  .tab i {
    margin-right: 20px;
    display: inline-block;
  }

  /*源码*/
  .treeStyle {
    width: 90%;
    margin: 10px auto;

  }

  .tabs label, .tabs span {
    text-align: left;
    margin-top: 10px;
    width: 150px;
  }

  .tabs table {
    margin-top: 30px;

  }

  .tabs span {
    height: 18px;

  }

  .c_left h3 {
    text-align: left;
    margin-left: 40px;
    color: rgba(14, 123, 204, 0.77);
    margin-top: 10px;
  }

  .c_right h3 {
    text-align: left;
    margin-left: 40px;
    color: rgba(14, 123, 204, 0.77);
    margin-top: 10px;
  }

  .c_left_head {
    height: 36px;
    line-height: 36px;
  }

  .c_left_head li {
    margin-left: 30px;
    min-width: 100px;
  }

  .soundCode {
    display: inline-block;
    padding: 0px 10px;
    background: #fff;
    border: 1px solid #666;
  }

  .right_tree {
    margin: 20px 40px;
    height: 250px;
    background: #fff;
    overflow-y: auto;
    box-shadow: inset 3px 3px 5px 3px rgba(101, 118, 122, 0.7);
  }

  .left_table {
    margin: 20px 40px;
    height: 210px;
    background: #fff;
    overflow-y: auto;
    box-shadow: inset 3px 3px 5px 3px rgba(101, 118, 122, 0.7);
  }

  .left_table h4 {
    margin: 20px 30px;
    font-weight: 400;
    text-align: left;
    color: #2169f5;
  }

  .left_table div {
    text-align: left;
    margin-top: 5px;
    margin-left: 20px;
    font-weight: 400;
  }

  .content {
    background: #bdd7ee;
    border-radius: 5px;
  }

  .c_left table {
    width: 500px;
    margin-left: 20px;
  }

  .c_left td {
    width: 40px;
    margin-left: 10px;
  }

  .c_left_head ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .c_left_head li {
    float: left;
  }


  /*统计*/
  .chart_content {
    padding: 30px;
    display: flex;
    flex-direction: row;
  }

  #myChart, #err {
    width: 400px;
    height: 280px;
    margin: 0 auto;
  }

  /*数据*/
  .RxData {
    text-align: right;
    margin: 10px 10% 10px 0;
    position: absolute;
    top: 15px;
    right: 0;
  }

  .a664_top {
    min-width: 1250px;
    border: 1px solid #ccc;
    background: #fff;
    height: 420px;
    box-shadow: 2px 2px 10px #919191;
    text-align: left;
    position: relative;
  }

  .right-nav {
    width: 300px;
    background: #bdd7ee;
    height: 60px;
    border-bottom-right-radius: 60px;
    text-align: left;
    padding-left: 10px;
  }

  .right-nav button {
    width: 100px;
    height: 40px;
    margin-top: 10px;
    border-radius: 5px;
  }

  .right-nav button:first-child {
    background-color: #eedfd0;
  }

  .right-nav button + button {
    background: #9ae9ff;
    margin-left: 15px;

  }


  .left span {
    display: block;
    font-size: 24px;
    font-weight: 700;
    margin: 10px 0 20px 10px
  }


  .peizhi {
    position: absolute;
    right: 40px;
    top: -50px;
  }
</style>
<style>
  .el-scrollbar__wrap {
    margin-bottom: 0 !important;
    overflow-x: hidden
  }
</style>
