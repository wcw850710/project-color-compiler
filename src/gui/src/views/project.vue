<template>
  <div class="project">
    <div class="colors" v-if="colors.length > 0">
      <el-button icon="el-icon-arrow-left" circle class="prev" @click="onChangePage(-1)"></el-button>
      <div
        class="color"
        v-for="(color, index) in curColors"
        :key="color.variable"
        :style="{backgroundColor: color.color}"
        @click="onCopy(index)"
      >
        <div class="content">
          <div class="name">{{ color.color }}</div>
          <div class="commit">{{ color.commit }}</div>
        </div>
      </div>
      <el-button icon="el-icon-arrow-right" circle class="next" @click="onChangePage(1)"></el-button>
    </div>
    <div class="no-colors-tip" v-else>
      <div class="text">
        找不到顏色，你竟然一無四處...
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'project',
  // model: { value: 'value', event: 'update' },
  // props:{},
  data() {
    return {
      colors: [],
      current: 0,
      canvasColorRange: 15,
    }
  },
  computed: {
    curColors() {
      const newColors = []
      const {colors, current} = this
      const range = 6
      const cur = current * range
      for (let i = 0; i < range; i++) {
        const color = colors[cur + i]
        if (color !== undefined) {
          newColors.push(color)
        }
      }
      return newColors
    },
    projectIndex() {
      const index = this.$route.params.index
      return index
    },
    project() {
      return this.$store.state.projects[this.projectIndex]
    }
  },
  created() {
    this.getColors()
    // this.$http.compiler({config: this.$store.state.projects[0].config}).then(res => console.log(res)).catch(err => console.error(err))

    // this.$http.addColors({config: this.$store.state.projects[0].config, colors}).then(res => console.log(res.data.data)).catch(err => console.error(err))

    // this.$http.replaceColors({config: this.$store.state.projects[0].config, colors}).then(res => console.log(res.data.data)).catch(err => console.error(err))
  },
  // mounted(){},
  // beforeDestroy() {},
  methods: {
    getColors() {
      this.$http.getColors({config: this.$store.state.projects[0].config})
        .then(res => {
          const colors = res.data.data
          if (colors.length === 0) throw new Error('你竟然一無所有...')
          this.colors = colors
          // this.$notify.success({
          //   title: `顏色取得成功`,
          //   message: '沒想到你已經有了嗎？'
          // })
        })
        .catch(err => {
          // this.$notify.error({
          //   title: `顏色取得失敗`,
          //   message: err
          // })
        })
    },
    onCopy(index) {
      const cur = index + this.current * 6
      const color = this.colors[cur]
      const dCopyText = document.createElement("input");
      dCopyText.value = color.color
      document.body.appendChild(dCopyText)
      dCopyText.select();
      document.execCommand("copy");
      dCopyText.remove()
      this.$notify.success({
        title: `顏色複製成功`,
        message: '這麼會使用的嗎'
      })
    },
    onChangePage(sum) {
      const _sum = this.current + sum
      const colorsLen = Math.round(this.colors.length / 6) - 1
      _sum > colorsLen ? this.current = 0
        : _sum < 0 ? this.current = colorsLen
        : this.current = _sum
      console.log(this.current)
    },
  }
}
</script>
<style lang="scss" scoped>
.project {
  width: 100vw;
  height: calc(100vh - 45px);
  margin-bottom: -40px;
}

.colors {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  position: relative;
}

.no-colors-tip {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .text {
    color: #606266;
    font-size: 13px;
    margin-top: 16px;
    text-align: center;
    line-height: 1.5;
  }
}

.next, .prev {
  position: absolute;
  top: calc(50% - 20px);
  box-shadow: 0 0 25px rgba(#000, .2);
  z-index: 3;
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.color {
  flex: 1;
  position: relative;
  cursor: pointer;
  transition: box-shadow .3s ease;

  &:hover {
    z-index: 2;

    .content {
      opacity: 1;
    }
  }

  .content {
    position: absolute;
    left: 10px;
    top: 10px;
    display: flex;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #fff;
    opacity: 0;
    transition: .4s ease;
    box-shadow: 0 0 50px rgba(#000, .5);
  }

  .name {
    color: #000;
    font-weight: 900;
    font-size: 20px;
    user-select: none;
    padding: 3px;
    margin-bottom: 10px;
  }

  .commit {
    color: #666;
    padding: 3px 6px;
    font-size: 13px;
  }
}
</style>