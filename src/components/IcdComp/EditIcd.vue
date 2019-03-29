<template>
  <div class="edit-outer">
    <div class="edit-top">
      <el-steps :active="step" :align-center="true"  finish-status="success">
        <el-step title="新建系统"></el-step>
        <el-step title="编辑系统"></el-step>
        <el-step title="编辑设备"></el-step>
        <el-step title="编辑总线"></el-step>
        <el-step title="编辑节点"></el-step>
        <el-step title="编辑消息"></el-step>
        <el-step title="编辑信号"></el-step>
        <el-step title="编辑域"></el-step>
      </el-steps>
      <div class="masked"></div>
    </div>
    <div class="edit-content">
      <div class="edit-left">
        <el-scrollbar style="height: 100%">
          <div class="left-tree">
            <el-tree ref="tree" accordion class="EditTreeClass" :data="LeftTreeData" :props="defaultProps"
                     @node-click="editTreeClick($event)"
                     :highlight-current='true' :expand-on-click-node="false" :default-expand-all="true"
            >
            </el-tree>
          </div>
        </el-scrollbar>

      </div>
      <!--所有系统-->
      <div class="edit-middle" v-show="AllEditValue">
        <div class="AllTitle" style="margin-top:10px">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
              <span>系统列表</span>
            </el-col>
          </el-row>
        </div>
        <div class="SearchAdd">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
              <el-button type="primary" size="medium" @click="showAddSystemValue=true">增加</el-button>
              <el-dialog width="800px" title="新增系统" :visible.sync="showAddSystemValue">
                <el-form :model="addSystemForm" ref="addSystemForm" :label-position="labelPosition" label-width="100px" size="mini">
                  <el-row :span="24" type="flex" justify="space-around">
                    <el-col>
                      <el-form-item :rules="[{ required: true, message: '系统名称不能为空',trigger: 'blur'}]" label="系统名称:" prop="SystemName">
                        <el-input clearable size="mini" style="width:200px"
                                  v-model="addSystemForm.SystemName"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item label="系统简称:">
                        <el-input clearable size="mini" style="width:200px"
                                  v-model="addSystemForm.SystemShortName"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :span="24" type="flex" justify="space-around">
                    <el-col>
                      <el-form-item :rules="[{ required: true, message: '系统规范号不能为空',trigger: 'blur'}]" prop="SystemNorm" label="系统规范号:">
                        <el-input clearable size="mini" style="width:200px"
                                  v-model="addSystemForm.SystemNorm"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col></el-col>
                  </el-row>
                  <el-row :span="24" justify="space-around">
                    <el-col style="text-align: left">
                      <el-form-item label="系统描述:">
                        <el-input style="margin-left: 45px;width: 500px" clearable size="mini" :span="4" type="textarea"
                                  placeholder="请输入内容"
                                  v-model="addSystemForm.SystemDescribe"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="showAddSystemValue=false">取 消</el-button>
                  <el-button type="primary" @click="saveAddSystem('addSystemForm')">确 定</el-button>
                </div>
              </el-dialog>
            </el-col>
          </el-row>
        </div>
        <div class="CommonTable">
          <el-table style="width: 99%" fit :data="SystemTable" :header-cell-style="getRowClass">
            <el-table-column width="80px" type="index" label="ID"></el-table-column>
            <el-table-column min-width="100px" type="expand" prop="SystemDescribe" label="系统描述" width="100">
              <template slot-scope="props">
                <el-form label-position="left" class="demo-table-expand">
                  <el-form-item label="系统描述:">
                    <span>{{ props.row.SystemDescribe }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="系统名称" prop="SystemName" align="center"></el-table-column>
            <el-table-column label="系统简称" prop="SystemShortName" align="center"></el-table-column>
            <el-table-column label="系统规范号" prop="SystemNorm" align="center"></el-table-column>
            <el-table-column width="200px" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" :disabled="scope.$index===0" @click="moveUp(scope.$index,scope.row,SystemTable)">
                  <i class="el-icon-arrow-up"></i></el-button>
                <el-button size="mini" :disabled="scope.$index===(SystemTable.length-1)"
                           @click="moveDown(scope.$index,scope.row,SystemTable)"><i class="el-icon-arrow-down"></i>
                </el-button>
                <el-button size="mini" type="danger" @click="removeOne(scope.$index,scope.row,SystemTable)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="SaveRemove">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
              <el-button type="primary" @click="saveAllData" size="medium">保存</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <!--系统编辑-->
      <div class="edit-middle" v-show="SystemEditValue">
        <div class="SystemTtile" style="margin-top:10px">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
                            <span>
                                系统信息
                            </span>
            </el-col>
          </el-row>
        </div>
        <div class="CommonInfoForm">
          <el-form :model="SystemInfoForm" ref="SystemInfoForm" label-width="100px" :label-position="labelPosition">
            <el-row :span="24" type="flex" justify="space-around">
              <el-col>
                <el-form-item label="创建者:" size="mini">
                  <span>{{SystemInfoForm.CreateMan}}</span>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="创建日期:" size="mini">
                  <span>{{SystemInfoForm.CreateDate}}</span>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="修改者:" size="mini">
                  <span>{{SystemInfoForm.ModifyMan}}</span>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="修改日期:" size="mini">
                  <span>{{SystemInfoForm.ModifyDate}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24" type="flex" justify="space-around">
              <el-col>
                <el-form-item label="系统名称:">
                  <el-input clearable size="mini" style="width:200px" v-model="SystemInfoForm.SystemName"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="系统简称:">
                  <el-input clearable size="mini" style="width:200px"
                            v-model="SystemInfoForm.SystemShortName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="系统规范号:">
                  <el-input clearable size="mini" style="width:200px" v-model="SystemInfoForm.SystemNorm"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="系统描述:">
                  <el-input style="width: 500px" clearable size="mini" :span="4" type="textarea" placeholder="请输入内容"
                            v-model="SystemInfoForm.SystemDescribe"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="DeviceTableTitle">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center;">
                            <span>
                                设备列表
                            </span>
            </el-col>
          </el-row>
        </div>
        <div class="SearchAdd">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
              <el-button type="primary" size="medium" @click="showAddDeviceValue=true">增加</el-button>
              <el-dialog width="800px" title="新增设备" :visible.sync="showAddDeviceValue">
                <el-form :model="addDeviceForm" ref="addDeviceForm" :label-position="labelPosition" label-width="100px" size="mini">
                  <el-row :span="24" type="flex" justify="space-around">
                    <el-col>
                      <el-form-item :rules="[{ required: true, message: '设备名称不能为空',trigger: 'blur'}]" prop="DeviceName" label="设备名称:">
                        <el-input clearable size="mini" style="width:200px"
                                  v-model="addDeviceForm.DeviceName"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item :rules="[{ required: true, message: '设备规范号不能为空',trigger: 'blur'}]" prop="DeviceNorm"  label="设备规范号:">
                        <el-input clearable size="mini" style="width:200px"
                                  v-model="addDeviceForm.DeviceNorm"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col style="text-align: left">
                      <el-form-item label="设备说明:">
                        <el-input style="width: 500px;margin-left: 45px" clearable size="mini" :span="4" type="textarea"
                                  placeholder="请输入内容"
                                  v-model="addDeviceForm.DeviceDescribe"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="showAddDeviceValue=false">取 消</el-button>
                  <el-button type="primary" @click="saveAddDevice('addDeviceForm')">确 定</el-button>
                </div>
              </el-dialog>
            </el-col>
          </el-row>
        </div>
        <div class="CommonTable">
          <el-table :data="DeviceTable" fit style="width:99%" :header-cell-style="getRowClass">
            <el-table-column width="80px" label="设备ID" type="index" align="center"></el-table-column>
            <el-table-column min-width="100px" type="expand" prop="DeviceDescribe" label="设备说明" width="100">
              <template slot-scope="props">
                <el-form label-position="left" class="demo-table-expand">
                  <el-form-item label="设备说明:">
                    <span>{{ props.row.DeviceDescribe }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="设备名称" prop="DeviceName" align="center"></el-table-column>
            <el-table-column label="设备规范号" prop="DeviceNorm" align="center"></el-table-column>
            <el-table-column width="200px" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" :disabled="scope.$index===0" @click="moveUp(scope.$index,scope.row,DeviceTable)">
                  <i class="el-icon-arrow-up"></i></el-button>
                <el-button size="mini" :disabled="scope.$index===(DeviceTable.length-1)"
                           @click="moveDown(scope.$index,scope.row,DeviceTable)"><i class="el-icon-arrow-down"></i>
                </el-button>
                <el-button size="mini" type="danger" @click="removeOne(scope.$index,scope.row,DeviceTable)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="SaveRemove">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
              <el-button type="primary" @click="saveSystemData" size="medium">保存</el-button>
              <el-button type="danger" @click="delSystemData" size="medium">删除</el-button>
            </el-col>
          </el-row>

        </div>
      </div>
      <!--设备编辑-->
      <div class="edit-middle" v-show="DeviceEditValue">
        <div class="DeviceTitle" style="margin-top:10px">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
                            <span>
                                设备信息
                            </span>
            </el-col>
          </el-row>
        </div>
        <div class="CommonInfoForm" style="min-height:200px">
          <el-form v-model="DeviceInfoForm" label-width="90px" :label-position="labelPosition">
            <el-row :span="24" type="flex" justify="space-around">
              <el-col>
                <el-form-item label="创建者:" size="mini">
                  <span>{{DeviceInfoForm.CreateMan}}</span>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="创建日期:" size="mini">
                  <span>{{DeviceInfoForm.CreateDate}}</span>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="修改者:" size="mini">
                  <span>{{DeviceInfoForm.ModifyMan}}</span>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="修改日期:" size="mini">
                  <span>{{DeviceInfoForm.ModifyDate}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24" type="flex" justify="space-around">
              <el-col>
                <el-form-item label="设备名称:">
                  <el-input clearable size="mini" style="width:200px" v-model="DeviceInfoForm.DeviceName"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="设备规范号:">
                  <el-input clearable size="mini" style="width:200px" v-model="DeviceInfoForm.DeviceNorm"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24" type="flex" justify="space-around">
              <el-col>
                <el-form-item label="设备说明:">
                  <el-input style="width: 500px" clearable size="mini" :span="4" type="textarea" placeholder="请输入内容"
                            v-model="DeviceInfoForm.DeviceDescribe"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="BusTableTitle">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
                            <span>
                                总线列表
                            </span>
            </el-col>
          </el-row>
        </div>
        <div class="CommonAddBtn">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
              <el-button size="mini" type="primary" @click="showAddBusValue=true">增加总线</el-button>
              <el-dialog width="800px" title="新增总线" :visible.sync="showAddBusValue">
                <el-form :model="addBusForm" ref="addBusForm" :label-position="labelPosition" label-width="100px" size="mini">
                  <el-row :span="24" type="flex" justify="space-around">
                    <el-col>
                      <el-form-item label="总线名称:" :rules="[{ required: true, message: '总线名称不能为空',trigger: 'blur'}]" prop="BusName">
                        <el-input clearable size="mini" style="width:200px" v-model="addBusForm.BusName"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item label="总线类型:" :rules="[{ required: true, message: '总线类型不能为空',trigger: 'change'}]" prop="BusType">
                        <el-input clearable size="mini" style="width:200px" v-model="addBusForm.BusType"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="showAddBusValue=false">取 消</el-button>
                  <el-button type="primary" @click="saveAddBus('addBusForm')">确 定</el-button>
                </div>
              </el-dialog>
            </el-col>
          </el-row>
        </div>
        <div class="CommonTable">
          <el-table :data="BusTable" fit style="width:99%" max-height="300" :header-cell-style="getRowClass">
            <el-table-column width="80px" label="总线ID" type="index" align="center"></el-table-column>
            <el-table-column label="总线名称" prop="BusName" align="center"></el-table-column>
            <el-table-column label="总线类型" prop="BusType" align="center"></el-table-column>
            <el-table-column width="200px" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" :disabled="scope.$index===0" @click="moveUp(scope.$index,scope.row,BusTable)"><i
                  class="el-icon-arrow-up"></i></el-button>
                <el-button size="mini" :disabled="scope.$index===(BusTable.length-1)"
                           @click="moveDown(scope.$index,scope.row,BusTable)"><i class="el-icon-arrow-down"></i>
                </el-button>
                <el-button size="mini" type="danger" @click="removeOne(scope.$index,scope.row,BusTable)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="SaveRemove">
          <el-row type="flex" justify='center'>
            <el-col style="text-align: center">
              <el-button size="medium" @click="saveDeviceData" type="primary">保存</el-button>
              <el-button size="medium" @click="delDeviceData" type="danger">删除</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <!--总线编辑-->
      <div class="edit-middle" v-show="BusEditValue">
        <div class="BusTitle" style="margin-top:10px">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
                            <span>
                                总线信息
                            </span>
            </el-col>
          </el-row>
        </div>
        <div class="CommonInfoForm">
          <el-form :model="BusInfoForm" ref="BusInfoForm" label-width="80px" :label-position="labelPosition">
            <el-row :span="24" type="flex" justify="space-around">
              <el-col>
                <el-form-item label="创建者:" size="mini">
                  <span>{{BusInfoForm.CreateMan}}</span>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="创建日期:" size="mini">
                  <span>{{BusInfoForm.CreateDate}}</span>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="修改者:" size="mini">
                  <span>{{BusInfoForm.ModifyMan}}</span>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="修改日期:" size="mini">
                  <span>{{BusInfoForm.ModifyDate}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24" type="flex" justify="space-around">
              <el-col>
                <el-form-item label="总线名称:">
                  <el-input clearable size="mini" style="width:200px" v-model="BusInfoForm.BusName"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="总线类型:">
                  <el-input clearable size="mini" style="width:200px" v-model="BusInfoForm.BusType"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="ProjectTabkeTitle">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
                            <span>
                                设备节点列表
                            </span>
            </el-col>
          </el-row>
        </div>
        <div class="SearchAdd">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
              <el-button size="medium" type="primary" @click="showAddNodeVlaue=true">增加设备节点</el-button>
              <el-dialog width="800px" title="新增设备节点" :visible.sync="showAddNodeVlaue">
                <el-form :model="addNodeForm" ref="addNodeForm" :label-position="labelPosition" label-width="120px" size="mini">
                  <el-row :span="24" type="flex" justify="space-around">
                    <el-col>
                      <el-form-item label="设备节点名称:" :rules="[{ required: true, message: '设备节点名称不能为空',trigger: 'blur'}]" prop="NodeName">
                        <el-input clearable size="mini" style="width:200px" v-model="addNodeForm.NodeName"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col>
                    </el-col>
                  </el-row>
                  <el-row :span="24" type="flex" justify="space-around">
                    <el-col>
                      <el-form-item label="设备节点描述:" style="text-align: left;">
                        <el-input style="width: 500px;margin-left: 30px" clearable size="mini"  type="textarea"
                                  placeholder="请输入内容"
                                  v-model="addNodeForm.NodeDescribe"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="showAddNodeVlaue=false">取 消</el-button>
                  <el-button type="primary" @click="saveAddNode('addNodeForm')">确 定</el-button>
                </div>
              </el-dialog>
            </el-col>
          </el-row>
        </div>
        <div class="CommonTable">
          <el-table style="width: 99%" :data="NodeTable" fit max-height="300" :header-cell-style="getRowClass">
            <el-table-column width="100px" label="设备节点ID" type="index" align="center"></el-table-column>
            <el-table-column label="设备节点名称" prop="NodeName" align="center"></el-table-column>
            <el-table-column type="expand" prop="NodeDescribe" label="设备节点描述" width="120">
              <template slot-scope="props">
                <el-form label-position="left" class="demo-table-expand">
                  <el-form-item label="设备节点描述:">
                    <span>{{ props.row.NodeDescribe }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column width="200px" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" :disabled="scope.$index===0" @click="moveUp(scope.$index,scope.row,NodeTable)"><i
                  class="el-icon-arrow-up"></i></el-button>
                <el-button size="mini" :disabled="scope.$index===(NodeTable.length-1)"
                           @click="moveDown(scope.$index,scope.row,NodeTable)"><i class="el-icon-arrow-down"></i>
                </el-button>
                <el-button size="mini" type="danger" @click="removeOne(scope.$index,scope.row,NodeTable)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="SaveRemove">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
              <el-button size='medium' @click="saveBusData" type="primary">保存</el-button>
              <el-button size='medium' @click="delBusData" type='danger'>删除</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <!--设备节点编辑-->
      <div class="edit-middle" v-show="ProjectEditValue">
        <div class="ProjectTitle" style="margin-top:10px">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
                            <span>
                                设备节点信息
                            </span>
            </el-col>
          </el-row>
        </div>
        <div class="CommonInfoForm">
          <el-form :model="NodeInfoForm" ref="NodeInfoForm" label-width="80px" :label-position="labelPosition">
            <el-row :span="24" type="flex" justify="space-around">
              <el-col>
                <el-form-item label="创建者:" size="mini">
                  <span>{{NodeInfoForm.CreateMan}}</span>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="创建日期:" size="mini">
                  <span>{{NodeInfoForm.CreateDate}}</span>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="修改者:" size="mini">
                  <span>{{NodeInfoForm.ModifyMan}}</span>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="修改日期:" size="mini">
                  <span>{{NodeInfoForm.ModifyDate}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24" type="flex" justify="space-around">
              <el-col>
                <el-form-item label="节点名称:">
                  <el-input clearable size="mini" style="width:200px" v-model="NodeInfoForm.NodeName"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
              </el-col>
            </el-row>
            <el-row :span="24" type="flex" justify="space-around">
              <el-col>
                <el-form-item label="节点描述:">
                  <el-input style="width: 500px;" clearable size="mini" :span="4" type="textarea"
                            placeholder="请输入内容"
                            v-model="NodeInfoForm.NodeDescribe"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="MessageTitle">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
                            <span>
                                消息列表
                            </span>
            </el-col>
          </el-row>
        </div>

        <div class="CommonAddBtn">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
              <el-button size="mini" type="primary" @click="showAddMsgVlaue=true">增加消息</el-button>
              <el-dialog width="800px" title="新增消息" :visible.sync="showAddMsgVlaue">
                <el-form :model="addMsgForm" ref="addMsgForm" :label-position="labelPosition" label-width="100px" size="mini">
                  <el-row :span="24">
                    <el-col :span="8">
                      <el-form-item label="消息名称:" :rules="[{ required: true, message: '消息名称不能为空',trigger: 'blur'}]" prop="MessageName">
                        <el-input size="mini" v-model="addMsgForm.MessageName" clearable
                                  style="width:120px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="规范号:" :rules="[{ required: true, message: '消息规范号不能为空',trigger: 'blur'}]" prop="MessageNorm">
                        <el-input size="mini" v-model="addMsgForm.MessageNorm" clearable
                                  style="width:120px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="消息长度（字节）:">
                        <el-input size="mini" v-model="addMsgForm.MessageLength" clearable
                                  style="width:120px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :span="24" type="flex" justify="sapce-around">
                    <el-col>
                      <el-form-item label="大小端:">
                        <el-select size="mini" v-model="addMsgForm.BigSmallPort" clearable style="width:120px">
                          <el-option value="大端" key="大端"></el-option>
                          <el-option value="小端" key="小端"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item label="传输形式:">
                        <el-select size="mini" v-model="addMsgForm.TransportMode" clearable style="width:120px">
                          <el-option value="周期" key="周期"></el-option>
                          <el-option value="时间" key="时间"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item label="传输周期:">
                        <el-input size="mini" v-model="addMsgForm.TransportPeriod" clearable
                                  style="width:120px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row type="flex" justify="sapce-around">
                    <el-col>
                      <el-form-item label="源:">
                        <el-input size="mini" v-model="addMsgForm.Source" clearable style="width:120px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item label="目的:">
                        <el-input size="mini" v-model="addMsgForm.Purpose" clearable
                                  style="width:120px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item label="是否中断:">
                        <el-select size="mini" v-model="addMsgForm.Interrupt" clearable style="width:120px">
                          <el-option value="是" key="是"></el-option>
                          <el-option value="否" key="否"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row :span="24">
                    <el-col :span="8">
                      <el-form-item label="允许重写:">
                        <el-select size="mini" v-model="addMsgForm.Rewrite" clearable style="width:120px">
                          <el-option value="是" key="是"></el-option>
                          <el-option value="否" key="否"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="最大延时:">
                        <el-input size="mini" v-model="addMsgForm.MaxDelay" clearable
                                  style="width:120px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="系统状态:">
                        <el-input size="mini" v-model="addMsgForm.SystemState" clearable
                                  style="width:120px"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="20">
                      <el-form-item label="消息描述:">
                        <el-input style="margin-left: 20px" type="textarea" :rows="3"
                                  v-model="addMsgForm.MessageDescribe"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="showAddMsgVlaue=false">取 消</el-button>
                  <el-button type="primary" @click="saveAddMsg('addMsgForm')">确 定</el-button>
                </div>
              </el-dialog>
            </el-col>
          </el-row>
        </div>
        <div class="MessageTable" style="margin-top:10px">
          <div>
            <el-table :data="MessageTable" fit style="width:99%" max-height="400" :header-cell-style="getRowClass">
              <!--<el-table-column type="selection"></el-table-column>-->
              <el-table-column width="80px" label="消息ID" type="index" align="center"></el-table-column>
              <el-table-column label="消息名称" prop="MessageName" align="center"></el-table-column>
              <el-table-column label="消息规范号" prop="MessageNorm" align="center"></el-table-column>
              <el-table-column label="长度" prop="MessageLength" align="center"></el-table-column>
              <el-table-column type="expand" prop="MessageDescribe" label="描述" width="100">
                <template slot-scope="props">
                  <el-form label-position="left" class="demo-table-expand">
                    <el-form-item label="消息描述:">
                      <span>{{ props.row.MessageDescribe }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column width="200px" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" :disabled="scope.$index===0"
                             @click="moveUp(scope.$index,scope.row,MessageTable)"><i
                    class="el-icon-arrow-up"></i></el-button>
                  <el-button size="mini" :disabled="scope.$index===(MessageTable.length-1)"
                             @click="moveDown(scope.$index,scope.row,MessageTable)"><i class="el-icon-arrow-down"></i>
                  </el-button>
                  <el-button size="mini" type="danger" @click="removeOne(scope.$index,scope.row,MessageTable)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="SaveRemove" style="margin-top:10px">
          <el-row type="flex" justify="center">
            <el-col style="text-align: center">
              <el-button size="medium" @click="saveNodeData" type="primary">保存</el-button>
              <el-button size="medium" @click="delNodeData" type="danger">删除</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <!--消息编辑-->
      <div class="edit-middle" v-show="MessageEditValue">
        <div class="baseInfo">
          <div>
            <el-row type="flex" justify="center">
              <el-col style="text-align: center">
                <span>消息信息</span>
              </el-col>
            </el-row>
          </div>
          <div style="margin-top:10px">
            <el-form :model="MessageBaseInfoForm" ref="MessageBaseInfoForm" label-width="80px" :label-position="labelPosition">
              <el-row :span="24" type="flex" justify="space-around">
                <el-col>
                  <el-form-item label="总线类型:" size="mini">
                    <span>{{MessageBaseInfoForm.BusType}}</span>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="创建者:" size="mini">
                    <span>{{MessageBaseInfoForm.CreateMan}}</span>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="创建日期:" size="mini">
                    <span>{{MessageBaseInfoForm.CreateDate}}</span>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="修改者:" size="mini">
                    <span>{{MessageBaseInfoForm.ModifyMan}}</span>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="修改日期:" size="mini">
                    <span>{{MessageBaseInfoForm.ModifyDate}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="8">
                  <el-form-item label="消息名称:" size="mini">
                    <el-input size="mini" v-model="MessageBaseInfoForm.MessageName" clearable
                              style="width:120px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="规范号:" size="mini">
                    <el-input size="mini" v-model="MessageBaseInfoForm.MessageNorm" clearable
                              style="width:120px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="消息长度（字节）:">
                    <el-input size="mini" v-model="MessageBaseInfoForm.MessageLength" clearable
                              style="width:120px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24" type="flex" justify="sapce-around">
                <el-col>
                  <el-form-item label="大小端:">
                    <el-select size="mini" v-model="MessageBaseInfoForm.BigSmallPort" clearable style="width:120px">
                      <el-option value="大端" key="大端"></el-option>
                      <el-option value="小端" key="小端"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="传输形式:">
                    <el-select size="mini" v-model="MessageBaseInfoForm.TransportMode" clearable style="width:120px">
                      <el-option value="周期" key="周期"></el-option>
                      <el-option value="时间" key="时间"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="传输周期:">
                    <el-input size="mini" v-model="MessageBaseInfoForm.TransportPeriod" clearable
                              style="width:120px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="sapce-around">
                <el-col>
                  <el-form-item label="源:">
                    <el-input size="mini" v-model="MessageBaseInfoForm.Source" clearable style="width:120px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="目的:">
                    <el-input size="mini" v-model="MessageBaseInfoForm.Purpose" clearable
                              style="width:120px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="是否中断:">
                    <el-select size="mini" v-model="MessageBaseInfoForm.Interrupt" clearable style="width:120px">
                      <el-option value="是" key="是"></el-option>
                      <el-option value="否" key="否"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row :span="24">
                <el-col :span="8">
                  <el-form-item label="允许重写:">
                    <el-select size="mini" v-model="MessageBaseInfoForm.Rewrite" clearable style="width:120px">
                      <el-option value="是" key="是"></el-option>
                      <el-option value="否" key="否"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="最大延时:">
                    <el-input size="mini" v-model="MessageBaseInfoForm.MaxDelay" clearable
                              style="width:120px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="系统状态:">
                    <el-input size="mini" v-model="MessageBaseInfoForm.SystemState" clearable
                              style="width:120px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="消息描述:">
                    <el-input type="textarea" :rows="3" v-model="MessageBaseInfoForm.MessageDescribe"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div>
            <label style="color:#606266 ">是否导入数据库消息：</label>
            <el-checkbox v-model="isReuesMessage">导入消息</el-checkbox>
            <el-popover
              placement="top"
              width="1100"
              trigger="click"
              v-model="messageVisible">
              <h3>消息列表</h3>
              <div style="width:15%;float:left;margin-left:3%">
                <el-input size="medium" placeholder="消息名称检索" autofocus clearable v-model="searchMessage"></el-input>
              </div>
              <el-table :data="reuseMessageTable.filter(data => !searchMessage || data.MessageName.toLowerCase().includes(searchMessage.toLowerCase()))"
                        style="width: 99%" height="500">
                <el-table-column width="150" type="index" label="ID"></el-table-column>
                <el-table-column width="200" property="MessageName" label="消息名称">
                  <template slot-scope="scope">
                    <label>{{scope.row.MessageName}}</label>
                  </template>
                </el-table-column>
                <el-table-column width="200" property="MessageNorm" label="长度">
                  <template slot-scope="scope">
                    <label>{{scope.row.MessageNorm}}</label>
                  </template>
                </el-table-column>
                <el-table-column width="200" property="MessageLength" label="长度">
                  <template slot-scope="scope">
                    <label>{{scope.row.MessageLength}}</label>
                  </template>
                </el-table-column>
                <el-table-column type="expand" prop="MessageDescribe" label="描述" width="100">
                  <template slot-scope="props">
                    <el-form label-position="left" class="demo-table-expand">
                      <el-form-item label="消息描述:">
                        <span>{{ props.row.MessageDescribe }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column width="100" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button @click="useMessage(scope.$index,scope.row)" size="small">引用</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button v-show="isReuesMessage" size="small" @click="reuseMessage" slot="reference">选择消息</el-button>
            </el-popover>
          </div>
        </div>
        <div class="signalList">
          <div class="signalListTitle">
            <el-row type="flex" justify="center">
              <el-col style="text-align: center"><span>信号列表</span></el-col>
            </el-row>
          </div>
          <div class="SearchAdd">
            <el-row>
              <el-col style="text-align: center">
                <el-button size="mini" type="primary" @click="addSignalValue=true">新增信号</el-button>
                <el-dialog width="800px" title="新增信号" :visible.sync="addSignalValue">
                  <el-form :model="addSignalForm" ref="addSignalForm" :label-position="labelPosition" label-width="100px" >
                    <el-row :span="24" type="flex" justify="space-around">
                      <el-col>
                        <el-form-item label="信号名称:" :rules="[{ required: true, message: '信号名称不能为空',trigger: 'blur'}]" prop="SignalName">
                          <el-input clearable size="mini" style="width:200px"
                                    v-model="addSignalForm.SignalName"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col>
                        <el-form-item label="规范号:" :rules="[{ required: true, message: '信号规范号不能为空',trigger: 'blur'}]" prop="SignalNorm">
                          <el-input clearable size="mini" style="width:200px"
                                    v-model="addSignalForm.SignalNorm"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :span="24" type="flex" justify="space-around">
                      <el-col>
                        <el-form-item label="信号起始位:">
                          <el-input clearable size="mini" style="width:200px"
                                    v-model="addSignalForm.SignalStart"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col>
                        <el-form-item label="信号长度（字节）:">
                          <el-input clearable size="mini" style="width:200px"
                                    v-model="addSignalForm.SignalLength"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="20">
                        <el-form-item label="信号描述:">
                          <el-input style="margin-left: 45px" type="textarea" :rows="4"
                                    v-model="addSignalForm.SignalDescribe"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="addSignalValue=false">取 消</el-button>
                    <el-button @click="saveAddSignal('addSignalForm')" type="primary">确 定</el-button>
                  </div>
                </el-dialog>
              </el-col>
            </el-row>
          </div>
          <div class="signalTable">
            <!--<el-col style="margin: 0 0 10px 50px;width: 300px">-->
            <!--<el-input size="mini" placeholder="输入关键字查询" clearable></el-input>-->
            <!--</el-col>-->
            <el-table style="width:99%;" :data="SignalTable" border size="mini" max-height="300"
                      :header-cell-style="getRowClass">
              <!--<el-table-column type="selection" align="center"></el-table-column>-->
              <el-table-column label="信号ID" type="index" align="center" width="80px"></el-table-column>
              <el-table-column label="信号名称" prop="SignalName" align="center"></el-table-column>
              <el-table-column type="expand" prop="SignalDescribe" label="描述" width="100">
                <template slot-scope="props">
                  <el-form label-position="left" class="demo-table-expand">
                    <el-form-item label="信号描述:">
                      <span>{{ props.row.SignalDescribe }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="起始位" prop="SignalStart" align="center"></el-table-column>
              <el-table-column label="规范号" prop="SignalNorm" align="center"></el-table-column>
              <el-table-column label="长度" prop="SignalLength" align="center"></el-table-column>
              <el-table-column width="200px" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" :disabled="scope.$index===0"
                             @click="moveUp(scope.$index,scope.row,SignalTable)"><i
                    class="el-icon-arrow-up"></i></el-button>
                  <el-button size="mini" :disabled="scope.$index===(SignalTable.length-1)"
                             @click="moveDown(scope.$index,scope.row,SignalTable)"><i class="el-icon-arrow-down"></i>
                  </el-button>
                  <el-button size="mini" type="danger" @click="removeOne(scope.$index,scope.row,SignalTable)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="SaveRemove">
            <el-row type="flex" justify="center">
              <el-col style="text-align: center">
                <el-button type="primary" @click="saveMessageData" size="medium">保存</el-button>
                <el-button type="danger" @click="delMessageData" size="medium">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <!--信号编辑-->
      <div class="edit-middle" v-show="SignalEditValue">
        <div class="baseInfoSingal">
          <div>
            <el-row type="flex" justify="center">
              <el-col style="text-align: center">
                <span>信号信息</span>
              </el-col>
            </el-row>
          </div>
          <div style="margin-top:10px">
            <el-form :model="SignalBaseInfoForm" ref="SignalBaseInfoForm" label-width="90px" :label-position="labelPosition">
              <el-row :span="24" type="flex" justify="space-around">
                <el-col>
                  <el-form-item label="创建者:" size="mini">
                    <span>{{SignalBaseInfoForm.CreateMan}}</span>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="创建日期:" size="mini">
                    <span>{{SignalBaseInfoForm.CreateDate}}</span>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="修改者:" size="mini">
                    <span>{{SignalBaseInfoForm.ModifyMan}}</span>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="修改日期:" size="mini">
                    <span>{{SignalBaseInfoForm.ModifyDate}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24" type="flex" justify="space-around">
                <el-col>
                  <el-form-item label="信号名称:">
                    <el-input clearable size="mini" style="width:200px"
                              v-model="SignalBaseInfoForm.SignalName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="规范号:">
                    <el-input clearable size="mini" style="width:200px"
                              v-model="SignalBaseInfoForm.SignalNorm"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24" type="flex" justify="space-around">
                <el-col>
                  <el-form-item label="信号起始位:">
                    <el-input clearable size="mini" style="width:200px"
                              v-model="SignalBaseInfoForm.SignalStart"></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="信号长度（字节）:">
                    <el-input clearable size="mini" style="width:200px"
                              v-model="SignalBaseInfoForm.SignalLength"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="信号描述:">
                    <el-input type="textarea" :rows="4" v-model="SignalBaseInfoForm.SignalDescribe"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div>
            <label style="color:#606266 ">是否导入数据库信号：</label>
            <el-checkbox v-model="isReuseSignal">导入信号</el-checkbox>
            <el-popover
              placement="top"
              width="1100"
              trigger="click"
              v-model="signalVisible">
              <h3>信号列表</h3>
              <div style="width:15%;float:left;margin-left:3%">
                <el-input size="medium" placeholder="信号名称检索" autofocus clearable v-model="searchSignal"></el-input>
              </div>
              <el-table :data="reuseSignalTable.filter(data => !searchSignal || data.SignalName.toLowerCase().includes(searchSignal.toLowerCase()))"
                        style="width: 99%" height="500">
                <el-table-column width="100" type="index" label="ID"></el-table-column>
                <el-table-column width="200" property="SignalName" label="信号名称">
                  <template slot-scope="scope">
                    <label>{{scope.row.SignalName}}</label>
                  </template>
                </el-table-column>
                <el-table-column width="200" property="SignalNorm" label="信号规范号">
                  <template slot-scope="scope">
                    <label>{{scope.row.SignalNorm}}</label>
                  </template>
                </el-table-column>
                <el-table-column width="150" property="SignalStart" label="起始位">
                  <template slot-scope="scope">
                    <label>{{scope.row.SignalStart}}</label>
                  </template>
                </el-table-column>
                <el-table-column width="150" property="SignalLength" label="长度">
                  <template slot-scope="scope">
                    <label>{{scope.row.SignalLength}}</label>
                  </template>
                </el-table-column>
                <el-table-column type="expand" prop="SiganlDescribe" label="描述" width="100">
                  <template slot-scope="props">
                    <el-form label-position="left" class="demo-table-expand">
                      <el-form-item label="消息描述:">
                        <span>{{ props.row.SignalDescribe }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column width="100" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button @click="useSignal(scope.$index,scope.row)" size="small">引用</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button v-show="isReuseSignal" size="small" @click="reuseSignal" slot="reference">选择信号</el-button>
            </el-popover>
          </div>
        </div>
        <div class="FieldList">
          <div class="FieldListTitle">
            <el-row type="flex" justify="center">
              <el-col style="text-align: center">
                <span>域列表</span>
              </el-col>
            </el-row>
          </div>
          <div class="SearchAdd">
            <el-row>
              <el-col style="text-align: center">
                <el-button size="medium" type="primary" @click="addFieldValue=true">新增域</el-button>
                <el-dialog width="900px" title="新增域" :visible.sync="addFieldValue">
                  <el-form :model="addFieldForm" ref="addFieldForm" :label-position="labelPosition" label-width="90px" size="mini">
                    <el-row :span="24" type="flex" justify="space-around">
                      <el-col>
                        <el-form-item label="域名称:" :rules="[{ required: true, message: '域名称不能为空',trigger: 'blur'}]" prop="FieldName">
                          <el-input clearable size="mini" style="width:200px"
                                    v-model="addFieldForm.FieldName"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col>
                        <el-form-item label="规范号:" :rules="[{ required: true, message: '域规范号不能为空',trigger: 'blur'}]" prop="FieldNorm">
                          <el-input clearable size="mini" style="width:200px"
                                    v-model="addFieldForm.FieldNorm"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :span="24" type="flex" justify="space-around">
                      <el-col>
                        <el-form-item label="域长度:">
                          <el-input clearable size="mini" style="width:200px"
                                    v-model="addFieldForm.FieldLength"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col>
                        <el-form-item label="数据类型:">
                          <el-select v-model="addFieldForm.DataType" size="mini" clearable style="width:200px">
                            <el-option label="Float" value="Float"></el-option>
                            <el-option label="Double" value="Double"></el-option>
                            <el-option label="BOOLEAN" value="BOOLEAN"></el-option>
                            <el-option label="ENUM" value="ENUM"></el-option>
                            <el-option label="BCD" value="BCD"></el-option>
                            <el-option label="STRING" value="STRING"></el-option>
                            <el-option label="UNSIGED INT" value="UNSIGED INT"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :span="24" type="flex" justify="space-around">
                      <el-col>
                        <el-form-item label="单位:">
                          <el-input clearable size="mini" style="width:200px" v-model="addFieldForm.Unit"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col>
                        <el-form-item label="分辨率:">
                          <el-input clearable size="mini" style="width:200px"
                                    v-model="addFieldForm.Resolution"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :span="24" type="flex" justify="space-around">
                      <el-col >
                        <el-form-item label="LSB:" >
                          <el-input clearable size="mini" style="width:200px"
                                    v-model="addFieldForm.LSB"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col >
                        <el-form-item label="MSB:" >
                          <el-input clearable size="mini" style="width:200px"
                                    v-model="addFieldForm.MSB"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :span="24" type="flex" justify="space-around">
                      <el-col>
                        <el-form-item label="最小值:">
                          <el-input clearable size="mini" style="width:200px"
                                    v-model="addFieldForm.MinValue"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col>
                        <el-form-item label="最大值:">
                          <el-input clearable size="mini" style="width:200px"
                                    v-model="addFieldForm.MaxValue"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :span="24" type="flex" justify="space-around">
                      <el-col>
                        <el-form-item label="初始值:">
                          <el-input clearable size="mini" style="width:200px"
                                    v-model="addFieldForm.OriginalValue"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="20">
                        <el-form-item label="域描述:">
                          <el-input style="margin-left: 70px" type="textarea" :rows="4"
                                    v-model="addFieldForm.FieldDescribe"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="addFieldValue=false">取 消</el-button>
                    <el-button @click="saveAddField('addFieldForm')" type="primary">确 定</el-button>
                  </div>
                </el-dialog>
              </el-col>
            </el-row>
          </div>
          <div class="FieldTable">
            <!--<el-col style="width: 300px;margin: 0 0 10px 50px">-->
            <!--<el-input size="mini" placeholder="输入关键字查询" clearable></el-input>-->
            <!--</el-col>-->
            <el-table style="width:99%;" :data="FieldTable" border size="mini" max-height="400"
                      :header-cell-style="getRowClass">
              <!--<el-table-column type="selection" align="center"></el-table-column>-->
              <el-table-column label="域ID" type="index" align="center" width="80px"></el-table-column>
              <el-table-column label="域名称" prop="FieldName" align="center"></el-table-column>
              <el-table-column type="expand" prop="FieldDescribe" label="域描述" width="100">
                <template slot-scope="props">
                  <el-form label-position="left" class="demo-table-expand">
                    <el-form-item label="域描述:">
                      <span>{{ props.row.FieldDescribe }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="规范号" prop="FieldNorm" align="center"></el-table-column>
              <el-table-column label="长度" prop="FieldLength" align="center"></el-table-column>
              <el-table-column label="数据类型" prop="DataType" align="center"></el-table-column>
              <el-table-column label="操作" align="center" width="200px">
                <template slot-scope="scope">
                  <el-button size="mini" :disabled="scope.$index===0"
                             @click="moveUp(scope.$index,scope.row,FieldTable)"><i class="el-icon-arrow-up"></i>
                  </el-button>
                  <el-button size="mini" :disabled="scope.$index===(FieldTable.length-1)"
                             @click="moveDown(scope.$index,scope.row,FieldTable)"><i class="el-icon-arrow-down"></i>
                  </el-button>
                  <el-button size="mini" type="danger" @click="removeOne(scope.$index,scope.row,FieldTable)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="SaveRemove">
            <el-row type="flex" justify="center">
              <el-col style="text-align: center">
                <el-button type="primary" @click="saveSignalData" size="medium">保存</el-button>
                <el-button type="danger" @click="delSignalData" size="medium">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <!--域编辑-->
      <div class="edit-middle" v-show="FieldEditValue">
        <div class="baseInfoField">
          <div>
            <el-row type="flex" justify="center">
              <el-col style="text-align: center">
                <span>域信息</span>
              </el-col>
            </el-row>
          </div>
          <div style="margin-top:10px">
            <el-form :model="FieldBaseInfoForm" ref="FieldBaseInfoForm" label-width="90px" :label-position="labelPosition">
              <el-row :span="24" type="flex" justify="space-around">
                <el-col>
                  <el-form-item label="创建者:" size="mini">
                    <span>{{FieldBaseInfoForm.CreateMan}}</span>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="创建日期:" size="mini">
                    <span>{{FieldBaseInfoForm.CreateDate}}</span>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="修改者:" size="mini">
                    <span>{{FieldBaseInfoForm.ModifyMan}}</span>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="修改日期:" size="mini">
                    <span>{{FieldBaseInfoForm.ModifyDate}}</span>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="所属信号:" size="mini">
                    <span>{{FieldBaseInfoForm.BelongtoSignal}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24" type="flex" justify="space-around">
                <el-col>
                  <el-form-item label="域名称:">
                    <el-input clearable size="mini" style="width:200px"
                              v-model="FieldBaseInfoForm.FieldName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="规范号:">
                    <el-input clearable size="mini" style="width:200px"
                              v-model="FieldBaseInfoForm.FieldNorm"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24" type="flex" justify="space-around">
                <el-col>
                  <el-form-item label="域长度:">
                    <el-input clearable size="mini" style="width:200px"
                              v-model="FieldBaseInfoForm.FieldLength"></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="数据类型:">
                    <el-select v-model="FieldBaseInfoForm.DataType" size="mini" clearable style="width:200px">
                      <el-option label="Float" value="Float"></el-option>
                      <el-option label="Double" value="Double"></el-option>
                      <el-option label="BOOLEAN" value="BOOLEAN"></el-option>
                      <el-option label="ENUM" value="ENUM"></el-option>
                      <el-option label="BCD" value="BCD"></el-option>
                      <el-option label="STRING" value="STRING"></el-option>
                      <el-option label="UNSIGED INT" value="UNSIGED INT"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24" type="flex" justify="space-around">
                <el-col>
                  <el-form-item label="单位:">
                    <el-input clearable size="mini" style="width:200px" v-model="FieldBaseInfoForm.Unit"></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="分辨率:">
                    <el-input clearable size="mini" style="width:200px"
                              v-model="FieldBaseInfoForm.Resolution"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24" type="flex" justify="space-around">
                <el-col >
                  <el-form-item  label="LSB:">
                    <el-input clearable size="mini" style="width:200px" v-model="FieldBaseInfoForm.LSB"></el-input>
                  </el-form-item>
                </el-col>
                <el-col >
                  <el-form-item  label="MSB:">
                    <el-input clearable size="mini" style="width:200px" v-model="FieldBaseInfoForm.MSB"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24" type="flex" justify="space-around">
                <el-col>
                  <el-form-item label="最小值:">
                    <el-input clearable size="mini" style="width:200px"
                              v-model="FieldBaseInfoForm.MinValue"></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="最大值:">
                    <el-input clearable size="mini" style="width:200px"
                              v-model="FieldBaseInfoForm.MaxValue"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24" type="flex" justify="space-around">
                <el-col>
                  <el-form-item label="初始值:">
                    <el-input clearable size="mini" style="width:200px"
                              v-model="FieldBaseInfoForm.OriginalValue"></el-input>
                  </el-form-item>
                </el-col>
                <el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="域描述:">
                    <el-input type="textarea" :rows="4" v-model="FieldBaseInfoForm.FieldDescribe"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="SaveRemove">
            <el-row type="flex" justify="center">
              <el-col style="text-align: center">
                <el-button type="primary" @click="saveFieldData" size="medium">保存</el-button>
                <el-button type="danger" @click="delFieldData" size="medium">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <!--<div class="edit-right">-->
      <!--<div class="right-tree">-->
      <!--<el-tree class="EditTreeClass" :data="LeftTreeData" :props="defaultProps" @node-click="handleNodeClick($event)" -->
      <!--:highlight-current='true' -->
      <!--&gt;-->
      <!--</el-tree>-->
      <!--</div>-->
      <!--</div>-->
    </div>

  </div>
</template>
<script>
  let id = 1000
  import {getCurrentTime, MoveUp, MoveDown, removeOneData} from '../../assets/JS/Funcs'

  export default {
    data() {
      return {
        LeftTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        //默认展示的信息表单
        MessageBaseInfoForm: {
          BusType: '',
          CreateMan: '',
          CreateDate: '',
          ModifyMan: '',
          ModifyDate: '',
          MessageName: '',
          MessageNorm: '',
          BigSmallPort: '',
          MessageLength: '',
          TransportMode: '',
          TransportPeriod: '',
          Source: '',
          Purpose: '',
          Interrupt: '',
          Rewrite: '',
          MaxDelay: '',
          SystemState: '',
          MessageDescribe: ''
        },
        SystemInfoForm: {
          CreateMan: '',
          CreateDate: '',
          ModifyMan: '',
          ModifyDate: '',
          SystemName: '',
          SystemShortName: '',
          SystemNorm: '',
          SystemDescribe: ''
        },
        DeviceInfoForm: {
          CreateMan: '',
          CreateDate: '',
          ModifyMan: '',
          ModifyDate: '',
          DeviceName: '',
          DeviceNorm: '',
          DeviceDescribe: ''
        },
        BusInfoForm: {
          CreateMan: '',
          CreateDate: '',
          ModifyMan: '',
          ModifyDate: '',
          BusName: '',
          BusType: ''
        },
        NodeInfoForm: {
          CreateMan: '',
          CreateDate: '',
          ModifyMan: '',
          ModifyDate: '',
          NodeName: '',
          NodeDescribe: ''
        },
        SignalBaseInfoForm: {
          CreateMan: '',
          CreateDate: '',
          ModifyMan: '',
          ModifyDate: '',
          SignalName: '',
          SignalStart: '',
          SignalNorm: '',
          SignalLength: '',
          SignalDescribe: ''
        },
        FieldBaseInfoForm: {
          CreateMan: '',
          CreateDate: '',
          ModifyMan: '',
          ModifyDate: '',
          BelongtoSignal: '',
          FieldName: '',
          FieldNorm: '',
          FieldLength: '',
          DataType: '',
          Unit: '',
          Resolution: '',
          LSB: '',
          MSB: '',
          MaxValue: '',
          MinValue: '',
          OriginalValue: '',
          FieldDescribe: ''
        },

        //点击新增弹出来的表单
        addSystemForm: {
          CreateMan: '',
          CreateDate: '',
          ModifyMan: '',
          ModifyDate: '',
          SystemName: '',
          SystemShortName: '',
          SystemNorm: '',
          SystemDescribe: ''
        },
        addDeviceForm: {
          CreateMan: '',
          CreateDate: '',
          ModifyMan: '',
          ModifyDate: '',
          DeviceName: '',
          DeviceNorm: '',
          DeviceDescribe: ''
        },
        addBusForm: {
          CreateMan: '',
          CreateDate: '',
          ModifyMan: '',
          ModifyDate: '',
          BusType: '',
          BusName: '',
        },
        addNodeForm: {
          CreateMan: '',
          CreateDate: '',
          ModifyMan: '',
          ModifyDate: '',
          NodeDescribe: '',
          NodeName: '',
        },
        addMsgForm: {
          CreateMan: '',
          CreateDate: '',
          ModifyMan: '',
          ModifyDate: '',
          MessageName: '',
          MessageNorm: '',
          BigSmallPort: '',
          MessageLength: '',
          TransportMode: '',
          TransportPeriod: '',
          Source: '',
          Purpose: '',
          Interrupt: '',
          Rewrite: '',
          MaxDelay: '',
          SystemState: '',
          MessageDescribe: ''
        },
        addSignalForm: {
          CreateMan: '',
          CreateDate: '',
          ModifyMan: '',
          ModifyDate: '',
          SignalName: '',
          SignalStart: '',
          SignalNorm: '',
          SignalLength: '',
          SignalDescribe: ''
        },
        addFieldForm: {
          CreateMan: '',
          CreateDate: '',
          ModifyMan: '',
          ModifyDate: '',
          FieldName: '',
          FieldNorm: '',
          FieldLength: '',
          DataType: '',
          Unit: '',
          Resolution: '',
          LSB: '',
          MSB: '',
          MaxValue: '',
          MinValue: '',
          OriginalValue: '',
          FieldDescribe: ''
        },

        labelPosition: 'left',
        //表格数据
        SystemTable:[],
        DeviceTable:[],
        BusTable:[],
        NodeTable:[],
        MessageTable:[],
        SignalTable:[],
        FieldTable:[],
        //默认显示的值
        clickRowId:1,
        step:0,
        AllEditValue: true,
        SystemEditValue: false,
        ProjectEditValue: false,
        BusEditValue: false,
        DeviceEditValue: false,
        MessageEditValue: false,
        SignalEditValue: false,
        FieldEditValue: false,
        //点击新增 表单dialog是否显示
        showAddSystemValue: false,
        showAddDeviceValue: false,
        showAddBusValue: false,
        showAddNodeVlaue: false,
        showAddMsgVlaue: false,
        addSignalValue: false,
        addFieldValue: false,

        //复用是否选择复用
        isReuesMessage: false,
        isReuseSignal: false,
        messageVisible: false,
        signalVisible: false,
        searchMessage:'',
        searchSignal:'',
        //复用数据表格
        reuseMessageTable: [],

        reuseSignalTable: [],

      }
    },
    methods: {
      //测试数据
      TextData(){
        // this.LeftTreeData=[
        //   {
        //     label: '所有',
        //     type: 'All',
        //     tier:'1',
        //     children: [
        //       {
        //         label: '系统一',
        //         type: 'System',
        //         tier:'2',
        //         children:
        //           [
        //             {
        //               label: '设备一',
        //               type: 'Device',
        //               tier:'3',
        //               children:
        //                 [
        //                   {
        //                     label: "RS422",
        //                     type: 'Bus',
        //                     tier:'4',
        //                     children: [
        //                       {
        //                         label: 'Node1#RSS422#1#CH1',
        //                         type: 'Project',
        //                         tier:'5',
        //                         children:
        //                           [
        //                             {
        //                               label: 'Demo_Message_001',
        //                               type: 'Message',
        //                               tier:'6',
        //                               children:
        //                                 [
        //                                   {
        //                                     label: 'Signal_05_header',
        //                                     type: "Signal",
        //                                     tier:'7',
        //                                     children: [
        //                                       {
        //                                         tier:'8',
        //                                         label: 'Field_laatitudea',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         tier:'8',
        //                                         label: 'Field_laatitudeb',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudec',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatituded',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudee',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   },
        //                                   {
        //                                     label: 'Signal_06_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatitudef',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudeg',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudeh',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudei',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudej',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   },
        //                                   {
        //                                     label: 'Signal_07_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatitudek',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudel',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudem',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatituden',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudeo',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   },
        //                                   {
        //                                     label: 'Signal_08_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatitudep',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudeq',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatituder',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudes',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudet',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   }
        //                                 ]
        //                             },
        //                             {
        //                               label: 'Demo_Message_002',
        //                               type: 'Message',
        //                               children:
        //                                 [
        //                                   {
        //                                     label: 'Signal_09_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatitudeu',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudev',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudew',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudex',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudey',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   },
        //                                   {
        //                                     label: 'Signal_10_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatitudez',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudea1',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudea2',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudea3',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudea4',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   },
        //                                   {
        //                                     label: 'Signal_11_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatitudea5',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudea6',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudea7',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudea8',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudea9',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   },
        //                                   {
        //                                     label: 'Signal_12_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatitudeb1',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudeb2',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudeb3',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudeb4',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudeb5',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   }
        //                                 ]
        //                             },
        //                             {
        //                               id: 9,
        //                               label: 'Demo_Message_003',
        //                               type: 'Message',
        //                               children:
        //                                 [
        //                                   {
        //                                     label: 'Signal_13_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatitudeb6',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudeb7',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudeb8',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudeb9',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudec1',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   },
        //                                   {
        //                                     label: 'Signal_14_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatitudec2',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudec3',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudec4',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudec5',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudec6',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   },
        //                                   {
        //                                     label: 'Signal_15_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatitudec7',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudec8',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudec9',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitudec10',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatituded1',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   },
        //                                   {
        //                                     label: 'Signal_16_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatituded2',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatituded3',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatituded4',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatituded5',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatituded6',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   }
        //                                 ]
        //                             },
        //                             {
        //                               id: 10,
        //                               label: 'Demo_Message_004',
        //                               type: 'Message',
        //                               children:
        //                                 [
        //                                   {
        //                                     label: 'Signal_01_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatitude1',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude2',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude3',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude4',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude5',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   },
        //                                   {
        //                                     label: 'Signal_02_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatitude22',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude33',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude44',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude55',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude66',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   },
        //                                   {
        //                                     label: 'Signal_03_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatitude77',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude88',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude99',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude00',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   },
        //                                   {
        //                                     label: 'Signal_04_header',
        //                                     type: "Signal",
        //                                     children: [
        //                                       {
        //                                         label: 'Field_laatitude111',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude222',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude333',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude444',
        //                                         type: 'Field'
        //                                       },
        //                                       {
        //                                         label: 'Field_laatitude555',
        //                                         type: 'Field'
        //                                       },
        //                                     ]
        //                                   }
        //                                 ]
        //                             }
        //                           ]
        //                       }
        //                     ]
        //                   }
        //                 ]
        //             },
        //             {
        //               id: 5,
        //               label: '设备二',
        //               children:
        //                 [
        //                   {
        //                     label: '29850:VL_AGS1_General',
        //                     children:
        //                       [
        //                         {
        //                           label: 'UDP Dest:34881 MSG Name:AGS_General_02_1',
        //                           children:
        //                             [
        //                               {
        //                                 label: '0012_FDS_ECS_Pressure_Demand',
        //                                 children: [
        //                                   {label: '0012_01_32_FDS_ECS_Pressure_Demand_1'}
        //                                 ]
        //                               },
        //                               {
        //                                 label: '0020_FDS_AGS_Status',
        //                                 children: [
        //                                   {label: '0032_15_01_FWD_Cargo_Cooling_Command_On_1'}
        //                                 ]
        //                               },
        //                             ]
        //                         }
        //                       ]
        //                   }
        //                 ]
        //             },
        //           ]
        //       },
        //       {
        //         id: 2,
        //         label: 'TDM Exploer',
        //         children: [{
        //           label: '二级 2-1',
        //           children: [{
        //             label: '三级 2-1-1'
        //           }]
        //         }, {
        //           label: '二级 2-2',
        //           children: [{
        //             label: '三级 2-2-1'
        //           }]
        //         }]
        //       },
        //       {
        //         id: 3,
        //         label: 'Django Exploer',
        //         children: [{
        //           label: '二级 3-1',
        //           children: [{
        //             label: '三级 3-1-1'
        //           }]
        //         }, {
        //           label: '二级 3-2',
        //           children: [{
        //             label: '三级 3-2-1'
        //           }]
        //         }]
        //       }
        //     ]
        //   }
        // ];
        this.SystemTable= [
          {SystemName: '2sdf34', SystemShortName: '2s', SystemNorm: '001', SystemDescribe: 'AAA'},
          {SystemName: '12', SystemShortName: '2s', SystemNorm: '001', SystemDescribe: 'AAA'},
          {SystemName: '123', SystemShortName: '2s', SystemNorm: '001', SystemDescribe: 'AAA'},
        ];
        this.DeviceTable= [
          {DeviceName: '设备一', DeviceNorm: '001', DeviceDescribe: 'AAA'},
          {DeviceName: '设备二', DeviceNorm: '001', DeviceDescribe: 'AAA'},
          {DeviceName: '设备三', DeviceNorm: '001', DeviceDescribe: 'AAA'},
          {DeviceName: '设备四', DeviceNorm: '001', DeviceDescribe: 'AAA'}
        ];
        this.BusTable= [
          {BusName: '总线一', BusType: 'c3'},
          {BusName: '总线二', BusType: 'b2'},
          {BusName: '总线三', BusType: 'a1'}

        ];
        this.NodeTable= [
          {NodeName: '设备节点一', NodeDescribe: '设备节点描述1'},
          {NodeName: '设备节点er', NodeDescribe: '设备节点描述2'},
          {NodeName: '设备节点san', NodeDescribe: '设备节点描述3'},

        ];
        this.MessageTable= [
          {MessageName: '123', MessageLength: 10, MessageNorm: 'AAA',MessageDescribe:'这是消息'},
          {MessageName: 'iop1232ml23', MessageLength: 10, MessageNorm: 'AAA',MessageDescribe:'这是消息'},
          {MessageName: 'iopsadml23', MessageLength: 10, MessageNorm: 'AAA',MessageDescribe:'这是消息'},
          {MessageName: 'iopasdl23', MessageLength: 10, MessageNorm: 'AAA',MessageDescribe:'这是消息'},
          {MessageName: 'iopmasdl23', MessageLength: 10, MessageNorm: 'AAA',MessageDescribe:'这是消息'},
          {MessageName: 'iopmasdl23', MessageLength: 10, MessageNorm: 'AAA',MessageDescribe:'这是消息'},
          {MessageName: 'iopasdml23', MessageLength: 10, MessageNorm: 'AAA',MessageDescribe:'这是消息'},

        ];
        this.SignalTable= [
          {SignalName: '1DSF', SignalStart: 7, SignalLength: 12, SignalDescribe: 'ERD1', SignalNorm: '100'},
          {SignalName: '2DSF', SignalStart: 6, SignalLength: 12, SignalDescribe: 'ERD1', SignalNorm: '100'},
          {SignalName: '3DSF', SignalStart: 3, SignalLength: 12, SignalDescribe: 'ERD1', SignalNorm: '100'},
          {SignalName: '4DSF', SignalStart: 3, SignalLength: 12, SignalDescribe: 'ERD1', SignalNorm: '100'},
        ];
        this.FieldTable= [
          {FieldName: '1DSF', FieldNorm: 7, FieldLength: 12, FieldDescribe: 'ERD1', DataType: 'Float'},
          {FieldName: '2DSF', FieldNorm: 7, FieldLength: 12, FieldDescribe: 'ERD1', DataType: 'Double'},
          {FieldName: '3DSF', FieldNorm: 7, FieldLength: 12, FieldDescribe: 'ERD1', DataType: 'Float'},
          {FieldName: '4DSF', FieldNorm: 7, FieldLength: 12, FieldDescribe: 'ERD1', DataType: 'Double'},
          {FieldName: '5DSF', FieldNorm: 7, FieldLength: 12, FieldDescribe: 'ERD1', DataType: 'Float'}
        ];
        this.reuseMessageTable= [
          {MessageName: '消息1', MessageLength: '10',MessageNorm:'规范号001',MessageDescribe:'这是一条消息'},
          {MessageName: '消息2', MessageLength: '20',MessageNorm:'规范号002',MessageDescribe:'这是2条消息'},
          {MessageName: '消息3', MessageLength: '30',MessageNorm:'规范号003',MessageDescribe:'这是一条消息'},
        ];
        this.reuseSignalTable= [
          {SignalName: '信号1', SignalStart: '7', SignalLength: '10', reSignalDescribe: '2DSF'},
          {SignalName: '信号2', SignalStart: '6', SignalLength: '20', reSignalDescribe: '2DSF'},
          {SignalName: '信号3', SignalStart: '5', SignalLength: '30', reSignalDescribe: '2DSF'},
        ];
      },
      //封装的方法
      getTime() {
        return getCurrentTime()
      },
      moveUp(i, j, k) {
        MoveUp(i, j, k)
      },
      moveDown(i, j, k) {
        MoveDown(i, j, k)
      },
      removeOne(i, j, k) {
        removeOneData(i, j, k)
      },
      //表格表头样式
      getRowClass({row, column, rowIndex, columnIndex}) {
        if (rowIndex == 0) {
          return 'background:#003366;color:white;font-size:14px;'
        } else {
          return ''
        }
      },
      //隐藏所有模块
      hideAllEditMode() {
        this.AllEditValue = false;
        this.SystemEditValue = false;
        this.DeviceEditValue = false;
        this.BusEditValue = false;
        this.ProjectEditValue = false;
        this.MessageEditValue = false;
        this.SignalEditValue = false;
        this.FieldEditValue = false;
      },
      //保存点击增加一个表单的信息
      saveAddSystem(formName) {
        this.$refs[formName].validate((valid) => {
        if (valid) {
          var temp = []
          for(let i =0 ;i<this.SystemTable.length;i++){
            temp.push(this.SystemTable[i].SystemName)
          }
          if(temp.indexOf(this.addSystemForm.SystemName)>-1){
            this.$message.error('该系统名已经存在，请修改！');
          }else {
            this.showAddSystemValue = false
            var tempObj = {
              SystemName: this.addSystemForm.SystemName,
              SystemShortName: this.addSystemForm.SystemShortName,
              SystemNorm: this.addSystemForm.SystemNorm,
              SystemDescribe: this.addSystemForm.SystemDescribe,
              CreateDate: this.getTime(),
              CreateMan: sessionStorage.getItem('User'),
              ID:0,
            }
            this.SystemTable.push(tempObj)
          }
        } else {
          this.$message.error('请填写完整信息！');
          return false;
        }
      });
      },
      saveAddDevice(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var temp = []
            for(let i =0 ;i<this.DeviceTable.length;i++){
              temp.push(this.DeviceTable[i].DeviceName)
            }
            if(temp.indexOf(this.addDeviceForm.DeviceName)>-1){
              this.$message.error('该设备名已经存在，请修改！');
            }else {
              this.showAddDeviceValue = false
              var tempObj = {
                DeviceName: this.addDeviceForm.DeviceName,
                DeviceNorm: this.addDeviceForm.DeviceNorm,
                DeviceDescribe: this.addDeviceForm.DeviceDescribe,
                CreateDate: this.getTime(),
                CreateMan: sessionStorage.getItem('User'),
                ID:0,
              }
              this.DeviceTable.push(tempObj)
            }
          } else {
            this.$message.error('请填写完整信息！');
            return false;
          }
        });
      },
      saveAddBus(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var temp = []
            for(let i =0 ;i<this.BusTable.length;i++){
              temp.push(this.BusTable[i].BusName)
            }
            if(temp.indexOf(this.addBusForm.BusName)>-1){
              this.$message.error('该总线名已经存在，请修改！');
            }else {
              this.showAddBusValue = false
              var tempObj = {
                BusName: this.addBusForm.BusName,
                BusType: this.addBusForm.BusType,
                CreateDate: this.getTime(),
                CreateMan: sessionStorage.getItem('User'),
                ID:0,
              }
              this.BusTable.push(tempObj)
            }
          } else {
            this.$message.error('请填写完整信息！');
            return false;
          }
        });

      },
      saveAddNode(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var temp = []
            for(let i =0 ;i<this.NodeTable.length;i++){
              temp.push(this.NodeTable[i].NodeName)
            }
            if(temp.indexOf(this.addNodeForm.NodeName)>-1){
              this.$message.error('该设备节点名已经存在，请修改！');
            }else {
              this.showAddNodeVlaue = false
              var tempObj = {
                NodeName: this.addNodeForm.NodeName,
                NodeDescribe: this.addNodeForm.NodeDescribe,
                CreateDate: this.getTime(),
                CreateMan: sessionStorage.getItem('User'),
                ID:0,
              }
              this.NodeTable.push(tempObj)
            }
          } else {
            this.$message.error('请填写完整信息！');
            return false;
          }
        });
      },
      saveAddMsg(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var temp = []
            for(let i =0 ;i<this.MessageTable.length;i++){
              temp.push(this.MessageTable[i].NodeName)
            }
            if(temp.indexOf(this.addMsgForm.MessageName)>-1){
              this.$message.error('该消息名已经存在，请修改！');
            }else {
              this.showAddMsgVlaue = false
              var tempObj = {
                MessageName: this.addMsgForm.MessageName,
                MessageNorm:this.addMsgForm.MessageNorm,
                StandardNumber: this.addMsgForm.StandardNumber,
                MessageLength: this.addMsgForm.MessageLength,
                CreateDate: this.getTime(),
                CreateMan: sessionStorage.getItem('User'),
                ID:0,
              }
              this.MessageTable.push(tempObj)
            }
          } else {
            this.$message.error('请填写完整信息！');
            return false;
          }
        });

      },
      saveAddSignal(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var temp = []
            for(let i =0 ;i<this.SignalTable.length;i++){
              temp.push(this.SignalTable[i].SignalName)
            }
            if(temp.indexOf(this.addSignalForm.SignalName)>-1){
              this.$message.error('该信号名已经存在，请修改！');
            }else {
              this.addSignalValue = false
              var tempObj = {
                SignalName: this.addSignalForm.SignalName,
                SignalNorm: this.addSignalForm.SignalNorm,
                SignalStart: this.addSignalForm.SignalStart,
                SignalLength: this.addSignalForm.SignalLength,
                SignalDescribe: this.addSignalForm.SignalDescribe,
                CreateDate: this.getTime(),
                CreateMan: sessionStorage.getItem('User'),
                ID:0,
              }
              this.SignalTable.push(tempObj)
            }
          } else {
            this.$message.error('请填写完整信息！');
            return false;
          }
        });

      },
      saveAddField(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var temp = []
            for(let i =0 ;i<this.FieldTable.length;i++){
              temp.push(this.FieldTable[i].FieldName)
            }
            if(temp.indexOf(this.addFieldForm.FieldName)>-1){
              this.$message.error('该域名已经存在，请修改！');
            }else {
              this.addFieldValue = false
              var tempObj = {
                FieldName: this.addFieldForm.FieldName,
                FieldNorm: this.addFieldForm.FieldNorm,
                FieldLength: this.addFieldForm.FieldLength,
                DataType: this.addFieldForm.DataType,
                Unit: this.addFieldForm.Unit,
                Resolution: this.addFieldForm.Resolution,
                LSB: this.addFieldForm.LSB,
                MSB: this.addFieldForm.MSB,
                MaxValue: this.addFieldForm.MaxValue,
                MinValue: this.addFieldForm.MinValue,
                OriginalValue: this.addFieldForm.OriginalValue,
                FieldDescribe: this.addFieldForm.FieldDescribe,
                CreateDate: this.getTime(),
                CreateMan: sessionStorage.getItem('User'),
                ID:0,
              }
              this.FieldTable.push(tempObj)
            }
          } else {
            this.$message.error('请填写完整信息！');
            return false;
          }
        });

      },
      //点击树节点
      editTreeClick(event) {
        this.clickRowId = event.ID
        // console.log(event)
        var that = this;
        if (event.tier == '1') {
          that.getDefaultTree()
          that.hideAllEditMode()
          that.AllEditValue = true;
          that.step = 0
        } else if (event.tier == '2') {
          that.getSystemNode(event)
          that.hideAllEditMode()
          that.SystemEditValue = true;
          that.step = 1
        } else if (event.tier == '3') {
          that.getDeviceNode(event)
          that.hideAllEditMode()
          that.DeviceEditValue = true;
          that.step = 2
        } else if (event.tier == '4') {
          that.getBusNode(event)
          that.hideAllEditMode()
          that.BusEditValue = true;
          that.step = 3
        } else if (event.tier == '5') {
          that.getProjectNode(event)
          that.hideAllEditMode()
          that.ProjectEditValue = true;
          that.step = 4
        } else if (event.tier == '6') {
          that.getMessageNode(event)
          that.hideAllEditMode()
          that.MessageEditValue = true;
          that.step = 5
        } else if (event.tier == '7') {
          that.getSignalNode(event)
          that.hideAllEditMode()
          that.SignalEditValue = true;
          that.step = 6
        } else if (event.tier == '8') {
          that.getFieldNode(event)
          that.hideAllEditMode()
          that.FieldEditValue = true;
          that.step = 7
        }
      },
      // 获取默认树结构
      getDefaultTree() {
        this.axios.post('/allNode', {
          state: 0,
          tree:[],
          ID:'1'
        }).then((res) => {
          // console.log(res)
          this.LeftTreeData = res.data[0].tree
          this.SystemTable = res.data[0].content.tableList
        }).catch((err) => {
          console.log(err)
        })
      },
      // 请求系统节点
      getSystemNode(e) {
        let that = this
        this.axios.post('/system', {
          tree: this.LeftTreeData,
          ID: e.ID,
          state: 0
        }).then((res) => {
          // console.log(res)
          that.LeftTreeData = res.data[0].tree
          that.DeviceTable = res.data[0].content.tableList
          that.SystemInfoForm.CreateMan = res.data[0].content.CreateMan
          that.SystemInfoForm.CreateDate = res.data[0].content.CreateDate
          that.SystemInfoForm.ModifyMan = res.data[0].content.ModifyMan
          that.SystemInfoForm.ModifyDate = res.data[0].content.ModifyDate
          that.SystemInfoForm.SystemName = res.data[0].content.SystemName
          that.SystemInfoForm.SystemShortName = res.data[0].content.SystemShortName
          that.SystemInfoForm.SystemNorm = res.data[0].content.SystemNorm
          that.SystemInfoForm.SystemDescribe = res.data[0].content.SystemDescribe
        }).catch((err) => {
          console.log(err)
        })
      },
      //请求设备节点
      getDeviceNode(e) {
        let that = this
        this.axios.post('/device', {
          tree: this.LeftTreeData,
          ID: e.ID,
          state: 0
        }).then((res) => {
          // console.log(res)
          that.LeftTreeData = res.data[0].tree
          that.BusTable = res.data[0].content.tableList
          that.DeviceInfoForm.CreateMan = res.data[0].content.CreateMan
          that.DeviceInfoForm.CreateDate = res.data[0].content.CreateDate
          that.DeviceInfoForm.ModifyMan = res.data[0].content.ModifyMan
          that.DeviceInfoForm.ModifyDate = res.data[0].content.ModifyDate
          that.DeviceInfoForm.DeviceName = res.data[0].content.DeviceName
          that.DeviceInfoForm.DeviceNorm = res.data[0].content.DeviceNorm
          that.DeviceInfoForm.DeviceDescribe = res.data[0].content.DeviceDescribe
        }).catch((err) => {
          console.log(err)
        })
      },
      //请求总线节点
      getBusNode(e) {
        let that = this
        this.axios.post('/bus', {
          tree: this.LeftTreeData,
          ID: e.ID,
          state: 0
        }).then((res) => {
          // console.log(res)
          that.LeftTreeData = res.data[0].tree
          that.NodeTable = res.data[0].content.tableList
          that.BusInfoForm.CreateMan = res.data[0].content.CreateMan
          that.BusInfoForm.CreateDate = res.data[0].content.CreateDate
          that.BusInfoForm.ModifyMan = res.data[0].content.ModifyMan
          that.BusInfoForm.ModifyDate = res.data[0].content.ModifyDate
          that.BusInfoForm.BusName = res.data[0].content.BusName
          that.BusInfoForm.BusType = res.data[0].content.BusType
        }).catch((err) => {
          console.log(err)
        })
      },
      //请求设备子节点
      getProjectNode(e) {
        let that = this
        this.axios.post('/deviceNode', {
          tree: this.LeftTreeData,
          ID: e.ID,
          state: 0
        }).then((res) => {
          // console.log(res)
          that.LeftTreeData = res.data[0].tree
          that.MessageTable = res.data[0].content.tableList
          that.NodeInfoForm.CreateMan = res.data[0].content.CreateMan
          that.NodeInfoForm.CreateDate = res.data[0].content.CreateDate
          that.NodeInfoForm.ModifyMan = res.data[0].content.ModifyMan
          that.NodeInfoForm.ModifyDate = res.data[0].content.ModifyDate
          that.NodeInfoForm.NodeName = res.data[0].content.NodeName
          that.NodeInfoForm.NodeDescribe = res.data[0].content.NodeDescribe
        }).catch((err) => {
          console.log(err)
        })
      },
      //请求消息节点
      getMessageNode(e) {
        let that = this
        this.axios.post('/message', {
          tree: this.LeftTreeData,
          ID: e.ID,
          state: 0
        }).then((res) => {
          console.log(res)
          that.LeftTreeData = res.data[0].tree
          that.SignalTable = res.data[0].content.tableList
          that.MessageBaseInfoForm.CreateMan = res.data[0].content.CreateMan
          that.MessageBaseInfoForm.CreateDate = res.data[0].content.CreateDate
          that.MessageBaseInfoForm.ModifyMan = res.data[0].content.ModifyMan
          that.MessageBaseInfoForm.ModifyDate = res.data[0].content.ModifyDate
          that.MessageBaseInfoForm.MessageName = res.data[0].content.MessageName
          that.MessageBaseInfoForm.MessageNorm = res.data[0].content.MessageNorm
          that.MessageBaseInfoForm.BigSmallPort = res.data[0].content.BigSmallPort
          that.MessageBaseInfoForm.MessageLength = res.data[0].content.MessageLength
          that.MessageBaseInfoForm.TransportMode = res.data[0].content.TransportMode
          that.MessageBaseInfoForm.TransportPeriod = res.data[0].content.TransportPeriod
          that.MessageBaseInfoForm.Source = res.data[0].content.Source
          that.MessageBaseInfoForm.Purpose = res.data[0].content.Purpose
          that.MessageBaseInfoForm.Interrupt = res.data[0].content.Interrupt
          that.MessageBaseInfoForm.Rewrite = res.data[0].content.Rewrite
          that.MessageBaseInfoForm.MaxDelay = res.data[0].content.MaxDelay
          that.MessageBaseInfoForm.SystemState = res.data[0].content.SystemState
          that.MessageBaseInfoForm.MessageDescribe = res.data[0].content.MessageDescribe
        }).catch((err) => {
          console.log(err)
        })
      },
      //请求信号节点
      getSignalNode(e) {
        let that = this
        this.axios.post('/signal', {
          tree: this.LeftTreeData,
          ID: e.ID,
          state: 0
        }).then((res) => {
          console.log(res)
          that.LeftTreeData = res.data[0].tree
          that.FieldTable = res.data[0].content.tableList
          that.SignalBaseInfoForm.CreateMan = res.data[0].content.CreateMan
          that.SignalBaseInfoForm.CreateDate = res.data[0].content.CreateDate
          that.SignalBaseInfoForm.ModifyMan = res.data[0].content.ModifyMan
          that.SignalBaseInfoForm.ModifyDate = res.data[0].content.ModifyDate
          that.SignalBaseInfoForm.SignalName = res.data[0].content.SignalName
          that.SignalBaseInfoForm.SignalStart = res.data[0].content.SignalStart
          that.SignalBaseInfoForm.SignalNorm = res.data[0].content.SignalNorm
          that.SignalBaseInfoForm.SignalLength = res.data[0].content.SignalLength
          that.SignalBaseInfoForm.SignalDescribe = res.data[0].content.SignalDescribe
        }).catch((err) => {
          console.log(err)
        })
      },
      //请求域节点
      getFieldNode(e) {
        let that = this
        this.axios.post('/field', {
          tree: this.LeftTreeData,
          ID: e.ID,
          state: 0
        }).then((res) => {
          console.log(res)
          that.LeftTreeData = res.data[0].tree
          that.FieldBaseInfoForm.CreateMan = res.data[0].content.CreateMan
          that.FieldBaseInfoForm.CreateDate = res.data[0].content.CreateDate
          that.FieldBaseInfoForm.ModifyMan = res.data[0].content.ModifyMan
          that.FieldBaseInfoForm.ModifyDate = res.data[0].content.ModifyDate
          that.FieldBaseInfoForm.BelongtoSignal = res.data[0].content.BelongtoSignal
          that.FieldBaseInfoForm.FieldName = res.data[0].content.FieldName
          that.FieldBaseInfoForm.FieldNorm = res.data[0].content.FieldNorm
          that.FieldBaseInfoForm.FieldLength = res.data[0].content.FieldLength
          that.FieldBaseInfoForm.DataType = res.data[0].content.DataType
          that.FieldBaseInfoForm.Unit = res.data[0].content.Unit
          that.FieldBaseInfoForm.Resolution = res.data[0].content.Resolution
          that.FieldBaseInfoForm.LSB = res.data[0].content.LSB
          that.FieldBaseInfoForm.MSB = res.data[0].content.MSB
          that.FieldBaseInfoForm.MaxValue = res.data[0].content.MaxValue
          that.FieldBaseInfoForm.MinValue = res.data[0].content.MinValue
          that.FieldBaseInfoForm.OriginalValue = res.data[0].content.OriginalValue
          that.FieldBaseInfoForm.FieldDescribe = res.data[0].content.FieldDescribe
        }).catch((err) => {
          console.log(err)
        })
      },

      //保存信息变动后的整个表格和表单信息
      saveAllData() {
        var that = this
        this.step = 1
        var temp = {
          tableList: this.SystemTable,
        }
        this.axios.post('/allNode', {
          state: 1,
          tree: this.LeftTreeData,
          ID:this.clickRowId,
          content: temp,
        }).then((res) => {
          that.LeftTreeData = res.data[0].tree
          that.SystemTable = res.data[0].content.tableList
        }).catch((err) => {
          console.log(err)
        })
      },
      saveSystemData() {
        var that = this
        this.step = 2
        var temp = {
          tableList: this.DeviceTable,
          ModifyMan: sessionStorage.getItem('User'),
          ModifyDate: this.getTime(),
          CreateMan: this.SystemInfoForm.CreateMan,
          CreateDate: this.SystemInfoForm.CreateDate,
          SystemName: this.SystemInfoForm.SystemName,
          SystemShortName: this.SystemInfoForm.SystemShortName,
          SystemNorm: this.SystemInfoForm.SystemNorm,
          SystemDescribe: this.SystemInfoForm.SystemDescribe
        }
        this.axios.post('/system', {
          state: 1,
          tree: this.LeftTreeData,
          ID:this.clickRowId,
          content: temp,
        }).then((res) => {
          // console.log(res)
          that.LeftTreeData = res.data[0].tree
          that.DeviceTable = res.data[0].content.tableList
        }).catch((err) => {
          console.log(err)
        })
      },
      saveDeviceData() {
        var that = this
        this.step = 3
        var temp = {
          tableList: this.BusTable,
          ModifyMan: sessionStorage.getItem('User'),
          ModifyDate: this.getTime(),
          CreateMan: this.DeviceInfoForm.CreateMan,
          CreateDate: this.DeviceInfoForm.CreateDate,
          DeviceName: this.DeviceInfoForm.DeviceName,
          DeviceNorm: this.DeviceInfoForm.DeviceNorm,
          DeviceDescribe: this.DeviceInfoForm.DeviceDescribe
        }
        this.axios.post('/device', {
          state: 1,
          tree: this.LeftTreeData,
          content: temp,
          ID:this.clickRowId,
        }).then((res) => {
          that.LeftTreeData = res.data[0].tree
          that.BusTable = res.data[0].content.tableList
        }).catch((err) => {
          console.log(err)
        })
      },
      saveBusData() {
        var that = this
        this.step = 4
        var temp = {
          tableList: this.NodeTable,
          ModifyMan: sessionStorage.getItem('User'),
          ModifyDate: this.getTime(),
          CreateMan: this.BusInfoForm.CreateMan,
          CreateDate: this.BusInfoForm.CreateDate,
          BusName: this.BusInfoForm.BusName,
          BusType: this.BusInfoForm.BusType,
        }
        this.axios.post('/bus', {
          state: 1,
          tree: this.LeftTreeData,
          content: temp,
          ID:this.clickRowId,
        }).then((res) => {
          that.LeftTreeData = res.data[0].tree
          that.NodeTable = res.data[0].content.tableList
        }).catch((err) => {
          console.log(err)
        })
      },
      saveNodeData() {
        let that = this
        this.step = 5
        var temp = {
          tableList: this.MessageTable,
          ModifyMan: sessionStorage.getItem('User'),
          ModifyDate: this.getTime(),
          CreateMan: this.NodeInfoForm.CreateMan,
          CreateDate: this.NodeInfoForm.CreateDate,
          NodeName: this.NodeInfoForm.NodeName,
          NodeDescribe: this.NodeInfoForm.NodeDescribe,
        }
        this.axios.post('/deviceNode', {
          state: 1,
          tree: this.LeftTreeData,
          content: temp,
          ID:this.clickRowId,
        }).then((res) => {
          that.LeftTreeData = res.data[0].tree
          that.MessageTable = res.data[0].content.tableList
        }).catch((err) => {
          console.log(err)
        })
      },
      saveMessageData() {
        var that = this
        this.step = 6
        var temp = {
          tableList: this.SignalTable,
          ModifyMan: sessionStorage.getItem('User'),
          ModifyDate: this.getTime(),
          BusType: this.MessageBaseInfoForm.BusType,
          CreateMan: this.MessageBaseInfoForm.CreateMan,
          CreateDate: this.MessageBaseInfoForm.CreateDate,
          MessageName: this.MessageBaseInfoForm.MessageName,
          MessageNorm: this.MessageBaseInfoForm.MessageNorm,
          BigSmallPort: this.MessageBaseInfoForm.BigSmallPort,
          MessageLength: this.MessageBaseInfoForm.MessageLength,
          TransportMode: this.MessageBaseInfoForm.TransportMode,
          TransportPeriod: this.MessageBaseInfoForm.TransportPeriod,
          Source: this.MessageBaseInfoForm.Source,
          Purpose: this.MessageBaseInfoForm.Purpose,
          Interrupt: this.MessageBaseInfoForm.Interrupt,
          Rewrite: this.MessageBaseInfoForm.Rewrite,
          MaxDelay: this.MessageBaseInfoForm.MaxDelay,
          SystemState: this.MessageBaseInfoForm.SystemState,
          MessageDescribe: this.MessageBaseInfoForm.MessageDescribe,
        }
        this.axios.post('/message', {
          state: 1,
          tree: this.LeftTreeData,
          content: temp,
          ID:this.clickRowId,
        }).then((res) => {
          that.LeftTreeData = res.data[0].tree
          that.SignalTable = res.data[0].content.tableList
        }).catch((err) => {
          console.log(err)
        })
      },
      saveSignalData() {
        var that = this
        this.step = 7
        var temp = {
          tableList: this.FieldTable,
          ModifyMan: sessionStorage.getItem('User'),
          ModifyDate: this.getTime(),
          CreateMan: this.SignalBaseInfoForm.CreateMan,
          CreateDate: this.SignalBaseInfoForm.CreateDate,
          SignalName: this.SignalBaseInfoForm.SignalName,
          SignalStart: this.SignalBaseInfoForm.SignalStart,
          SignalNorm:this.SignalBaseInfoForm.SignalNorm,
          SignalLength:this.SignalBaseInfoForm.SignalLength,
          SignalDescribe:this.SignalBaseInfoForm.SignalDescribe,
        }
        this.axios.post('/signal', {
          state: 1,
          tree: this.LeftTreeData,
          content: temp,
          ID:this.clickRowId,
        }).then((res) => {
          that.LeftTreeData = res.data[0].tree
          that.FieldTable = res.data[0].content.tableList
        }).catch((err) => {
          console.log(err)
        })
      },
      saveFieldData() {
        var that = this
        this.step = 8
        var temp = {
          ModifyMan: sessionStorage.getItem('User'),
          ModifyDate: this.getTime(),
          CreateMan: this.FieldBaseInfoForm.CreateMan,
          CreateDate: this.FieldBaseInfoForm.CreateDate,
          BelongtoSignal: this.FieldBaseInfoForm.BelongtoSignal,
          FieldName: this.FieldBaseInfoForm.FieldName,
          FieldNorm: this.FieldBaseInfoForm.FieldNorm,
          FieldLength: this.FieldBaseInfoForm.FieldLength,
          DataType: this.FieldBaseInfoForm.DataType,
          Unit: this.FieldBaseInfoForm.Unit,
          Resolution: this.FieldBaseInfoForm.Resolution,
          LSB: this.FieldBaseInfoForm.LSB,
          MSB: this.FieldBaseInfoForm.MSB,
          MaxValue: this.FieldBaseInfoForm.MaxValue,
          MinValue: this.FieldBaseInfoForm.MinValue,
          OriginalValue: this.FieldBaseInfoForm.OriginalValue,
          FieldDescribe: this.FieldBaseInfoForm.FieldDescribe
        }
        this.axios.post('/field', {
          state: 1,
          tree: this.LeftTreeData,
          content: temp,
          ID:this.clickRowId,
        }).then((res) => {
          that.LeftTreeData = res.data[0].tree
        }).catch((err) => {
          console.log(err)
        })
      },
      //删除当前的节点以及所有数据
      delSystemData() {
        this.axios.post('/system', {
          state: 2,
          tree: this.LeftTreeData,
          ID:this.clickRowId,
        }).then((res) => {
          this.LeftTreeData = res.data[0].tree
          this.hideAllEditMode()
        }).catch((err) => {
          console.log(err)
        })
      },
      delDeviceData() {
        this.axios.post('/system', {
          state: 2,
          tree: this.LeftTreeData,
          ID:this.clickRowId,
        }).then((res) => {
          this.LeftTreeData = res.data[0].tree
          this.hideAllEditMode()
        }).catch((err) => {
          console.log(err)
        })
      },
      delBusData() {
        this.axios.post('/device', {
          state: 2,
          tree: this.LeftTreeData,
          ID:this.clickRowId,
        }).then((res) => {
          this.LeftTreeData = res.data[0].tree
          this.hideAllEditMode()
        }).catch((err) => {
          console.log(err)
        })
      },
      delNodeData() {
        this.axios.post('/bus', {
          state: 2,
          tree: this.LeftTreeData,
          ID:this.clickRowId,
        }).then((res) => {
          this.LeftTreeData = res.data[0].tree
          this.hideAllEditMode()
        }).catch((err) => {
          console.log(err)
        })
      },
      delMessageData() {
        this.axios.post('/message', {
          state: 2,
          tree: this.LeftTreeData,
          ID:this.clickRowId,
        }).then((res) => {
          this.LeftTreeData = res.data[0].tree
          this.hideAllEditMode()
        }).catch((err) => {
          console.log(err)
        })
      },
      delSignalData() {
        this.axios.post('/signal', {
          state: 2,
          tree: this.LeftTreeData,
          ID:this.clickRowId,
        }).then((res) => {
          this.LeftTreeData = res.data[0].tree
          this.hideAllEditMode()
        }).catch((err) => {
          console.log(err)
        })
      },
      delFieldData() {
        this.axios.post('/field', {
          state: 2,
          tree: this.LeftTreeData,
          ID:this.clickRowId,
        }).then((res) => {
          this.LeftTreeData = res.data[0].tree
          this.hideAllEditMode()
        }).catch((err) => {
          console.log(err)
        })
      },
      // 请求信号库和消息库
      reuseMessage() {
        // this.axios.post('', {
        // }).then((res) => {
        //   console.log(res)
        // }).catch((err) => {
        //   console.log(err)
        // })
      },
      reuseSignal() {
        // this.axios.post('', {
        // }).then((res) => {
        //   console.log(res)
        // }).catch((err) => {
        //   console.log(err)
        // })
      },
      // 复用信号和消息
      useMessage(index, row) {
        console.log(row)
        this.messageVisible = false
        // this.axios.post('', {
        // }).then((res) => {
        //   console.log(res)
        // }).catch((err) => {
        //   console.log(err)
        // })
      },
      useSignal(index, row) {
        console.log(row)
        this.signalVisible = false
        // this.axios.post('', {
        // }).then((res) => {
        //   console.log(res)
        // }).catch((err) => {
        //   console.log(err)
        // })
      }
    },

    created() {

    },
    mounted() {
      this.getDefaultTree()
      this.TextData()
    }

  }
