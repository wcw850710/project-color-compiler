<template>
  <div class="lists">
    <div class="list" @click="isModal = true">
      <div class="plus"></div>
    </div>
    <div class="list" v-for="project in projects" :key="project.name">{{project.name}}</div>
    <modal title="新建專案" v-model="isModal">
      hello
    </modal>
    <input type="file" @change="onGetFile">
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
        isModal: false,
      }
    },
    // computed:{},
    created() {
      // this.$http.compiler({config: this.$store.state.projects[0].config}).then(res => console.log(res)).catch(err => console.error(err))


      // this.$http.getColors({config: this.$store.state.projects[0].config}).then(res => console.log(res.data.data)).catch(err => console.error(err))
    },
    // mounted(){},
    // beforeDestroy() {},
    methods: {
      onGetFile(ev) {
        const file = ev.target.files[0]
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
            this.matchColors = matchColors
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