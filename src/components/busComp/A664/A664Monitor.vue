<template>
  <div style="padding:30px">
    <!-----------------------------------数据列表----------------------------------->
    <div class="monitor_top">
      <div class="right-nav">
        <button @click="handleTab(0)">数据</button>
        <button @click="handleTab(1)">统计</button>
      </div>
      <!--数据表格-->
      <div v-show="tabs === 0">
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
              <el-input style="width: 200px" v-model="fileName" size="small" placeholder="请输入文件名" clearable></el-input>
              <div style="text-align: right; margin: 20px">
                <el-button size="mini" type="text" @click="saveData = false">取消</el-button>
                <el-button type="primary" size="mini" @click="savePlayBack">保存</el-button>
              </div>
              <el-button type="primary" :disabled="isSave" size="small" icon="el-icon-upload" slot="reference">储存
              </el-button>
            </el-popover>
          </div>
          <!---------------------------------监听数据列表----------------------------------->
          <div style="padding:25px">
            <el-table :data="monitorData"
                      id="table"
                      height="275"
                      border
                      @row-click="clickRow"
                      :header-cell-style="{background:'#74bbd5',color:'#fff'}"
                      :highlight-current-row=true style="width: 99%">
              <el-table-column align="center" prop="Index" label="序号" width="80">
                <template slot-scope="scope">
                  <label>{{scope.row.Index}}</label>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="Timestamp" label="时间" width="180">
                <template slot-scope="scope">
                  <label>{{scope.row.Timestamp}}</label>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="SrcMAC" label="源MAC" min-width="180">
                <template slot-scope="scope">
                  <label>{{scope.row.SrcMAC}}</label>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="SrcPort" label="源地址端口" min-width="180">
                <template slot-scope="scope">
                  <label>{{scope.row.SrcPort}}</label>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="DstMAC" label="目的MAC" min-width="180">
                <template slot-scope="scope">
                  <label>{{scope.row.DstMAC}}</label>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="DstPort" label="目的地址端口" min-width="180">
                <template slot-scope="scope">
                  <label>{{scope.row.DstPort}}</label>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="ViltualLink" label="虚拟链路">
                <template slot-scope="scope">
                  <label>{{scope.row.ViltualLink}}</label>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="TeleLength" label="报文长度">
                <template slot-scope="scope">
                  <label>{{scope.row.TeleLength}} byets</label>
                </template>
              </el-table-column>
            </el-table>
          </div>

        </div>
      </div>
      <!--数据统计-->
      <div v-show="tabs === 1">
        <div style="padding: 20px;position: relative">
          <div class="time">
            <label>开始时间：</label>
            <div>{{startTime}}</div>
            <label>结束时间：</label>
            <div>{{stopTime}}</div>
          </div>
          <el-tabs style="height: 300px" type="border-card" tab-position="left">
            <el-tab-pane label="NETwork">
              <div class="NETwork">
                <div class="count">
                  <div>
                    <label>Data Rate(KB/S) :</label>
                    <span>{{dataRate}}</span>
                  </div>
                  <div style="margin-top: 10px;">
                    <label>Frame Rate(Hz) :</label>
                    <span>{{frameRate}}</span>
                  </div>
                  <div style="margin-top: 10px;">
                    <label style="display: inline-block;float: left">Frame Count:</label>
                    <div class="frame">
                      <ul>
                        <li style="margin-top: 10px">
                          <label>64-byte:</label>
                          <span>{{frameCount.stage1}}</span>
                        </li>
                        <li>
                          <label>65 to 127:</label>
                          <span>{{frameCount.stage2}}</span>
                        </li>
                        <li>
                          <label>128 to 255:</label>
                          <span>{{frameCount.stage3}}</span>
                        </li>
                        <li>
                          <label>256 to 551:</label>
                          <span>{{frameCount.stage4}}</span>
                        </li>
                        <li>
                          <label>512 to 1023:</label>
                          <span>{{frameCount.stage5}}</span>
                        </li>
                        <li>
                          <label>1024:</label>
                          <span>{{frameCount.stage6}}</span>
                        </li>
                        <li style="margin-top: 15px">
                          <label style="font-weight: 700;">Total:</label>
                          <span style="font-weight: 700;">{{Total}}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="graph">
                  <div id="signal">
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="VL Activity">
              <div class="filter">
                <label>Filter VL ID:</label>
                <el-input style="width: 200px" v-model="search" placeholder="请输入VLID或Name!" size="small"
                          clearable></el-input>
              </div>
              <div style="padding:5px 20px">
                <el-table :data="VLtableData"
                          height="230"
                          border
                          :header-cell-style="{background:'#74bbd5',color:'#fff'}"
                          :highlight-current-row=true style="width: 100%">
                  <el-table-column prop="VLID" align="center" label="VLID" min-width="80">
                    <template slot-scope="scope">
                      <label>{{scope.row.VLID}}</label>
                    </template>
                  </el-table-column>
                  <el-table-column prop="VLName" align="center" label="Name" min-width="180">
                    <template slot-scope="scope">
                      <label>{{scope.row.VLName}}</label>
                    </template>
                  </el-table-column>
                  <el-table-column prop="MessageCount" label="Message Count(消息数量)" align="center" min-width="180">
                    <template slot-scope="scope">
                      <label>{{scope.row.MessageCount}}</label>
                    </template>
                  </el-table-column>
                  <el-table-column prop="AveragePeriod" label="Average Period" align="center" min-width="180">
                    <template slot-scope="scope">
                      <label>{{scope.row.AveragePeriod}}</label>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!--数据配置-->
      <div class="config">
        <el-button style="width: 100px" @click="settingDialogVisible= true" type="primary">设置</el-button>
        <el-dialog :visible.sync="settingDialogVisible" width="60%" align="center" title="设置" :before-close="handleClose">
          <div>
            <h5 style="text-align: left;color:#66B1FF">ICD选择</h5>
            <div style="display: flex;flex-direction: row">
              <div style="padding: 10px;border:1px solid #666;border-radius: 10px;flex: 2">
                <span style="margin-left: 10%">检索：</span>
                <el-input size="small" style="width: 200px"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
                <el-table size="mini" ref="exportDatabase" :data="ICDDatabase" :header-cell-style="{background:'#74bbd5',color:'#fff'}" @selection-change="handleSelectionChange"
                          :highlight-current-row=true style="width: 99%;margin-top: 10px" height="260">
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop='Name' label="ICD名称" align="center">
                  </el-table-column>
                  <el-table-column prop="Describe" label="描述" align="center">
                  </el-table-column>
                </el-table>
                <div style="text-align: center;margin-top: 10px">
                  <el-button size="small" type="primary" @click="checkBoxICD" >添加</el-button>
                </div>
              </div>
              <div style="margin: 10px;width: 5px;height:350px;background: cornflowerblue"></div>
              <div style="padding: 10px;border:1px solid #666;border-radius: 10px;flex: 3">
                <el-table size="mini" ref="exportDatabase" :data="settingDatabase" :header-cell-style="{background:'#74bbd5',color:'#fff'}" :highlight-current-row=true style="width: 99%;margin-top: 10px" height="300">
                  <el-table-column type="index"  width="70" align="center" label="序号">
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
    <!-----------------------------------数据详情----------------------------------->
    <div class="monitor_bottom">
      <div class="bottom_left">
        <h3>原始数据</h3>
        <div class="left_Container">
          <el-scrollbar style="height: 100%">
          <ul>
            <li class="data_title" style="width: 60px">#</li>
            <li class="data_title">0</li>
            <li class="data_title">1</li>
            <li class="data_title">2</li>
            <li class="data_title">3</li>
            <li class="data_title">4</li>
            <li class="data_title">5</li>
            <li class="data_title">6</li>
            <li class="data_title">7</li>
            <li class="data_title">8</li>
            <li class="data_title">9</li>
            <li class="data_title">A</li>
            <li class="data_title">B</li>
            <li class="data_title">C</li>
            <li class="data_title">D</li>
            <li class="data_title">E</li>
            <li class="data_title">F</li>
          </ul>
          <ul v-for="column in dataCoulmn">
            <li class="data_title" style="width: 60px">{{column.title}}</li>
            <li class="piece" v-for=" row in (column.dataRow)">
              <span  >
                {{row}}
              </span>
            </li>
          </ul>
          </el-scrollbar>
        </div>
      </div>
      <div class="bottom_right">
        <el-tabs v-model="activeName"  @tab-click="handleClick">
          <el-tab-pane label="AFDX帧" name="first">
            <div class="right_Container">
              <el-scrollbar style="height: 100%">
              <el-tree class="treeStyle" :expand-on-click-node="false" :data="AFDXTreeData"
                       @node-click="AFDXClick"></el-tree>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="用户数据" name="second">
            <div class="right_Container">
              <el-scrollbar style="height: 100%">
              <el-tree class="treeStyle" :expand-on-click-node="false" :data="XMLTreeData"
                       @node-click="XMLClick"></el-tree>
              </el-scrollbar>
            </div>
          </el-tab-pane>
        </el-tabs>


      </div>
    </div>
  </div>