</script>
<style scoped>
  .SaveRemove {
    margin-top: 20px;
  }

  .edit-outer {
    height: 100%;
    display: flex;
    flex-flow: column;
  }

  .masked{
    width: 100%;
    height: 5px;
    background-image: -webkit-linear-gradient(left, #147B96, #E6D205 25%, #147B96 50%, #E6D205 75%, #147B96);
    -webkit-background-size: 200% 100%;
    -webkit-animation: masked-animation 2s infinite linear;
  }
  @-webkit-keyframes masked-animation {
    0%  { background-position: 0 0;}
    100% { background-position: -100% 0;}
  }


  .edit-content {
    display: flex;
    flex-direction: row;
    min-height: 500px;
    margin-top: 10px;
    clear: both;
  }

  .edit-foot {
    display: flex;
    height: 300px;
    background-color: rgb(226, 228, 228);
  }

  .edit-left {
    padding: 20px 0 50px 0;
    display: flex;
    width: 350px;
    max-height: 900px;
    /* background-color: rgb(201, 201, 218); */
  }

  .left-tree {
    width: 320px;
    overflow: auto;
    margin-right: 20px;
  }

  .right-tree {
    min-width: 300px;

    overflow: scroll;
  }

  .EditTreeClass {
    background: transparent;
    min-width: 300px;
    overflow: hidden;
  }

  .edit-middle {
    background-color: #ffffff;
    display: flex;
    flex: 1;
    flex-flow: column;
    min-width: 800px;
    border: 1px solid lightgrey;
    padding: 20px;
    border-radius: 20px;
  }

  .baseInfo {
    display: flex;
    /* background-color: rgb(238, 234, 234); */
    flex-flow: column;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .baseInfoSingal {
    display: flex;
    flex-flow: column;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .baseInfoField {
    display: flex;
    flex-flow: column;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .signalList {
    display: flex;
    flex-flow: column;
    justify-content: center;
    /* background-color: rgb(235, 235, 224) */
  }

  .FieldList {
    display: flex;
    flex: 1;
    flex-flow: column;
    /* justify-content: center; */
  }

  .signalTable {
    margin-top: 10px;
  }

  .signalBtn {
    margin-top: 10px
  }

  .FieldTable {
    margin-top: 10px
  }

  .FieldBtn {
    margin-top: 10px;
  }

  .edit-right {
    display: flex;
    width: 300px;
    background-color: #ffffff;
  }

  /* 公用样式 */
  .CommonInfoForm {
    min-height: 200px;
    padding: 20px
  }

  .SearchAdd {
    margin-top: 20px
  }

  .CommonAddBtn {
    margin-top: 10px
  }

  .CommonTable {
    margin-top: 15px;
    min-width: 800px;
    clear: both;
  }
</style>
<style>
  .el-tree-node__label {
    font-size: 14px
  }

  .el-scrollbar__wrap {
    overflow-x: hidden;
    margin-bottom: 0 !important;
  }
</style>
