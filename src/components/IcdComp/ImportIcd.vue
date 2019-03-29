<template>
  <div class="import-outer">
    <div class="import-top"></div>
    <div class="import-content">
      <div class="import-left">
        <div class="import-database">
          <template>
            <el-table
              size="mini"
              ref="multipleTable"
              :data="ImportDatabase"
              fit
              border
              tooltip-effect="dark"
              style="width: 100%;min-width:350px"
              max-height="800"
              @selection-change="handleSelectionChange">
              <!--<el-table-column type="selection">-->
              <!--</el-table-column>-->
              <el-table-column type='index' width="80" label='ID' align="center">
              </el-table-column>
              <el-table-column prop='Name' label="ICD名称" align="center">
              </el-table-column>
              <el-table-column prop="Type" width="150" label="类型" align="center">
              </el-table-column>
            </el-table>
          </template>
        </div>
      </div>
      <div class="import-right">
        <div class="import-add">
          <template>
            <el-table
              size="medium"
              ref="multipleTable"
              :data="AddFiles"
              fit
              border
              tooltip-effect="dark"
              style="width: 99%;min-width:700px"
              max-height="600"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection">
              </el-table-column>
              <el-table-column type="index" width="100px" label="序号">
              </el-table-column>
              <el-table-column prop='Name' label="FileName">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type='danger' size="mini" @click="deleteIcdFile(scope.$index, AddFiles)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <div class="Add-Button">
          <div class="icon-add">
            <form id="upload" enctype="multipart/form-data" style="display:none">
              <input type="file" name="fileName" id="fileName" v-on:change="saveFile($event)" style="display:none"
                     multiple>
            </form>
            <el-button type="primary" v-on:click="selectFile()" size="medium">添加文件</el-button>
          </div>
          <div class="icon-confirm">
            <el-button type="primary" @click="uploadFile()" size="medium">确认导入</el-button>
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
        file: '',
        ImportDatabase: [],
        AddFiles: [],
        multipleSelection: [],
        formData: {}
      }
    },
    created() {
      // this.formData = new FormData();
    },
    mounted() {
      this.formData = new FormData();
      this.getAllMessage()
    },
    methods: {
      getAllMessage(){
        let that =this
        this.axios.post('/getAllMessage', {
        }).then((result) => {
          that.ImportDatabase = result.data.message
          console.log(result)
        }).catch((err) => {
          console.log(err)
        })
      },
      saveFile(e) {
        var that = this
        var arr = []
        for (let i = 0; i < that.AddFiles.length; i++) {
          arr.push(that.AddFiles[i].Name)
        }
        // console.log(arr)
        for (let i = 0; i < e.target.files.length; i++) {
          if (arr.indexOf(e.target.files[i].name) == -1) {
            that.formData.append('files', e.target.files[i])
            var temp = {
              Name: e.target.files[i].name
            }
            that.AddFiles.push(temp)
          }
        }
        // console.log(this.AddFiles)

      },
      selectFile() {
        $("#fileName").trigger("click");
      },
      uploadFile() {
        let that = this
        let formData = new FormData()
        var arr = []
        for (let i = 0; i < this.AddFiles.length; i++) {
          arr.push(this.AddFiles[i].Name)
        }
        console.log(arr)
        for (let i = 0; i < this.formData.getAll('files').length; i++) {
          if (arr.indexOf(this.formData.getAll('files')[i].name) > -1) {
            formData.append('upload_files', this.formData.getAll('files')[i])
          }
        }
        console.log(formData.getAll('upload_files'))
        let oReq = new XMLHttpRequest();
        var url='http://172.16.3.58:8000/xmlImport'
        oReq.open("POST", url);
        oReq.onreadystatechange = function(res) {
          if(oReq.response=="true"){
            formData.delete('upload_files')
            that.formData.delete('files')
            that.AddFiles=[],
            that.$message({
              message:'批量导入成功',
              duration:1000,
              type:"success"
            })
            that.getAllMessage()
          }
          else{
            that.$message({
              message:"批量导入失败",
              type:'error'
            })
          }
        };
        oReq.send(formData);
        $(".fileName").html("");
        $("#fileName").val("");
        formData.delete('upload_files')
        that.formData.delete('files')
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteIcdFile(index, rows) {
        rows.splice(index, 1);
      }
    }
  }
</script>
<style scoped>
  .import-outer {
    height: 100%;
    display: flex;
    flex-flow: column;
  }

  .import-top {
    height: 50px;
    background-color: gainsboro;
    clear: both;
  }

  .import-content {
    display: flex;
    flex-flow: row;
    flex: 1;
    margin-top: 10px;
    justify-content: space-around;
  }

  .import-left {
    display: flex;
    flex: 1;
    flex-flow: column;
    /* background-color: lightskyblue; */
    padding: 15px;
  }

  .import-database {
    background-color: whitesmoke;
    width: 100%;
    border-radius: 25px;
  }

  .import-right {
    display: flex;
    flex: 2;
    flex-flow: column;
    /* background-color: lightskyblue; */
    padding: 15px;
    border-left: 2px solid lightgrey;
  }

  .import-add {
    width: 100%;
    border-radius: 25px;
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
    justify-content: center;
    align-items: center;
  }
</style>


