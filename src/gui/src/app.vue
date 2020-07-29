<template>
  <div id="app">
<!--    <header :style="{justifyContent: routeName === 'home' ? 'center' : 'flex-start'}">-->
<!--      <h1>專案顏色管理工具</h1>-->
<!--      <el-page-header v-if="routeName === 'project'" @back="goBack" :content="projectName" />-->
<!--    </header>-->
    <router-view/>
    <footer>@Frank<span @click="isReportDialog = true">v0.0.0</span></footer>

    <el-dialog
      title="更新紀錄 v0.0.0"
      width="400px"
      :visible.sync="isReportDialog"
    >
      無
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'app',
    data(){
      return {
        isReportDialog: false
      }
    },
    computed: {
      // routeName() {
      //   return this.$route.name
      // },
      // projectName() {
      //   return this.$store.state.projects[this.$route.params.index].name
      // }
    },
    methods: {
      // goBack() {
      //   this.$router.push('/')
      // }
    }
  }
</script>
<style lang="scss" scoped>
  #app {
    padding-bottom: 40px;
  }
  header {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid #DCDFE6;
    h1 {
      margin-right: 30px;
      font-size: 24px;
      font-weight: 900;
    }
  }
  footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    font-size: 12px;
    letter-spacing: 1px;
    z-index: 1001;
    span {
      text-decoration: underline;
      margin-left: 8px;
      display: inline-block;
      cursor: pointer;
    }
  }
</style>
