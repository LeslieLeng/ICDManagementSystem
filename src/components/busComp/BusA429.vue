<template>
  <div class="bus">
    <div class="small-nav">
      <el-menu :default-active="$route.path" router class="el-menu-demo" mode="horizontal" background-color="#FFF"
               active-text-color='#33DDEE'>
        <el-menu-item index="/a429monitor">A429总线监控</el-menu-item>
        <el-menu-item index="/a429playback">A429数据回放</el-menu-item>
      </el-menu>
    </div>
    <div class="router-content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'BusA429',
      data(){
        return{

        }
      }
    }
</script>

<style scoped>

</style>