</template>

<script>
  import $ from "jquery";

  export default {
    name: "a664monitor",
    data() {
      return {
        tabs: 0,
        saveData: false,
        fileName: '',
        isSave: true,
        isStart: false,
        monitorData: [],
        dataCoulmn: [],
        activeName: 'first',
        AFDXTreeData: [],
        XMLTreeData:[],
        socketFlag: '',
        ajaxTime:'',
        //----------------统计模块---------------------
        startTime: '2019-01-18 14:42:48 453.432.200',
        stopTime: '2019-01-18 14:43:34 453.482.100',
        dataRate: '28.80',
        frameRate: '450.00',
        frameCount: {
          stage1: 234,
          stage2: 456,
          stage3: 128,
          stage4: 665,
          stage5: 125,
          stage6: 334,
        },
        VLtableData: [],
        search: '',
        //----------------配置模块---------------------
        settingDialogVisible:false,
        multipleSelection:[],
        settingDatabase:[],
        ICDDatabase:[
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
    watch: {
      search(val, oldVal) {
        this.searchVL(val)
      },
      monitorData(cul) {
        if (this.isSave == true && cul.length < 200) {
          this.goToBottom()
        }
        if (this.isSave == true && cul.length > 200) {
          this.monitorData.shift()
        }
      }
    },
    computed: {
      Total() {
        return this.frameCount.stage1 + this.frameCount.stage2 + this.frameCount.stage3 + this.frameCount.stage4 + this.frameCount.stage5 + this.frameCount.stage6
      }
    },
    created(){
      this.ajaxTime = new Date().getTime()
    },
    methods: {

      // TAB切换
      handleTab(v) {
        var tabs = $('.right-nav').children()
        for (let i = 0; i < tabs.length; i++) {
          tabs[i].style.background = "#9ae9ff"
        }
        tabs[v].style.background = "#eedfd0"
        this.tabs = v
        if (v === 1) {
          this.drawSignal()
        }
      },
      // 动态加载数据
      goToBottom() {
        this.$nextTick(() => {
          var container = $('table:eq(1)').parent()
          var height = $('table:eq(1)').height()
          container.scrollTop(height - 50)
        })
      },
      goToCenter() {
        this.$nextTick(() => {
          var height = $('table:eq(1)').height()
          $('table:eq(1)').parent().animate({scrollTop:(height / 2) + 50},500)
        })
      },
      getScroll() {
        let that = this
        var div = $('table:eq(1)').parent()
        var tab = $('table:eq(1)')
        div.scroll(function () {
          if (that.isSave == true) {
            return false
          } else {
            if (that.monitorData.length < 200) {
              return false
            } else {
              var scroT = div.scrollTop()
              var scroH = tab.height()
              if (scroT == 0) {
                let dateTemp = new Date().getTime()
                if(dateTemp-that.ajaxTime>=1000){
                  that.addTop()
                }

              }
              if ((scroT + div.height()) == scroH) {
                let dateTemp = new Date().getTime()
                if(dateTemp-that.ajaxTime>=1000){
                  that.addDown()
                }
              }
            }
          }
        })
      },
      addTop() {
        var that = this
        var index = that.monitorData[0].Index
        // console.log(index+'_向上一百条')
        this.axios.post('/a664beforedata',{
          id:index
        }).then((res)=>{
          // console.log(res);
          if(res.data.length==0){
            this.$message({
              message:'数据加载完了！',
              type: 'success'
            });
            return false
          }
          for (let i = 0; i < res.data.length; i++) {
            that.monitorData.unshift(res.data[i])
            that.monitorData.pop()
          }
          that.goToCenter()
          this.ajaxTime =new Date().getTime()
        }).catch((err)=>{

        })


      },
      addDown() {
        var that = this
        var k = this.monitorData.length
        var index = this.monitorData[k-1].Index
        // console.log(index+'_向下一百条')
        // console.log(index)
        this.axios.post('/a664updowndata',{
          id:index
        }).then((res)=>{
          console.log(res);
          if(res.data.length==0){
            this.$message({
              message:'数据加载完了！',
              type: 'success'
            });
            return false
          }
          for (let i = 0; i < res.data.length; i++) {
              that.monitorData.push(res.data[i])
              that.monitorData.shift()
          }
          that.goToCenter()
          this.ajaxTime =new Date().getTime()
        }).catch((err)=>{

        })
        // for (let i = 0; i < 100; i++) {
        //   that.monitorData.push({Index: parseInt(i + 1) + parseInt(index)})
        //   that.monitorData.shift()
        // }
        // this.goToCenter()
      },

      // 开启websocket
      startWebsocket: function () {
        let that = this
        if (that.socketFlag) {
          that.socketFlag.close()
        }
        /*创建socket连接*/

        var socket = new WebSocket("ws://" + '172.16.3.56:8000' + "/a664analysis");
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
          console.log(jsondata)
          _this.monitorData.push(jsondata)


        };
      },
      //监听控制
      startMonitor() {
        this.monitorData = []
        // this.frameCount.stage1 = 0
        // this.frameCount.stage2 = 0
        // this.frameCount.stage3 = 0
        // this.frameCount.stage4 = 0
        // this.frameCount.stage5 = 0
        // this.frameCount.stage6 = 0
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
      // 选择单条数据
      clickRow(row) {
        let that = this
        this.axios.post('/a664detailed',{
          id:row.Index
        }).then((res)=>{
          // console.log(res.data.framedata)
          that.AFDXTreeData = res.data.framedata
        }).catch((err)=>{
          console.log(err)
        })

        this.originalData = row.data
        this.getTextOriginalData()
      },
      // AFDX解析
      getTextOriginalData() {
        var data = this.originalData
        var column = []
        for (let i = 0; i < data.length; i += 16) {
          var num = i.toString(16)
          var dlen = num.length
          while (dlen < 4) {
            num = "0" + num;
            dlen++;
          }
          var row = data.slice(i, i + 16)
          var obj = {title: '0x' + num, dataRow: row}
          column.push(obj)
        }
        this.dataCoulmn = column
      },

      // ICD解析
      AFDXClick(row) {
        var listLength=$('.piece').length
        $('.piece').removeClass("bgkShow");
        if(row.id == '2'){
          this.addBgkClass(0,listLength);
          this.goScroll(0)
        }
        if(row.id == '2_4'){
          this.addBgkClass(listLength-5,listLength-4);
          this.goScroll(listLength-5)
        }
        if(row.id == '2_5'){
          this.addBgkClass(listLength-4,listLength);
          this.goScroll(listLength-4)
        }
        if(row.id == '3'){
          this.addBgkClass(0,14);
          this.goScroll(0)
        }
        if(row.id == '3_1'){
          this.addBgkClass(0,6);
          this.goScroll(0)
        }
        if(row.id == '3_1_1' || row.id == '3_1_2'){
          this.addBgkClass(0,1);
          this.goScroll(0)
        }
        if(row.id == '3_1_3'){
          this.addBgkClass(1,4);
          this.goScroll(1)
        }
        if(row.id == '3_1_4'){
          this.addBgkClass(4,6);
          this.goScroll(4)
        }
        if(row.id == '3_2'){
          this.addBgkClass(6,12);
          this.goScroll(6)
        }
        if(row.id == '3_2_1'){
          this.addBgkClass(6,9);
          this.goScroll(6)
        }
        if(row.id == '3_2_2'){
          this.addBgkClass(9,11);
          this.goScroll(6)
        }
        if(row.id == '3_2_3' || row.id == '3_2_4'){
          this.addBgkClass(11,12);
          this.goScroll(11)
        }
        if(row.id == '3_3'){
          this.addBgkClass(12,14);
          this.goScroll(12)
        }
        if(row.id == '4'){
          this.addBgkClass(14,34);
          this.goScroll(14)
        }
        if(row.id == '4_1' || row.id == '4_2'){
          this.addBgkClass(14,15);
          this.goScroll(14)
        }
        if(row.id == '4_3'){
          this.addBgkClass(15,16);
          this.goScroll(15)
        }
        if(row.id == '4_4'){
          this.addBgkClass(16,18);
          this.goScroll(16)
        }
        if(row.id == '4_5'){
          this.addBgkClass(18,20);
          this.goScroll(18)
        }
        if(row.id == '4_6' || row.id == '4_6_1' || row.id == '4_6_2' || row.id == '4_6_3' || row.id == '4_6_4'){
          this.addBgkClass(20,22);
          this.goScroll(22)
        }
        if(row.id == '4_7'){
          this.addBgkClass(22,23);
          this.goScroll(22)
        }
        if(row.id == '4_8'){
          this.addBgkClass(23,24);
          this.goScroll(23)
        }
        if(row.id == '4_9'){
          this.addBgkClass(24,26);
          this.goScroll(24)
        }
        if(row.id == '4_10'){
          this.addBgkClass(26,30);
          this.goScroll(26)
        }
        if(row.id == '4_10_1'){
          this.addBgkClass(27,28);
          this.goScroll(27)
        }
        if(row.id == '4_10_2'){
          this.addBgkClass(28,29);
          this.goScroll(28)
        }
        if(row.id == '4_10_3'){
          this.addBgkClass(29,30);
          this.goScroll(29)
        }
        if(row.id == '4_11'){
          this.addBgkClass(30,34);
          this.goScroll(30)
        }
        if(row.id == '4_11_1'){
          this.addBgkClass(31,32);
          this.goScroll(31)
        }
        if(row.id == '4_11_2'){
          this.addBgkClass(32,33);
          this.goScroll(32)
        }
        if(row.id == '4_11_3'){
          this.addBgkClass(33,34);
          this.goScroll(33)
        }
        if(row.id == '5'){
          this.addBgkClass(34,42);
          this.goScroll(34)
        }
        if(row.id == '5_1'){
          this.addBgkClass(34,36);
          this.goScroll(34)
        }
        if(row.id == '5_2'){
          this.addBgkClass(36,38);
          this.goScroll(36)
        }
        if(row.id == '5_3'){
          this.addBgkClass(38,40);
          this.goScroll(38)
        }
        if(row.id == '5_4'){
          this.addBgkClass(40,42);
          this.goScroll(40)
        }
        if(row.id == '6'){
          this.addBgkClass(42,listLength-6);
          this.goScroll(42)
        }
        if(row.id == '6_1'){
          this.addBgkClass(42,46);
          this.goScroll(42)
        }
        if(row.id == '6_1_1'){
          this.addBgkClass(42,43);
          this.goScroll(42)
        }
        if(row.id == '6_1_2'){
          this.addBgkClass(43,44);
          this.goScroll(43)
        }
        if(row.id == '6_1_3'){
          this.addBgkClass(44,45);
          this.goScroll(44)
        }
        if(row.id == '6_1_4'){
          this.addBgkClass(45,46);
          this.goScroll(45)
        }
        if(row.id == '6_2'){
          this.addBgkClass(46,listLength-6);
          this.goScroll(46)
        }
      },
      addBgkClass(startIndex,endIndex){
        for(var i=startIndex;i<endIndex;i++){
          var span = $('.piece')[i]
         span.classList.add("bgkShow");
        }
      },
      goScroll(num){
        var a =parseInt(num/16)
        $('.left_Container div div').scrollTop(a*30)
      },
      XMLClick(row) {
        console.log(row)
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      // ---------------------------------统计模块-----------------------------
      searchVL(val) {
        this.getVLtableData()
        this.VLtableData = this.VLtableData.filter(item => (~item.VLID.indexOf(val)) || (~item.VLName.indexOf(val)))
      },
      getVLtableData() {
        this.VLtableData = [{
          VLID: '51520',
          VLName: 'GPM L1 toGPM L2 Ch0',
          MessageCount: '4400',
          AveragePeriod: '20.00ms'
        }, {
          VLID: '51524',
          VLName: 'GPM L1 toGPM L2 Ch4',
          MessageCount: '2200',
          AveragePeriod: '39.00ms'
        }, {
          VLID: '51534',
          VLName: 'GPM L1 toGPM L3 Ch0',
          MessageCount: '4400',
          AveragePeriod: '20.00ms'
        }, {
          VLID: '51540',
          VLName: 'GPM L2 toGPM L3 Ch0',
          MessageCount: '2200',
          AveragePeriod: '39.00ms'
        }, {
          VLID: '51544',
          VLName: 'GPM L3 toGPM L2 Ch4',
          MessageCount: '4400',
          AveragePeriod: '20.00ms'
        }]
      },
      drawSignal() {
        var echarts = require('echarts/lib/echarts.js')
        var signal = echarts.init(document.getElementById('signal'));
        var option = {
          title: {
            text: 'Frame Count',
            subtext: '总数：' + this.Total,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: ['64-Byte', '65-127', '128-255', '256-511', '512-1023', '1024']
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {
                show: true,
                type: ['pie', 'funnel'],
                option: {
                  funnel: {
                    x: '25%',
                    width: '50%',
                    funnelAlign: 'left',
                    max: 1548
                  }
                }
              },
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {value: this.frameCount.stage1, name: '64-Byte'},
                {value: this.frameCount.stage2, name: '65-127'},
                {value: this.frameCount.stage3, name: '128-255'},
                {value: this.frameCount.stage4, name: '256-511'},
                {value: this.frameCount.stage5, name: '512-1023'},
                {value: this.frameCount.stage6, name: '1024'},
              ]
            }
          ]
        };

        signal.setOption(option)
      },
      //-------------------------------配置模块---------------------------------
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      // 选中的
      handleSelectionChange(row){
        this.multipleSelection = val;
      },
      checkBoxICD(){
        console.log(this.multipleSelection)
        this.settingDatabase = [{
          id:1,
          ICDName: 'A429ICD',
          ChannelOption: [{channel: 'A429通道1'}, {channel: 'A429通道2'}, {channel: 'A429通道3'}, {channel: 'A429通道4'}, {channel: 'A429通道5'}],
        },{
          id:2,
          ICDName: 'A664ICD',
          ChannelOption: [{channel: 'A664通道1'}, {channel: 'A664通道2'}, {channel: 'A664通道3'}],
        }]
      },
      saveSetting(){
          console.log(this.settingDatabase)
      },
      //数据存储回放
      savePlayBack(){
        this.axios.post('/a664memeary',{
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
      this.getVLtableData()
      this.drawSignal()
      this.getScroll()
    },
  }
</script>

<style scoped>
  .bgkShow{background: #C0FF3E;}
  /*树*/
  .treeStyle {
    background: transparent;
  }

  /*数据详情*/
  .data_title {
    color: #666;
    font-weight: 700;
  }

  .left_Container ul {
    text-align: center;
    height: 40px;
    line-height: 40px;
    min-width: 640px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .left_Container li {
    width: 36px;
    float: left;
  }

  .left_Container li span {
    text-align: center;
    color: rgba(14, 123, 204, 0.77);
  }

  .right_Container, .left_Container {
    padding: 20px;
    margin-top: 10px;
    height: 260px;
    background: #fff;
    box-shadow: inset 3px 3px 5px 3px rgba(101, 118, 122, 0.7);
  }

  .monitor_bottom h3 {
    color: rgba(14, 123, 204, 0.77);
  }

  .bottom_left{
    padding: 10px 20px;
    flex: 1;
    border-radius: 5px;
  }
  .bottom_right{
    flex: 1;
  }

  .bottom_left {
    background: #bdd7ee;
    margin-right: 20px;
  }

  /*数据类别*/
  .right-nav {
    width: 300px;
    background: #bdd7ee;
    height: 60px;
    border-bottom-right-radius: 60px;
    text-align: left;
    padding-left: 10px;
  }

  .RxData {
    text-align: right;
    margin: 10px 10% 10px 0;
    position: absolute;
    top: 15px;
    right: 0;
  }

  .config {
    position: absolute;
    right: 40px;
    top: -80px
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

  .monitor_top {
    min-width: 1250px;
    border: 1px solid #ccc;
    background: #fff;
    height: 400px;
    box-shadow: 2px 2px 10px #919191;
    text-align: left;
    position: relative;
  }

  .monitor_bottom {
    min-width: 1250px;
    border: 1px solid #ccc;
    margin-top: 30px;
    background: #fff;
    height: 370px;
    box-shadow: 2px 2px 10px #919191;
    text-align: left;
    display: flex;
    padding: 20px;
  }

  /*统计*/
  .NETwork {
    display: flex;
    flex-direction: row;
  }

  .count {
    flex: 1;
    padding: 0 30px;
  }

  .count div label {
    font-weight: 700;
  }

  .count div span {
    color: rgba(14, 123, 204, 0.77);
    font-weight: 700;
  }

  .graph {
    flex: 1;
  }

  .time {
    position: absolute;
    top: -35px;
    left: 280px;
  }

  .time div {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    background: #ccc;
    padding: 0 10px;
    box-shadow: 2px 2px 1px #666666 inset;
  }

  .time label {
    margin-left: 60px;
    font-weight: 700;
  }

  .frame {
    float: right;
    display: inline-block;
    margin-top: -90px;
    padding-left: 10px;
    height: 280px;
    width: 250px;
    border-radius: 10px;
    border: 1px solid #666;
    margin-right: 10%;
  }

  .frame ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .frame li + li {
    margin-top: 5px;
  }

  .frame li label {
    display: inline-block;
    width: 180px;
    text-align: left;
    font-weight: 100;
    color: rgba(14, 123, 204, 0.77);
  }

  .frame li span {
    font-weight: 100;
    color: #67c23a;
  }

  #signal {
    width: 500px;
    height: 280px;
    margin: 0 auto;
  }

  .filter {
    margin-left: 50px;
  }

  .filter label {
    font-weight: 700;
    color: rgba(14, 123, 204, 0.77);
    margin-right: 30px;
  }
</style>
<style>
  .el-scrollbar__wrap {
    overflow-x: hidden;
    margin-bottom: 0 !important;
  }
</style>
