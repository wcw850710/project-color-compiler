<template>
  <div>
    <div class="create-wrap">
      <div class="no-project-tip" v-if="projects.length === 0">還沒有專案嗎？快點擊新增吧！</div>
      <el-button type="primary" @click="onOpenCreateDialog">新增專案</el-button>
      <el-card v-for="(pro) in projects" :key="pro.name" shadow="hover">
        <div class="project">
          <div class="name">{{pro.name}}</div>
          <div class="btns">
            <el-button type="primary">設定</el-button>
            <el-button type="primary">進入</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog
      title="新增專案"
      width="70%"
      :visible.sync="isCreateDialog"
    >
      <el-form :model="project" ref="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="專案名稱" prop="project-name">
          <el-input v-model="project.name"></el-input>
        </el-form-item>
        <el-form-item label="查找類型" prop="file-extensions">
          <el-input v-model="project.config.fileExtensions"></el-input>
        </el-form-item>
        <el-form-item label="專案路徑" prop="root-path">
          <el-input v-model="project.config.rootPath"></el-input>
        </el-form-item>
        <el-form-item label="編譯路徑" prop="compile-path">
          <el-input v-model="project.config.compilePath"></el-input>
        </el-form-item>
        <el-form-item label="編譯檔案" prop="compile-file">
          <el-input v-model="project.config.compileFile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCloseCreateDialog">取消</el-button>
        <el-button type="primary" @click="onCreateProject">新增</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'home',
    // model: { value: 'value', event: 'update' },
    // props:{},
    data() {
      return {
        isCreateDialog: false,
        project: {
          name: '',
          config: {
            fileExtensions: ["scss"],
            compileFile: ["_colors", "scss"],
            compilePath: "C:",
            rootPath: "C:"
          },
        },
        rules: {
          'project-name': [{ required: true, message: '請輸入專案名稱', trigger: 'change' },],
          'compile-file': [{ required: true, message: '請輸入編譯檔案', trigger: 'change' },],
          'compile-path': [{ required: true, message: '請輸入編譯路徑', trigger: 'change' },],
          'root-path': [{ required: true, message: '請輸入專案路徑', trigger: 'change' },],
          'file-extensions': [{ required: true, message: '請輸入查找類型', trigger: 'change' },],
        }
      }
    },
    computed: {
      projects() {
        return this.$store.state.projects
      }
    },
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
      initProject() {
        this.project = {
          name: '',
          config: {
            fileExtensions: ["scss"],
            compileFile: ["_colors", "scss"],
            compilePath: "C:",
            rootPath: "C:"
          }
        }
      },
      onOpenCreateDialog() {
        this.isCreateDialog = true
        this.initProject()
      },
      onCloseCreateDialog() {
        this.isCreateDialog = false
      },
      onCreateProject() {},
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
  .create-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
  }

  .no-project-tip {
    color: #606266;
    text-align: center;
    margin-right: 10px;
    font-size: 13px;
  }
</style>