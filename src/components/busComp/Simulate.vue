<template>
  <div style="display: flex;flex-direction: row;padding: 20px">
    <div class="left_icd">
      <div class="sim_title">
        <h4>选择文件</h4>
      </div>
      <div style="padding: 10px 20px">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <div style="height: 550px;margin-top: 10px">
          <el-scrollbar style="height: 100%">
            <el-tree class="filter-tree" node-key="ID" @check="selectTreeNode" :data="ICDTreeData"  default-expand-all show-checkbox
                     :filter-node-method="filterNode"  ref="ICDTree"></el-tree>
          </el-scrollbar>
        </div>
        <!--<div style="text-align: right;margin-top: 50px">-->
          <!--<el-button style="margin-right: 20px" type="primary" @click="getCheckedNodes" icon="el-icon-check" plain>确定-->
          <!--</el-button>-->
        <!--</div>-->
      </div>
    </div>
    <div class="right_edit">
      <div class="sim_title">
        <h4>仿真数据</h4>
      </div>
      <div style="padding: 10px 20px;height: 700px">
        <el-scrollbar style="height: 100%">
          <el-table @expand-change="expandTable"
                    :data="ICDDataInfo" ref="table" fit style="width:99%">
            <el-table-column width="80px" label="ID" type="index" align="center"></el-table-column>
            <el-table-column label="文件名称" prop="Name" align="center"></el-table-column>
            <el-table-column label="通道选择" prop="ICDChannel" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.ICDChannel" placeholder="请选择">
                  <el-option v-for="item in scope.row.ChannelOption" :key="item.channel" :label="item.channel"
                             :value="item.channel"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="编辑" width="120" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="toogleExpand(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
            <el-table-column type="expand" width="1">
              <template slot-scope="scope">
                <el-form label-position="left" class="demo-table-expand">
                  <el-table :data="scope.row.Table" style="width: 99%"
                            :header-cell-style="{background:'#74bbd5',color:'#fff'}"
                            :span-method="objectSpanMethod"
                            @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter"
                            :cell-class-name="tableRowClassName"
                            border>
                    <el-table-column fixed="left" prop="SignalName" label="信号名称" width="180"
                                     align="center"></el-table-column>
                    <el-table-column prop="SignalLength" label="长度（字节）" width="150" align="center"></el-table-column>
                    <el-table-column prop="SignalNorm" label="信号规范号" width="150" align="center"></el-table-column>
                    <el-table-column prop="MSB" label="MSB" width="80" align="center"></el-table-column>
                    <el-table-column prop="LSB" label="LSB" width="80" align="center"></el-table-column>
                    <el-table-column prop="FieldName" label="域名" width="150" align="center"></el-table-column>
                    <el-table-column prop="MaxValue" label="最大值" width="80" align="center"></el-table-column>
                    <el-table-column prop="MinValue" label="最小值" width="80" align="center"></el-table-column>
                    <el-table-column prop="DataType" label="数据类型" width="150" align="center"></el-table-column>
                    <el-table-column prop="Unit" label="分辨率/单位" width="150" align="center"></el-table-column>
                    <el-table-column prop="SimulateValue" label="激励值" width="180" fixed="right" align="center">
                      <template slot-scope="scope1">
                        <el-input size="small" v-model="scope1.row.SimulateValue"></el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!--<div style="margin-top: 10px;text-align: right">-->
                    <!--<el-button type="success" @click="saveEdit(scope.row)" size="small" icon="el-icon-check" plain>保存</el-button>-->
                    <!--<el-button type="danger" size="small" icon="el-icon-close" plain>取消</el-button>-->
                  <!--</div>-->
                </el-form>
              </template>
            </el-table-column>
            <el-table-column width="200px" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" :disabled="scope.$index===0" @click="moveUp(scope.$index,scope.row,ICDDataInfo)">
                  <i class="el-icon-arrow-up"></i></el-button>
                <el-button size="mini" :disabled="scope.$index===(ICDDataInfo.length-1)"
                           @click="moveDown(scope.$index,scope.row,ICDDataInfo)"><i class="el-icon-arrow-down"></i>
                </el-button>
                <!--<el-button size="mini" type="danger" @click="removeOne(scope.$index,scope.row,ICDDataInfo)">删除-->
                <!--</el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
      <div style="text-align: right;">
        <el-button style="margin-right: 20px" type="primary" @click="SendData"  >发送
        </el-button>
      </div>

    </div>
  </div>
