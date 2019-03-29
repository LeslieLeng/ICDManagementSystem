<template>
  <div >
    <div class=" playback_row">
      <div style="padding: 30px 30px 0 30px">
        <div class="playback_left">
          <h2 style=" margin: 15px 10px 10px 30px;">文件</h2>
          <div style="width:300px;margin: 10px auto">
            选择：
            <el-input style="width: 200px"
                      placeholder="输入关键字进行过滤"
                      v-model="filterText">
            </el-input>
          </div>
          <div class="playback_tree">
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
      </div>
      <div style=" padding: 30px 30px 30px 0; flex: 1;min-width: 771px">
        <div class="playback_right">
          <h2 style="line-height: 60px;margin-left: 30px">数据</h2>
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
          <div style="margin: 0 30px">
            <el-table :data="monitorData"
                      v-loading="loading"
                      height="409"
                      border
                      :header-cell-style="{background:'#74bbd5',color:'#fff'}"
                      :highlight-current-row=true style="width: 99%">
              <el-table-column align="center" prop="Index" label="序号" width="60">
                <template slot-scope="scope">
                  <label>{{scope.row.Index}}</label>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="Channel" label="接收通道" width="150">
                <template slot-scope="scope">
                  <label>{{scope.row.Channel}}</label>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="Time" label="时间" width="200">
                <template slot-scope="scope">
                  <label>{{scope.row.Time}}</label>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="Label" label="标签" width="80">
                <template slot-scope="scope">
                  <label>{{scope.row.Label}}</label>
                </template>
              </el-table-column>
              <el-table-column prop="Real_data_16" align="center" label="数据（16进制）" min-width="200">
                <template slot-scope="scope">
                  <label>{{scope.row.Real_data_16}}</label>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="Real_data_2"  label="数据（2进制）" min-width="200">
                <template slot-scope="scope">
                  <label>{{scope.row.Real_data_2}}</label>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    name: "A429PlayBack",
    data() {
      return {
        fileName:'',
        ajaxTime:'',
        filterText: '',
        fileData: [

        ],
        monitorData: [],
        loading: false,
        FileId:'',
        isDel:true,
        delVisible:false
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      },
      '$route':'getFileList'
    },
    mounted() {
      this.getScroll()
      this.getFileList()
    },
    created(){
      this.ajaxTime = new Date().getTime()
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 获取回放数据数据
      getFileName(data){
        if(data.id=='all'){return false}
        this.FileId = data.id
        this.loading=true
        this.axios.post('/a429playbackdata',{
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
      // 获取回放数据树状目录
      getFileList(){
        this.axios.post('/a429playbackname',{
        }).then((res)=>{
          this.fileData=[{
            label: 'A664回放文件',
            id:'all',
            children: res.data
          }]
        }).catch((err)=>{

        })
      },
      // 删除回放数据数据
      deleteFile(){
        this.axios.post('/a429playbackdrop',{
          Id:this.FileId
        }).then((res)=>{
          // console.log(res)
          if(res.data.success=='删除成功'){
            this.delVisible = false
            this.isDel = true
            this.monitorData = []
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
        // console.log(index+'_向上一百条')
        this.axios.post('/a429playbackdata',{
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
        // console.log(index+'_向下一百条')
        this.axios.post('/a429playbackdata',{
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
    },
  }
</script>

<style scoped>
  .playback_row {
    display: flex;
    flex-direction: row;
  }

  .playback_left {
    background: #fff;
    height: 650px;
    min-width: 400px;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 10px #919191;
    text-align: left;
    overflow: hidden;
  }
  .playback_right {
    background: #fff;
    height: 650px;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 10px #919191;
  }
  .playback_tree{
    width: 300px;
    margin: 10px auto;
    height: 450px;
    overflow-y: scroll;
    border: 1px solid #666;
    padding: 10px;
  }

</style>

