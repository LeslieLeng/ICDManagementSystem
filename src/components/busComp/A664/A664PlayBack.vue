<template>
  <div style="padding:30px">
    <div style="display: flex;flex-direction: row">
      <div class="back_file">
        <h3 style=" margin: 10px 0 10px 10px;">文件</h3>
        <div style="width:260px;margin: 10px auto">
          选择：
          <el-input style="width: 180px"
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
          </el-input>
        </div>
        <div class="back_tree">
          <el-tree
            class="filter-tree"
            :highlight-current="true"
            :data="fileData"
            default-expand-all
            @node-click="getFileName"
            :filter-node-method="filterNode"
            ref="tree2">
          </el-tree>
        </div>
      </div>
      <div class="monitor_top">
        <div style="padding:25px">
          <div style="text-align:left;padding: 20px">
            <label style="margin-left: 20px">文件名：</label>
            <span style="margin-left: 20px">{{fileName}}</span>
            <label style="margin-left: 55%">操作：</label>
            <el-popover
              placement="top"
              width="160"
              v-model="delVisible">
              <p>你确定要删除这个回放文件吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="delVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteFile">确定</el-button>
              </div>
              <el-button style="margin-left: 20px" slot="reference" size="small" type="danger" :disabled="isDel">删除</el-button>
            </el-popover>
          </div>
          <el-table :data="monitorData"
                    v-loading="loading"
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
            <el-table-column align="center" prop="MagLength" label="报文长度">
              <template slot-scope="scope">
                <label>{{scope.row.TeleLength}}</label>
              </template>
            </el-table-column>
          </el-table>
        </div>


      </div>
    </div>

    <!-----------------------------------数据详情----------------------------------->
    <div class="monitor_bottom">
      <div class="back_left">
        <h3>原始数据</h3>
        <div class="left_Container">
          <el-scrollbar style="height: 100%">
            <ul>
              <li class="back_title" style="width: 60px">#</li>
              <li class="back_title">0</li>
              <li class="back_title">1</li>
              <li class="back_title">2</li>
              <li class="back_title">3</li>
              <li class="back_title">4</li>
              <li class="back_title">5</li>
              <li class="back_title">6</li>
              <li class="back_title">7</li>
              <li class="back_title">8</li>
              <li class="back_title">9</li>
              <li class="back_title">A</li>
              <li class="back_title">B</li>
              <li class="back_title">C</li>
              <li class="back_title">D</li>
              <li class="back_title">E</li>
              <li class="back_title">F</li>
            </ul>
            <ul v-for="column in dataCoulmn">
              <li class="back_title" style="width: 60px">{{column.title}}</li>
              <li class="piece"  v-for=" row in (column.dataRow)">
              <span>
                {{row}}
              </span>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
      <div class="back_right">
        <h3>AFDX帧</h3>
        <div class="right_Container">
          <el-scrollbar style="height: 100%">
          <el-tree class="treeStyle" :data="AFDXTreeData" @node-click="AFDXClick"></el-tree>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    name: "A664Monitor",
    data() {
      return {
        ajaxTime:'',
        filterText:'',
        fileName: '',
        monitorData: [],
        originalData: [],
        dataCoulmn: [],
        AFDXTreeData: [],
        fileData: [
        ],
        loading: false,
        FileId:'',
        isDel:true,
        delVisible:false
      }
    },
    mounted() {
      // this.getTableData()
      this.getScroll()
      this.getFileList()
    },
    created(){
      this.ajaxTime = new Date().getTime()
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      },
      '$route':'getFileList'
    },
    methods: {
      // 删除文件
      deleteFile(){
        this.axios.post('/a664playbackdrop',{
          Id:this.FileId
        }).then((res)=>{
          // console.log(res)
        if(res.data.success=='删除成功'){
          this.delVisible = false
          this.isDel = true
          this.monitorData = []
          this.originalData = []
          this.dataCoulmn = []
          this.AFDXTreeData = []
          this.fileName='',
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getFileList()
        }else {
          this.$message.error('服务器错误');
        }
        }).catch((err)=>{
          this.$message.error('服务器错误');
        })
      },
      //获取文件
      getFileList(){
        this.axios.post('/a664playbackname',{
        }).then((res)=>{
          this.fileData=[{
            label: 'A664回放文件',
            id:'all',
            children: res.data
          }]
        }).catch((err)=>{

        })
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
        })
      },
      addTop() {
        var that = this
        var index = that.monitorData[0].Index
        console.log(index+'_向上一百条')
        this.axios.post('/a664playbackdata',{
          Id:this.FileId,
          Index:index,
          State:'Up'
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
        console.log(index+'_向下一百条')
        this.axios.post('/a664playbackdata',{
          Id:this.FileId,
          Index:index,
          State:'Down'
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
      },

      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getFileName(data){
        if(data.id=='all'){return false}
        this.FileId = data.id
        this.loading=true
        this.axios.post('/a664playbackdata',{
          Id:this.FileId,
          Index:1,
          State:'Start'
        }).then((res)=>{
          console.log(res);
          this.monitorData=res.data
          this.fileName=data.label
          this.isDel = false
          this.loading = false
        }).catch((err)=>{

        })
      },
      /*------------------------数据详情------------------------*/
      clickRow(row) {
        let that = this
        this.axios.post('/a664playbackdetailed',{
          Id:this.FileId,
          Index:row.Index
        }).then((res)=>{
          console.log(res)
          that.AFDXTreeData = res.data.framedata
        }).catch((err)=>{
          console.log(err)
        })

        this.originalData = row.data
        this.getOriginalData()
      },
      getOriginalData() {
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
        console.log(row)
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
    }
  }
</script>

<style scoped>
  .bgkShow{background: #C0FF3E;}
  .back_file{
    padding: 20px 40px;
    margin-right: 20px;
    background: #fff;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 10px #919191;
  }
  /*树*/
  .treeStyle {
    background: transparent;
  }

  /*数据详情*/
  .back_title {
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
    /*background: sandybrown;*/
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

  .back_left, .back_right {
    padding: 10px 20px;
    flex: 1;
    background: #bdd7ee;
    border-radius: 5px;
  }

  .back_left {
    margin-right: 20px;
  }
  .monitor_top {
    flex: 1;
    background: #fff;
    height: 400px;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 10px #919191;
    text-align: left;
    overflow: hidden;
  }

  .monitor_bottom {
    margin-top: 30px;
    background: #fff;
    height: 370px;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 10px #919191;
    text-align: left;
    display: flex;
    padding: 20px;
  }
  .back_tree{
    margin: 10px auto;
    height: 220px;
    overflow-y: scroll;
    border: 1px solid #666;
    padding: 10px;
  }
</style>
<style>
  .el-scrollbar__wrap {
    margin-bottom: 0 !important;
    overflow-x: hidden
  }
</style>
