import Vue from 'vue'
import vuex from 'vuex'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(vuex);
const store=new vuex.Store({
    state:{
    isLogin:false,
    allUrl:"http://172.16.3.217:8000",
    TitleName:'飞行状态设置'
    },
    getters,
    mutations,
    actions
})
export default store