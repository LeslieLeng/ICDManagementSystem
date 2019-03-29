<template>
  <div id='app'>
    <div class="content">
      <div :class="isAllScreen?'class-A':'class-B'">
        <div class="left-img">
          <img src="./assets/images/615log.png" class="Logo" alt="">
        </div>
        <div class="left-nav">
          <el-menu router class="el-menu-vertical-demo" background-color="#ffffff" text-color="#888" active-text-color="#33DDEE">
            <el-menu-item index="/">
              <i class="el-icon-tickets"></i>
              <span slot="title" style="margin-left:15px">首页</span>
            </el-menu-item>
            <el-menu-item index="/icdmanage">
              <i class="el-icon-edit"></i>
              <span style="margin-left:15px">ICD管理</span>
            </el-menu-item>
            <el-submenu index="/bus">
              <template slot="title">
                <i class="el-icon-share"></i>
                <span style="margin-left:15px">总线监控</span>
              </template>
              <el-menu-item-group>
                <template slot="title">总线类</template>
                <el-menu-item index="/busa429">
                  <i class="el-icon-goods"></i>
                  <span style="margin-left:15px">A429总线</span>
                </el-menu-item>
                <el-menu-item index="/busa664">
                  <i class="el-icon-sold-out"></i>
                  <span style="margin-left:15px">A664总线</span>
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="非总线类">
                <el-menu-item index="/discrete">
                  <i class="el-icon-news"></i>
                  <span style="margin-left:15px">离散量</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="/simulate">
              <i class="el-icon-printer"></i>
              <span slot="title" style="margin-left:15px">总线仿真</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
      <div class="right">
        <div v-show="navBtn" class="title">
          <div class="title-top">
            <div class="left-icon">
              <el-button size="medium" type="primary" @click="allScreen"><i style="font-size: 18px"
                                                                            class="el-icon-tickets"></i></el-button>
            </div>
            <div class="title-font">
              <span>智能飞管综合环境</span>
            </div>
            <div class="small-title">
              <div style="display: inline-block;float: right;margin-right: 50px">
                <span style="color: #fff;margin-right: 20px">欢迎：{{UserName}}</span>
                <el-button type="danger" @click="logout" size="mini" plain>退出登录</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="right-content">
          <div class="content-view">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </div>
        </div>
      </div>
    </div>
    <!--<div  class="foot">-->
    <!--</div>-->

  </div>
</template>
<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        navBtn: true,
        isAllScreen: true,
        NavText: 'Home'
      }
    },
    computed: {
      UserName() {
        return sessionStorage.getItem('User')
      }
    },
    watch: {
      $route(to, from) {
        this.routeLogin()
      }
    },
    methods: {
      logout() {
        sessionStorage.clear()
        this.$router.push({path: '/login'})
      },
      routeLogin() {
        if (this.$route.path == '/login') {
          this.isAllScreen = false
          this.navBtn = false
        } else {
          this.isAllScreen = true
          this.navBtn = true
        }
      },
      allScreen() {
        this.isAllScreen = !this.isAllScreen;
      }
    },
    mounted() {
      this.routeLogin()
    }
  }
</script>

<style>
  .el-menu-item:hover {
    background: #fff !important;
    color: #33DDEE!important;
  }
  #app {
    display: flex;
    flex-flow: column;
    background-color: aliceblue;
    min-width: 1200px;
    font-family: 'heiti';
  }

  .content {
    display: flex;
    flex-flow: row;
  }

  .foot {
    height: 10vh;
    background-color: #71abff;
  }

  .class-A {
    display: flex;
    flex-flow: column;
    width: 200px;
    max-width: 200px;
    min-width: 200px;
    background-color: #ffffff;
    box-shadow: 2px 2px 10px #ccc;
    z-index: 100;
  }

  .class-B {
    display: flex;
    flex-flow: column;
    width: 200px;
    max-width: 200px;
    min-width: 200px;
    background-color: #ffffff;
    margin-left: -200px;
  }

  .left-img {
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center
  }

  .Logo {
    height: 120px;
    width: 120px;
  }

  .left-nav {
    flex: 1;
    height: 100%;
  }

  .fontLeft {
    margin-left: 0px
  }

  .right {
    display: flex;
    flex-flow: column;
    flex: 1;
    min-height: 100vh;
    background-color: #F3F5F8;
  }

  .title {
    display: flex;
    flex-flow: column;
    background: linear-gradient(to bottom, #ccfffc 0%, #71abff 100%);
  }

  .title-top {
    background: linear-gradient(to bottom, #ccfffc 0%, #71abff 100%);
    line-height: 80px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    box-shadow: 2px 2px 10px #ccc;
    z-index: 99;
  }

  .small-title {
    margin-top: 30px;
    height: 65px;
  }

  .left-icon {
    margin-left: 20px;
  }

  .title-font > span {
    color: whitesmoke;
    font-size: 42px;
    font-weight: 700;
    font-family: "fangsong";
    text-shadow: 0 0 10px #e7f3ff;
  }

  .title-middle {
    height: 45px;
    background: linear-gradient(to bottom, #71abff 0%, #71abff 100%);
    line-height: 45px
  }

  .title-middle > span {
    color: white;
    font-size: 18px;
    font-family: "sans-Arial";

  }

  .title-bottom {
    height: 45px;
    background-color: #2979FF
  }

  .right-content {
    flex: 1;
    display: flex;
    flex-flow: row;


  }

  .content-view {
    flex: 1
  }


  .el-menu {
    border-right-width: 0;
  }

  .el-tooltip {
    padding: 0 15px !important
  }

  .nav-span {
    margin-left: 30px;
    font-size: 16px;
  }
</style>
