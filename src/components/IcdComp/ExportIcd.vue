<template>
  <div class="export-outer">
    <div class="export-top"></div>
    <div class="export-content">
      <div class="export-left">
        <div class="export-database">
          <template>
            <el-table
              size="mini"
              ref="exportDatabase"
              :data="exportDatabase"
              fit
              border
              tooltip-effect="dark"
              style="width: 100%;min-width:350px"
              max-height="700"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection">
              </el-table-column>
              <el-table-column type='index' label='序号' width="80px" align="center" >
              </el-table-column>
              <el-table-column prop='Name' label="ICD名称" align="center">
              </el-table-column>
              <el-table-column prop="Type" label="类型" width="150px" align="center">
              </el-table-column>
            </el-table>
          </template>
        </div>
        <!--<div class="AddToList">-->
          <!--<el-button size="medium" @click="addSelectICD" type="primary">添加至导出列表</el-button>-->
        <!--</div>-->
      </div>
      <div class="export-right">
        <div class="export-add">
          <template>
            <el-table size="medium" ref="AddFiles" :data="AddFiles" fit border tooltip-effect="dark" style="width: 99%;min-width:700px" max-height="600" @selection-change="handleSelectionChange">
              <!--<el-table-column type="selection">-->
              <!--</el-table-column>-->
              <el-table-column type='index' label='序号' width="80px" align="center">
              </el-table-column>
              <el-table-column prop='Name' label="ICD名称" align="center">
              </el-table-column>
              <el-table-column prop="Type" label="类型" width="150px" align="center">
              </el-table-column>
              <el-table-column prop='Format' label=导出文件格式 align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.Format" size="medium">
                    <el-option label="XML" value="XML"></el-option>
                    <!--<el-option label="DOC" value="DOC"></el-option>-->
                    <!--<el-option label="XLS" value="XLS"></el-option>-->
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="More" label="模块" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.Module"  size="medium">
                    <el-option label="615模板" value="615模板"></el-option>
                    <!--<el-option label="A664" value="A664"></el-option>-->
                    <!--<el-option label="1553B" value="1553B"></el-option>-->
                  </el-select>
                </template>
              </el-table-column>
              <!--<el-table-column label="操作" align="center">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-button type='danger' size="mini" @click="deleteIcdFile(scope.$index, AddFiles)">移除</el-button>-->
                <!--</template>-->
              <!--</el-table-column>-->
            </el-table>
          </template>
        </div>
        <div class="Add-Button">
          <div class="icon-confirm">
            <el-button type="primary" size="medium" @click="exportOne">单独导出</el-button>
            <el-button type="primary" size="medium" @click="exportMore">合并导出</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        exportDatabase: [
        ],
        AddFiles: [
        ],
        // multipleSelection: []
      }
    },
    methods: {
      getAllMessage(){
        let that =this
        this.axios.post('/getAllMessage', {
        }).then((result) => {
          that.exportDatabase = result.data.message
          console.log(result)
        }).catch((err) => {
          console.log(err)
        })
      },
      // addSelectICD() {
      //   this.AddFiles = this.multipleSelection
      // },
      exportOne(){
        console.log(this.AddFiles)
        // this.axios.post('', {
        //
        // }).then((result) => {
        //   console.log(result)
        //   window.open('/');
        // }).catch((err) => {
        //   console.log(err)
        // })
      },
      exportMore(){
        console.log(this.AddFiles)
        // this.axios.post('', {
        //
        // }).then((result) => {
        //   console.log(result)
        //   window.open('/');
        // }).catch((err) => {
        //   console.log(err)
        // })
      },
      handleSelectionChange(val) {
        this.AddFiles = val;

      },
      // deleteIcdFile(index,rows) {
      //   rows.splice(index, 1);
      // }
    },
    mounted() {
      this.getAllMessage()
    }
  }
</script>
<style scoped>
  .export-outer {
    height: 100%;
    display: flex;
    flex-flow: column;
  }

  .export-top {
    height: 50px;
    background-color: gainsboro;
    clear: both;
  }

  .export-content {
    display: flex;
    flex-flow: row;
    margin-top: 10px;
    min-height: 650px;
    justify-content: space-around;
  }

  .export-left {
    display: flex;
    flex: 1;
    flex-flow: column;
    /* background-color: lightskyblue; */
    padding: 15px;
  }

  .AddToList {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon-addtolist {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .export-database {
    background-color: whitesmoke;
    width: 100%;
    border-radius: 25px;
    min-height: 450px;
  }

  .export-right {
    display: flex;
    flex: 2;
    flex-flow: column;
    /* background-color: lightskyblue; */
    padding: 15px;
    border-left: 2px solid lightgrey;
  }

  .export-add {
    width: 100%;
    border-radius: 25px;
    min-height: 350px;
  }

  .Add-Button {
    height: 200px;
    background-color: whitesmoke;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }

  .icon-add {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1
  }

  .icon-confirm {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
</style>
<style>
  .el-scrollbar__wrap {
    overflow-x: hidden;
    margin-bottom: 0 !important;
  }
</style>


