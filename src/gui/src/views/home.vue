<template>
  <div class="lists">
    <div class="list" @click="isModal = true">
      <div class="plus"></div>
    </div>
    <div class="list" v-for="project in projects" :key="project.name">{{project.name}}</div>
    <modal title="新建專案" v-model="isModal">
      hello
    </modal>
  </div>
</template>
<script>
  export default {
    name: 'home',
    // model: { value: 'value', event: 'update' },
    // props:{},
    data() {
      return {
        projects: [],
        isModal: false
      }
    },
    // computed:{},
    created() {
      this.$http.compiler(
        {config: this.$store.state.projects[0].config}
      ).then(res => console.log(res)).catch(err => console.error(err))
    },
    // mounted(){},
    // beforeDestroy() {},
    // methods:{},
  }
</script>
<style lang="scss" scoped>
  .lists {
    display: flex;
    flex-direction: column;
    padding: 75px 15%;
  }

  .list {
    width: 150px;
    height: 150px;
    border: 1px solid #000;
    position: relative;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, .1);
    }
  }

  .plus {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    &::before, &::after {
      content: '';
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: #000;
    }

    &::before {
      width: 15px;
      height: 2px;
    }

    &::after {
      width: 2px;
      height: 15px;
    }
  }
</style>