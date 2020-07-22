<template>
  <div class="modal" v-if="value">
    <div class="screen" @click="$emit('input', !value)"></div>
    <div class="content">
      <div class="title">{{title}}</div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'modal',
    // model: { value: 'value', event: 'update' },
    props:{
      title: String,
      value: Boolean
    },
    // data() {
    //   return {}
    // },
    // computed:{},
    // created(){},
    // mounted(){},
    // beforeDestroy() {},
    // methods:{},
  }
</script>
<style lang="scss" scoped>
  .modal{
    position: fixed;
    left: 0;
    top: 0;
    z-index: 5;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .title{
    font-size: 18px;
    text-align: center;
    margin-bottom: 15px;
  }
  .content{
    background: #fff;
    padding: 20px;
    width: 650px;
  }
  .screen{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(#000,.6);
    z-index: -1;
  }
</style>