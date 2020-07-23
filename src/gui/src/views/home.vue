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
        isModal: false
      }
    },
    // computed:{},
    created() {
      // this.$http.compiler({config: this.$store.state.projects[0].config}).then(res => console.log(res)).catch(err => console.error(err))


      // this.$http.getColors({config: this.$store.state.projects[0].config}).then(res => console.log(res.data.data)).catch(err => console.error(err))
    },
    // mounted(){},
    // beforeDestroy() {},
    methods:{
      onGetFile(ev) {
        const file = ev.target.files[0]
        const reader = new FileReader;
        reader.onload = function(e) {
          const result = e.target.result
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const img = new Image()
          const rangePixels = []
          let matchColors = new Set()
          img.src = result
          img.onload = () => {
            ctx.drawImage(img, 0, 0)
            const { width, height } = img
            const range = 30
            const rangeWidth = width / range
            const rangeHeight = height / range
            for (let i = 0; i < rangeWidth; i++) {
              for (let j = 0; j < rangeHeight; j++) {
                const pixels = ctx.getImageData(range * i, range * j, range, range).data
                rangePixels.push(pixels)
              }
            }
            for (let i = 0; i < rangePixels.length; i++) {
              let prevRgba = ''
              let total = 0
              const allPixels = rangePixels[i]
              for (let j = 4; j < allPixels.length; j+=4) {
                const a = allPixels[j - 1] / 255
                const g = allPixels[j - 2]
                const b = allPixels[j - 3]
                const r = allPixels[j - 4]
                const rgba = `${r},${g},${b},${a}`
                if(j === 4) prevRgba = rgba
                if(prevRgba === rgba) {
                  total += 1
                  prevRgba = rgba
                } else {
                  break
                }
              }
              if(total >= range * range - 1) {
                matchColors.add(prevRgba)
              }
            }
            console.log([...matchColors])
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