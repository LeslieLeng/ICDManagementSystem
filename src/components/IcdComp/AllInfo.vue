<template>
  <div class="allinfo">
    <div class="allinfo-top"></div>
    <div class="allinfo-content">
      <div class="allinfo-tree">
        <el-tree class="TreeClass" :data="Treedata" :props="defaultProps" @node-click="handleNodeClick($event)"
                 :highlight-current='true' :show-checkbox='true' :expand-on-click-node="false"
        ></el-tree>
      </div>
      <div class="allinfo-info">

      </div>
    </div>
  </div>
</template>
<script>

  export default {
    data() {
      return {
        Treedata: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },

    methods: {
      TextData() {
        this.Treedata = [
          {
            label: 'ICD Explorer',
            children:
              [
                {
                  label: 'AGS_Control_Demand_0100220_001',
                  children:
                    [
                      {
                        label: '29850:VL_AGS1_General',
                        children:
                          [
                            {
                              label: 'UDP Dest:34881 MSG Name:AGS_General_02_1',
                              children:
                                [
                                  {
                                    label: '0012_FDS_ECS_Pressure_Demand',
                                    children: [
                                      {
                                        label: '0012_01_32_FDS_ECS_Pressure_Demand_1',
                                        type: 'innerNode'
                                      }
                                    ]
                                  },
                                  {
                                    label: '0020_FDS_AGS_Status',
                                    children: [
                                      {
                                        label: '0032_15_01_FWD_Cargo_Cooling_Command_On_1',
                                        type: 'innerNode'
                                      }
                                    ]
                                  },
                                ]
                            }
                          ]
                      }
                    ]
                },
                {
                  label: 'AGS_Control_Demand_0100220_002',
                  children:
                    [
                      {
                        label: '29850:VL_AGS1_General',
                        children:
                          [
                            {
                              label: 'UDP Dest:34881 MSG Name:AGS_General_02_1',
                              children:
                                [
                                  {
                                    label: '0012_FDS_ECS_Pressure_Demand',
                                    children: [
                                      {label: '0012_01_32_FDS_ECS_Pressure_Demand_1'}
                                    ]
                                  },
                                  {
                                    label: '0020_FDS_AGS_Status',
                                    children: [
                                      {label: '0032_15_01_FWD_Cargo_Cooling_Command_On_1'}
                                    ]
                                  },
                                ]
                            }
                          ]
                      }
                    ]
                },
              ]
          },
          {
            label: 'TDM Exploer',
            children: [{
              label: '二级 2-1',
              children: [{
                label: '三级 2-1-1'
              }]
            }, {
              label: '二级 2-2',
              children: [{
                label: '三级 2-2-1'
              }]
            }]
          },
          {
            label: 'Django Exploer',
            children: [{
              label: '二级 3-1',
              children: [{
                label: '三级 3-1-1'
              }]
            }, {
              label: '二级 3-2',
              children: [{
                label: '三级 3-2-1'
              }]
            }]
          }]
      },
      handleNodeClick(event) {
        console.log(event)
        // if (event.type == 'innerNode') {
        //   alert("hello world")
        // }
      }
    },
    mounted() {
      this.TextData()
    }
  }
</script>
<style scoped>
  .TreeClass {
    background: transparent;
    width: 100%;
  }

  .allinfo {
    display: flex;
    flex-flow: column;
    height: 100%;
  }

  .allinfo-top {
    height: 50px;
    background-color: gainsboro;
    clear: both;
  }

  .allinfo-content {
    flex: 1;
    display: flex;
    flex-flow: row;
    margin-top: 10px;
    justify-content: space-around;
  }

  .allinfo-tree {
    padding: 20px;
    display: flex;
    width: 400px;
    height: 100%;
    clear: both;
    overflow: auto;
  }

  .allinfo-info {
    display: flex;
    flex: 3;
    min-width: 800px;
    background-color: rgb(235, 229, 229);
  }
</style>
<style>
  .el-tree-node__label {
    font-size: 16px
  }

</style>


