<template>
    <div class="exam_structure">

        <h3 class="title">试卷结构</h3><span class="tip">（可以点击选中对应题目）</span>

        <el-button type="primary" size="small" class="add_new_question" @click="add_new_question"><i></i>添加新大题</el-button>

        </div>

        <div class="question_info_lists">

        <el-tree ref="tree" :key="tree_key" :data="treeData" node-key="id" :render-content="renderContent" :expand-on-click-node="false" :default-expanded-keys="defaultExpand"></el-tree>



        <el-row class="add_question" v-show="add_question_flag">

        <el-col :span="12">

        <el-input v-model="new_question_name" placeholder="请输入大题名称"></el-input>

        </el-col>

        <el-col :span="12">

        <el-button size="mini" class="btn_sure" @click.stop="add_question_sure">确定</el-button>

        <el-button size="mini" class="btn_cancel" @click.stop="add_question_cancel">取消</el-button>

        </el-col>

        </el-row>

    </div>
</template>
<script>
export default {
    data() {

            return {

            treeData: [{

            id: 1,

            label: '一级 1',

            isEdit: false,

            children: [{

            id: 4,

            label: '二级 1-1',

            isEdit: false,

            children: [{id: 9, label: '三级 1-1-1', isEdit: false}, {id: 10, label: '三级 1-1-2', isEdit: false}, {id: 11, label: '三级 1-1-3', isEdit: false}]

            },

            {

            id: 12,

            label: '二级 1-2',

            isEdit: false,

            children: []

            },

            {

            id: 13,

            label: '二级 1-3',

            isEdit: false,

            children: []

            }]

            },

            {

            id: 2,

            label: '一级 2',

            isEdit: false,

            children: [{id: 5, label: '二级 2-1'}, {id: 6, label: '二级 2-2', isEdit: false}]

            },

            {

            id: 3,

            label: '一级 3',

            isEdit: false,

            children: [{id: 7, label: '二级 3-1', isEdit: false}, {id: 8, label: '二级 3-2', isEdit: false}]

            }],

            add_question_flag: false,

            new_question_name: '',

            tree_key: 0,

            defaultExpand: []

            }

            },

            methods: {

            // 添加新大题

            add_new_question() {

            this.add_question_flag = true

            },

            add_question_sure() {

            const nodeObj = {id: '', label: this.new_question_name, isEdit: false, children: []}



            this.treeData.push(nodeObj)

            this.add_question_flag = false

            },

            add_question_cancel() {

            this.add_question_flag = false

            this.new_question_name = ''

            },

            // 试题名称更新

            nodeEdit(ev, store, data) {

            data.isEdit = true

            this.$nextTick(() => {

            const $input = ev.target.parentNode.parentNode.querySelector('input') || ev.target.parentElement.parentElement.querySelector('input')



            !$input ? '' : $input.focus()

            })

            },

            edit_sure(ev, data) {

            const $input = ev.target.parentNode.parentNode.querySelector('input') || ev.target.parentElement.parentElement.querySelector('input')



            if (!$input) {

            return false

            } else {

            data.label = $input.value

            data.isEdit = false

            }

            },

            // 节点删除

            nodeDelete(node, data) {

            const parent = node.parent

            const children = parent.data.children || parent.data

            const index = children.findIndex(d => d.id === data.id)



            children.splice(index, 1)

            },

            // 节点上移

            nodeUp(node, data) {

            const parent = node.parent

            const children = parent.data.children || parent.data

            const cIndex = children.findIndex(d => d.id === data.id)



            if (parent.level === 0 && cIndex === 0) {

            return

            } else if (parent.level !== 0 && cIndex === 0) { //不同父节点中移动

            const parent2 = parent.parent

            const children2 = parent2.data.children || parent2.data

            const pIndex2 = parseInt(children2.findIndex(p => p.id === parent.data.id), 10) - 1



            if (pIndex2 < 0) return

            children2[pIndex2].children.push(data)

            children.splice(cIndex, 1)

            this.defaultExpand[0] = children2[pIndex2].id

            } else if ((parent.level === 0 && cIndex !== 0) || (parent.level !== 0 && cIndex !== 0)) {

            const tempChildrenNodex1 = children[cIndex-1]

            const tempChildrenNodex2 = children[cIndex]



            this.$set(children, cIndex-1, tempChildrenNodex2)

            this.$set(children, cIndex, tempChildrenNodex1)

            this.defaultExpand[0] = data.id

            }

            this.tree_key++

            },

            // 节点下移

            nodeDown(store, node, data) {

            const parent = node.parent

            const children = parent.data.children || parent.data

            const cIndex = children.findIndex(d => d.id === data.id)

            const cLength = children.length - 1 // 最边上的节点

            const allLevel = store.data.length - 1 // 树的深度



            if (parent.level === allLevel && cIndex === cLength) { // 最最末的节点

            return

            } else if (parent.level !== allLevel&& cIndex === cLength) { //父节点不同

            const parent2 = parent.parent

            const children2 = parent2.data.children || parent2.data

            const pIndex2 = parseInt((children2.findIndex(p => p.id === parent.data.id)), 10)



            if (pIndex2 === allLevel) return

            children2[pIndex2+1].children.push(data)

            children.splice(cIndex, 1)

            this.defaultExpand[0] = children2[pIndex2+1].id

            } else if ((parent.level === allLevel && cIndex !== cLength) || (parent.level !== allLevel && cIndex !== cLength)) { // 父节点相同

            const tempChildrenNodex1 = children[cIndex+1]

            const tempChildrenNodex2 = children[cIndex]



            this.$set(children, cIndex+1, tempChildrenNodex2)

            this.$set(children, cIndex, tempChildrenNodex1)

            this.defaultExpand[0] = data.id

            }

            this.tree_key++

            },

            showOrEdit(data) {

            if (data.isEdit) {

            return <input type="text" value={data.label} on-blur={ev => this.edit_sure(ev, data)}/>

            } else {

            return <span className="node_labe">{data.label}</span>

            }

            },

            // 试卷结构树操作group node,

            renderContent(h, {node, data, store}) {

            return (

            <span>

            <span>

            { this.showOrEdit(data) }

            </span>

            <div class="tree_node_op">

            <i class="node_edit" on-click={ (ev) => this.nodeEdit(ev, store, data) }></i>

            <i class="node_delete" on-click={ () => this.nodeDelete(node, data) }></i>

            <i class="node_up" on-click={ () => this.nodeUp(node, data) }></i>

            <i class="node_down" on-click={ () => this.nodeDown(store, node, data) }></i>

            </div>

            </span>)

            }

            }
}
</script>

