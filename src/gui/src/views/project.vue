<template>
  <div>
    <div class="colors">
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
    projectIndex(){
      const index = this.$route.params.index
      return index
    },
    project(){
      return this.$store.state.projects[this.projectIndex]
    }
  },
  created() {
    this.getColors()
    // this.$http.compiler({config: this.$store.state.projects[0].config}).then(res => console.log(res)).catch(err => console.error(err))


    // this.$http.getColors({config: this.$store.state.projects[0].config}).then(res => console.log(res.data.data)).catch(err => console.error(err))

    const colors = [
      {oldVariable: '', newVariable: 'lucky', color: '#000', commit: '幸運色'},
      {oldVariable: 'badguy', newVariable: 'goodGuy', color: '#777777', commit: ''},
      {oldVariable: '', newVariable: '', color: '#999', commit: ''}
    ]

    // this.$http.addColors({config: this.$store.state.projects[0].config, colors}).then(res => console.log(res.data.data)).catch(err => console.error(err))


    // this.$http.replaceColors({config: this.$store.state.projects[0].config, colors}).then(res => console.log(res.data.data)).catch(err => console.error(err))
  },
  // mounted(){},
  // beforeDestroy() {},
  methods: {
    getColors(){
      this.$http.getColors({config: this.$store.state.projects[0].config})
        .then(res => {
          const colors = res.data.data
          if(colors.length === 0) throw new Error('你竟然一無所有...')
          this.colors = colors
          this.$notify.success({
            title: `顏色取得成功`,
            message: '沒想到你已經有了嗎？'
          })
        })
        .catch(err => this.$notify.error({
          title: `顏色取得失敗`,
          message: err
        }))
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
    rgbToHex(r, g, b) {
      const componentToHex = c => {
        const hex = c.toString(16)
        return hex.length == 1 ? "0" + hex : hex
      }
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
    },
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },
    onGetFile(ev) {
      const {canvasColorRange} = this
      const fileInput = ev.target
      const file = fileInput.files[0]
      const reader = new FileReader;
      reader.onload = e => {
        const result = e.target.result
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        const matchColors = []
        img.src = result
        img.onload = () => {
          const {width, height} = img
          const rangeWidth = canvasColorRange
          const rangeHeight = canvasColorRange
          const range = rangeWidth * rangeHeight
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0)
          const colorJson = {}
          for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
              const pixels = ctx.getImageData(i, j, 1, 1).data
              const r = pixels[0]
              const g = pixels[1]
              const b = pixels[2]
              const a = pixels[3] / 255
              const rgba = `${r},${g},${b},${a}`
              colorJson[rgba] !== undefined ? colorJson[rgba]++ : colorJson[rgba] = 0
            }
          }
          for (const color in colorJson) {
            if (colorJson[color] >= range) {
              matchColors.push(color)
            }
          }
          fileInput.value = ''
          this.matchColors = matchColors.map(rgba => {
            const [r, g, b] = rgba.split(',')
            return this.rgbToHex(Number(r), Number(g), Number(b))
          })
        }
      };
      reader.readAsDataURL(file);
    }
  },
}
</script>
<style lang="scss" scoped>
.colors {
  display: flex;
  width: 100vw;
  height: calc(100vh - 45px);
  margin-bottom: -40px;
  overflow: hidden;
  position: relative;
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