</template>

<script>

  export default {
    name: "Simulate",
    data() {
      return {

        filterText: '',
        ICDTreeData: [],
        ICDDataInfo: [],
        rowIndex:'-1',
        hoverOrderArr: [],
        spanArr: [],
      }
    },
    watch: {
      filterText(val) {
        this.$refs.ICDTree.filter(val);
      }
    },
    methods: {
      selectTreeNode(){
        var arr = this.$refs.ICDTree.getCheckedNodes()
        var temp = []
        for(let i=0;i<arr.length;i++){
          if(arr[i].Type =='Message'){
            temp.push(arr[i].ID)
          }
        }
        this.axios.post('/simulateICD',{
          ID:temp
        }).then((res)=>{
          // console.log(res.data[0].ICD)
          this.ICDDataInfo=res.data[0].ICD
        }).catch((err)=>{

        })
      },
      creatTree() {
        this.ICDTreeData = [{
          id: 0, label: '系统A', children: [
            {id: 1, label: 'ICD001',},
            {id: 2, label: 'ICD002',},
            {id: 3, label: 'ICD003',},
            {id: 4, label: 'ICD004',},
            {id: 5, label: 'ICD005',},
            {id: 6, label: 'ICD006',},
            {id: 7, label: 'ICD007',},
            {id: 8, label: 'ICD008',},
            {id: 9, label: 'ICD009',}
          ]
        }, {
          id: 0, label: '系统B', children: [
            {id: 1, label: 'ICD001',},
            {id: 2, label: 'ICD002',},
            {id: 3, label: 'ICD003',},
            {id: 4, label: 'ICD004',},
            {id: 5, label: 'ICD005',},
            {id: 6, label: 'ICD006',},
            {id: 7, label: 'ICD007',},
            {id: 8, label: 'ICD008',},
            {id: 9, label: 'ICD009',}
          ]
        }, {
          id: 0, label: '系统C', children: [
            {id: 1, label: 'ICD001',},
            {id: 2, label: 'ICD002',},
            {id: 3, label: 'ICD003',},
            {id: 4, label: 'ICD004',},
            {id: 5, label: 'ICD005',},
            {id: 6, label: 'ICD006',},
            {id: 7, label: 'ICD007',},
            {id: 8, label: 'ICD008',},
            {id: 9, label: 'ICD009',}
          ]
        }]
      },
      creatTable() {
        this.ICDDataInfo = [{
          id: '1',
          Name: 'A429ICD',
          ChannelOption: [{channel: 'A429通道1'}, {channel: 'A429通道2'}, {channel: 'A429通道3'}, {channel: 'A429通道4'}, {channel: 'A429通道5'}],
          Table: [
            {
              SignalName: '距离数据',
              SignalLength: '32',
              SignalNorm: 'A01',
              MSB: '0',
              LSB: '7',
              FieldName: '保留',
              MaxValue: '',
              MinValue: '',
              DataType: '',
              Unit: '',
            }, {
              SignalName: '距离数据',
              SignalLength: '32',
              SignalNorm: 'A01',
              MSB: '8',
              LSB: '15',
              FieldName: 'hight',
              MaxValue: '',
              MinValue: '',
              DataType: '',
              Unit: '',
            }, {
              SignalName: '距离数据',
              SignalLength: '32',
              SignalNorm: 'A01',
              MSB: '16',
              LSB: '23',
              FieldName: 'Middle',
              MaxValue: '',
              MinValue: '',
              DataType: '',
              Unit: '',
            }, {
              SignalName: '距离数据',
              SignalLength: '32',
              SignalNorm: 'A01',
              MSB: '24',
              LSB: '31',
              FieldName: 'low',
              MaxValue: '',
              MinValue: '',
              DataType: '',
              Unit: '',
            }, {
              SignalName: '方位数据',
              SignalLength: '16',
              SignalNorm: 'A02',
              MSB: '0',
              LSB: '7',
              FieldName: 'hight',
              MaxValue: '',
              MinValue: '',
              DataType: '',
              Unit: '',
            }, {
              SignalName: '方位数据',
              SignalLength: '16',
              SignalNorm: 'A02',
              MSB: '8',
              LSB: '15',
              FieldName: 'low',
              MaxValue: '',
              MinValue: '',
              DataType: '',
              Unit: '',
            },
            {
              SignalName: '距离速率加成',
              SignalLength: '8',
              SignalNorm: 'A02',
              MSB: '0',
              LSB: '7',
              FieldName: '距离速率加成',
              MaxValue: '',
              MinValue: '',
              DataType: '',
              Unit: '',
            }
          ]
        }, {
          id: '2',
          Name: 'A664ICD',
          ChannelOption: [{channel: 'A664通道1'}, {channel: 'A664通道2'}, {channel: 'A664通道3'}],
          Table: [
            {
              SignalName: '方位数据',
              SignalLength: '16',
              SignalNorm: 'A02',
              MSB: '0',
              LSB: '7',
              FieldName: 'hight',
              MaxValue: '',
              MinValue: '',
              DataType: '',
              Unit: '',
            }, {
              SignalName: '方位数据',
              SignalLength: '16',
              SignalNorm: 'A02',
              MSB: '8',
              LSB: '15',
              FieldName: 'low',
              MaxValue: '',
              MinValue: '',
              DataType: '',
              Unit: '',
            },
            {
              SignalName: '距离速率加成',
              SignalLength: '8',
              SignalNorm: 'A02',
              MSB: '0',
              LSB: '7',
              FieldName: '距离速率加成',
              MaxValue: '',
              MinValue: '',
              DataType: '',
              Unit: '',
            }, {
              SignalName: '高度速率加成',
              SignalLength: '8',
              SignalNorm: 'A02',
              MSB: '0',
              LSB: '7',
              FieldName: '高度速率加成',
              MaxValue: '',
              MinValue: '',
              DataType: '',
              Unit: '',
            }, {
              SignalName: '距离数据',
              SignalLength: '32',
              SignalNorm: 'A01',
              MSB: '0',
              LSB: '7',
              FieldName: '保留',
              MaxValue: '',
              MinValue: '',
              DataType: '',
              Unit: '',
            }, {
              SignalName: '距离数据',
              SignalLength: '32',
              SignalNorm: 'A01',
              MSB: '8',
              LSB: '15',
              FieldName: 'hight',
              MaxValue: '',
              MinValue: '',
              DataType: '',
              Unit: '',
            }, {
              SignalName: '距离数据',
              SignalLength: '32',
              SignalNorm: 'A01',
              MSB: '16',
              LSB: '23',
              FieldName: 'Middle',
              MaxValue: '',
              MinValue: '',
              DataType: '',
              Unit: '',
            },
          ]
        }]
      },
      getSimulateTree(){
        this.axios.post('/simulateTree',{
        }).then((res)=>{
          // console.log(res.data[0].tree)
          this.ICDTreeData = res.data[0].tree
        }).catch((err)=>{

        })
      },
      // table操作
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // getCheckedNodes() {
      //   var arr = this.$refs.ICDTree.getCheckedNodes()
      //   var temp = []
      //   for(let i=0;i<arr.length;i++){
      //     if(arr[i].Type =='Message'){
      //       temp.push(arr[i].ID)
      //     }
      //   }
      //
      //   this.axios.post('/simulateICD',{
      //     ID:temp
      //   }).then((res)=>{
      //     // console.log(res.data[0].ICD)
      //     this.ICDDataInfo=res.data[0].ICD
      //   }).catch((err)=>{
      //
      //   })
      // },
      moveUp(index, row, table) {
        if (index > 0) {
          let upDate = table[index - 1];
          table.splice(index - 1, 1);
          table.splice(index, 0, upDate);
        } else {
          alert("已经是第一条,不可上移")
        }
      },
      moveDown(index, row, table) {
        if ((index + 1) === table.length) {
          alert('已经是最后一条，不可下移');
        } else {
          let downDate = table[index + 1];
          table.splice(index + 1, 1);
          table.splice(index, 0, downDate);
        }
      },
      // removeOne(index, row, table) {
      //   table.splice(index, 1)
      // },
      toogleExpand(row) {
        let $table = this.$refs.table;
        this.ICDDataInfo.map((item) => {
          if (row.ID != item.ID) {
            $table.toggleRowExpansion(item, false)
          }
        })
        $table.toggleRowExpansion(row)
      },
      expandTable(row, expandedRows) {
        if (expandedRows.length == 0) {
          return false
        }
        var data = row.Table;
        this.spanArr = [];
        let contactDot = 0;
        data.forEach((item, index) => {
          item.index = index;
          if (index === 0) {
            this.spanArr.push(1);
          } else {
            if (item.SignalName === data[index - 1].SignalName) {
              this.spanArr[contactDot] += 1;
              this.spanArr.push(0);
            } else {
              this.spanArr.push(1);
              contactDot = index;
            }
          }
        })
      },
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },
      tableRowClassName({row,rowIndex}) {
        let arr = this.hoverOrderArr
        for (let i = 0; i < arr.length; i++) {
          if (rowIndex == arr[i]) {
            return 'hovered-row'
          }
        }
      },
      cellMouseEnter(row, column, cell, event) {
        this.hoverOrderArr = [];
        var temp = this.spanArr[row.index]
        var pos = 0
        var offset = 0
        if(temp == 0){
          for(var i=row.index; i>=0;i--){
            if(this.spanArr[i] > 0){
              offset = this.spanArr[i]
              pos = i;
              break
            }
          }
        }
        else{
          offset = temp
          pos = row.index
        }
        for(var j=0;j<offset;j++){
          this.hoverOrderArr.push(pos+j)
        }
      },
      cellMouseLeave(row, column, cell, event) {
        // console.log("leave")
        this.rowIndex = '-1'
        this.hoverOrderArr = [];
      },
      //发送数据
      SendData(){
        this.axios.post('/saveData',{
          ICD:this.ICDDataInfo
        }).then((res)=>{
          if(res.data[0].log == true){
            this.$message({
              message: '发送成功',
              type: 'success'
            });
            this.ICDDataInfo = []
            this.$refs.ICDTree.setCheckedNodes([]);
          }else {
            this.$message.error('发送失败');
          }
          // this.ICDDataInfo=res.data[0].ICD
        }).catch((err)=>{

        })
        // console.log(this.ICDDataInfo)
      }
    },
    mounted() {
      // this.creatTree()
      // this.creatTable()
      this.getSimulateTree()
    }
  }
</script>

<style scoped>
  .left_icd {
    height: 800px;
    flex: 1;
    border: 1px solid #ccc;
    background: #fff;
    box-shadow: 2px 2px 10px #919191;
  }

  .right_edit {
    height: 800px;
    margin-left: 20px;
    flex: 4;
    border: 1px solid #ccc;
    background: #fff;
    box-shadow: 2px 2px 10px #919191;
  }

  .sim_title {
    width: 130px;
    text-align: center;
    margin-left: 20px;
    margin-top: 10px;
    border-bottom: 3px solid #71abff;
  }
</style>
<style>
  .el-scrollbar__wrap {
    overflow-x: hidden;
    margin-bottom: 0 !important;
  }

  .right_edit .el-table__expand-icon>.el-icon {
    display: none!important;
  }
  .el-table .hovered-row {
    background-color: rgba(116, 187, 213, 0.2) !important;
  }
</style>

