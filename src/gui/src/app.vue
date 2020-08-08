<template>
  <div id="app" :style="{backgroundColor: isNight ? '#303133' : '#fff'}">
<!--    <header :style="{justifyContent: routeName === 'home' ? 'center' : 'flex-start'}">-->
    <header>
      <h1 :style="{color: isNight ? '#fff' : '#000'}">專案顏色管理工具<span class="beta">BETA</span></h1>
      <i class="theme night el-icon-moon" @click="onChanceTheme" v-if="isNight"></i>
      <i class="theme el-icon-sunny" @click="onChanceTheme" v-else></i>
      <a class="tip" :style="{color: isNight ? '#fff' : '#000'}" href="https://github.com/frank575/project-color-compiler" target="_blank">
        <i class="el-icon-question"></i>
        <div>使用說明</div>
      </a>
<!--      <el-page-header v-if="routeName === 'project'" @back="goBack" :content="projectName" />-->
    </header>
    <router-view/>
    <footer :style="{color: isNight ? '#fff' : '#000'}">
      @Frank
      <span class="version" @click="isReportDialog = true">v0.0.0</span>
    </footer>

    <el-dialog
      :class="{'night-dialog': isNight}"
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
      theme(){
        return this.$store.state.theme
      },
      isNight(){
        return this.theme === 'night'
      },
      // routeName() {
      //   return this.$route.name
      // },
      // projectName() {
      //   return this.$store.state.projects[this.$route.params.index].name
      // }
    },
    methods: {
      onChanceTheme() {
        return this.isNight ? this.$store.commit('SET_THEME', 'sun') : this.$store.commit('SET_THEME', 'night')
      },
      // goBack() {
      //   this.$router.push('/')
      // }
    }
  }
</script>
<style lang="scss" scoped>
  #app {
    padding-bottom: 40px;
    min-height: 100vh;
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
    .theme {
      margin-left: auto;
      cursor: pointer;
      &.night {
        color: #fff;
      }
    }
    .tip {
      display: inline-flex;
      align-items: center;
      margin-left: 12px;
      cursor: pointer;
      text-decoration: none;
      &:hover {
        color: #409EFF;
      }
      i {
        margin-right: 4px;
      }
      div {
        font-size: 13px;
      }
    }
    .beta{
      font-size: 12px;
      font-weight: 900;
      margin-left: 10px;
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
    .version {
      text-decoration: underline;
      margin: 0 8px;
      display: inline-block;
      cursor: pointer;
    }
  }
</style>
