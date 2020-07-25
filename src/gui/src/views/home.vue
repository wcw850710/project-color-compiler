<template>
  <div>
    <el-page-header @back="$router.push('/')" content="详情页面">
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
      }
    },
    // computed:{},
    created() {
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
            const rangeWidth = 15
            const rangeHeight = 15
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
              if(colorJson[color] >= range) {
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