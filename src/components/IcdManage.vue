<template>
  <div class="icd">
    <div class="small-nav">
      <el-menu :default-active="$route.path" router class="el-menu-demo" mode="horizontal" background-color="#FFF"
               active-text-color='#33DDEE'>
        <el-menu-item index="/editicd">ICD编辑</el-menu-item>
        <el-menu-item index="/importicd">ICD导入</el-menu-item>
        <el-menu-item index="/exporticd">ICD导出</el-menu-item>
        <el-menu-item index="/allinfo">所有ICD</el-menu-item>
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
    data() {
      return {

      }
    },

    created() {

    }
  }
</script>
<style>

</style>
<style scoped>
  .icd {
    display: flex;
    flex-flow: column;
    height: 100%;
  }

  .small-title {
    height: 35px;
    line-height: 35px;
    background: #71abff;

  }

  .small-nav {
    height: 60px;
    background: #FFF;
    clear: both;
  }

  .titleFont {

    font-size: 16px;
    font-weight: 600;
    margin-left: 20px;
  }

  .router-content {
    flex: 1;
    padding: 20px
  }

</style>


