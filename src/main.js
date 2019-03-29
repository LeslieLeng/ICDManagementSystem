import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import {routes} from './router/routes'
import 'bootstrap/dist/css/bootstrap.min.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import axios from'axios'
import echarts from 'echarts'
import store from './vuex/store'    //引入vuex的store模块
// axios.defaults.baseURL = 'http://172.16.3.56:8000'
axios.defaults.baseURL = 'http://172.16.3.58:8000'
Vue.prototype.echarts=echarts
Vue.prototype.axios=axios;
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(VueRouter)

const router=new VueRouter({
  routes,
  mode:'history'
})
//全局守卫
router.beforeEach((to,from,next)=>{
    if(to.path=='/login'){
        next()
    }
    else if(sessionStorage.getItem('User')){
        next()
    }
    else{
        next('/login')
    }
})
/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  store,              //加载store
  components: { App },
  template: '<App/>'
})
