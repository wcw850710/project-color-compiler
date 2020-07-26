<template>
  <div>
    <div class="create-wrap">
<!--      新增匯入&匯出按鈕-->
      <div class="no-project-tip" v-if="projects.length === 0">還沒有專案嗎？快點擊新增吧！</div>
      <div class="no-project-tip" v-else>探索這些專案吧！</div>
      <div class="btns">
        <el-button type="primary" @click="onOpenImportDialog" plain>匯入</el-button>
        <el-button type="primary" @click="onExportProjects" plain v-if="projects.length > 0">匯出</el-button>
        <el-button type="primary" @click="onOpenEditorProjectDialog">新增專案</el-button>
      </div>
    </div>

    <el-card v-for="(pro, index) in projects" :key="pro.name" shadow="hover" class="projects">
      <div class="project">
        <el-button type="danger" icon="el-icon-delete" circle></el-button>
        <div class="name">{{index + 1}}. {{pro.name}}</div>
        <div class="btns">
          <el-button type="primary" plain @click="onOpenEditorProjectDialog(true, pro, index)">設定</el-button>
          <el-button type="primary">進入</el-button>
        </div>
      </div>
    </el-card>

    <el-dialog
      :title="isEditProject ? '編輯專案' : '新增專案'"
      width="800px"
      :visible.sync="isEditorProjectDialog"
      :close-on-click-modal="false"
      @close="onCloseEditorProjectDialog"
    >
      <el-form :model="proj" ref="project-rule-form" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="專案名稱" prop="name">
          <el-input v-model="proj.name"></el-input>
        </el-form-item>
        <el-form-item label="查找類型" prop="config.fileExtensions">
          <el-checkbox-group v-model="proj.config.fileExtensions">
            <el-checkbox label="sass"></el-checkbox>
            <el-checkbox label="scss"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="專案路徑" prop="config.rootPath">
          <div class="form-path">
            <el-input readonly v-model="proj.config.rootPath"></el-input>
            <el-button type="primary" @click="onOpenPathDialog(proj.config.rootPath, 'rootPath')">設置路徑</el-button>
          </div>
        </el-form-item>
        <el-form-item label="編譯路徑" prop="config.compilePath">
          <div class="form-path">
            <el-input readonly v-model="proj.config.compilePath"></el-input>
            <el-button type="primary" @click="onOpenPathDialog(proj.config.compilePath, 'compilePath')">設置路徑</el-button>
          </div>
        </el-form-item>
        <el-form-item label="編譯檔案" prop="config.compileFile">
          <div class="form-compile-file">
            <el-input v-model="proj.config.compileFile[0]"></el-input>
            <el-select v-model="proj.config.compileFile[1]" placeholder="請選擇檔案類型" class="form-compile-file__select">
              <el-option
                v-for="extension in ['scss', 'sass']"
                :key="extension"
                :label="extension"
                :value="extension">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCloseEditorProjectDialog">取消</el-button>
        <el-button type="primary" @click="onSubmitProject">{{isEditProject ? '修改' : '新增'}}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="設定路徑"
      width="800px"
      :visible.sync="isPathDialog"
      :close-on-click-modal="false"
    >
      <div class="path-edit">
        <el-input v-model="path" disabled v-if="isEditPath"></el-input>
        <el-input ref="r-cache-path" v-model="cachePath" v-else @change="onEditPath"></el-input>
        <i class="el-icon-edit" @click="onEditPath"></i>
      </div>
      <ul>
        <li v-if="path.split('/').length && path.split('/')[1] !== '' && path !== ''" @click="onGoBackPath" class="path-list"><i class="el-icon-back"></i></li>
        <li v-for="path in paths" :key="path.name" @click="onSelectPath(path)" class="path-list">
          <i class="el-icon-folder" v-if="path.isDirectory === true"></i>
          <span>{{path.name}}</span>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer" @close="onCancelPath">
        <el-button @click="onCancelPath">取消</el-button>
        <el-button type="primary" @click="onSubmitPath">確定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="匯入專案"
        width="800px"
        :visible.sync="isImportDialog"
        :close-on-click-modal="false"
    >
      <el-upload
          class="upload-demo"
          action="hello upload"
          :show-file-list="false"
          :before-upload="onImportProjectJson"
          v-if="cacheImpoartProjects === null"
      >
        <el-button size="small" type="primary">點擊上傳</el-button>
      </el-upload>
      <span v-else>請選擇要 "新增" 還是 "覆蓋"</span>
      <span slot="footer" class="dialog-footer" @close="onCancelImport">
        <el-button @click="onCancelImport">取消</el-button>
        <el-button v-if="cacheImpoartProjects !== null" type="primary" @click="onImportWithNew" plain>新增</el-button>
        <el-button v-if="cacheImpoartProjects !== null" type="primary" @click="onImportWithCover">覆蓋</el-button>
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
        isEditorProjectDialog: false,
        isPathDialog: false,
        isGettingPath: false,
        isEditPath: true,
        isEditProject: false,
        isImportDialog: false,
        path: '',
        cachePath: '',
        paths: [],
        pathSetKey: '',
        cacheImpoartProjects: null, // []
        project: {
          name: '',
          config: {
            fileExtensions: ["scss"],
            compileFile: ["_colors", "scss"],
            compilePath: "C:/",
            rootPath: "C:/"
          },
        },
        cacheProject: {}, // 數據結構同 project
        cacheProjectIndex: 0,
        rules: {
          'name': [{ required: true, message: '請輸入專案名稱', trigger: 'change' },],
          'config.compileFile': [{ required: true, message: '請輸入編譯檔案', trigger: 'change' },],
          'config.compilePath': [{ required: true, message: '請輸入編譯路徑', trigger: 'change' },],
          'config.rootPath': [{ required: true, message: '請輸入專案路徑', trigger: 'change' },],
          'config.fileExtensions': [{ required: true, message: '請勾選查找類型', trigger: 'change' },],
        },
      }
    },
    computed: {
      projects() {
        return this.$store.state.projects
      },
      proj() {
        if(this.isEditProject === true) {
          return this.cacheProject
        } else {
          return this.project
        }
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
      onOpenImportDialog(){
        this.isImportDialog = true
      },
      onCancelImport(){
        this.isImportDialog = false
        this.cacheImpoartProjects = null
      },
      onImportWithNew(){
        this.cacheImpoartProjects.forEach(pro => {
          !this.projects.find(_pro => _pro.name === pro.name) && this.$store.commit('ADD_PROJECT', pro)
        })
        this.$notify.success({
          title: '新增專案成功',
          message: '敏銳的選擇'
        })
        this.onCancelImport()
      },
      onImportWithCover(){
        this.$store.commit('SET_PROJECTS', this.cacheImpoartProjects)
        this.$notify.success({
          title: '覆蓋專案成功',
          message: '機智的選擇'
        })
        this.onCancelImport()
      },
      async onImportProjectJson(file) {
        const { type } = file
        if(type !== 'application/json') {
          this.$notify.success({
            title: '僅接受 json 檔案',
            message: '下次給我注意一點'
          })
        } else {
          const fd = new FormData()
          fd.append('file', file)
          const projects = (await this.$http.importProject(fd)).data.data
          try {
            projects.forEach(({ name, config }) => {
              if(typeof name !== 'string'
              || Object.keys(config) < 4
              || !config.fileExtensions.every(extension => typeof extension === 'string')
              || !config.compileFile.every(file => typeof file === 'string')
              || typeof config.compilePath !== 'string'
              || typeof config.rootPath !== 'string') {
                throw new Error('???')
              }
            })
            this.cacheImpoartProjects = projects
          }catch (err) {
            this.$notify.success({
              title: '資料格式錯誤',
              message: '下次給我注意一點'
            })
          }
        }
        return false
      },
      initProject() {
        this.project = {
          name: '',
          config: {
            fileExtensions: ["scss"],
            compileFile: ["_colors", "scss"],
            compilePath: "C:/",
            rootPath: "C:/"
          }
        }
      },
      async onExportProjects() {
        try {
          const fileName = (await this.$http.beforeDownload({
            data: JSON.stringify(this.$store.state.projects)
          })).data.data
          window.open(`/api/download?fileName=${fileName}`)
        }catch (err) {
          this.$notify.success({
            title: '匯出數據失敗',
            message: '你不會知道是怎麼了'
          })
        }
      },
      onOpenEditorProjectDialog(isEdit = false, project, index) {
        this.resetProjectRuleForm()
        if(isEdit === true) {
          this.isEditorProjectDialog = true
          this.isEditProject = true
          this.cacheProjectIndex = index
          this.cacheProject = JSON.parse(JSON.stringify(project))
        } else {
          this.isEditorProjectDialog = true
          this.initProject()
        }
      },
      onCloseEditorProjectDialog() {
        if(this.isEditProject === true) {
          this.isEditProject = false
        }
        this.isEditorProjectDialog = false
      },
      onSubmitProject() {
        this.$refs['project-rule-form'].validate((valid) => {
          if (valid) {
            if(this.isEditProject === true) {
              this.isEditProject = false
              this.$store.commit('SET_PROJECT', {
                project: this.cacheProject,
                index: this.cacheProjectIndex,
              })
              this.$notify.success({
                title: '編輯專案成功',
                message: '聰明的選擇'
              })
            }else {
              this.$store.commit('ADD_PROJECT', this.project)
              this.$notify.success({
                title: '新增專案成功',
                message: '理智的選擇'
              })
            }
            this.isEditorProjectDialog = false
          } else {
            this.$notify.error({
              title: '該填的都填',
              message: '你應該乖乖的'
            })
            return false;
          }
        })
      },
      resetProjectRuleForm() {
        this.$nextTick(() => this.$refs['project-rule-form'].resetFields())
      },
      async onGetFilePath(path, condition = item => item.isDirectory === true && item.name[0] !== '.') {
        if(path) {
          this.isGettingPath = true
          this.paths = []
          try {
            const paths = (await this.$http.getFilePath({path})).data.data.filter(condition)
            this.paths = paths
          } catch (err) {
            this.paths = []
          }
          this.isGettingPath = false
        }else {
          this.paths = []
        }
      },
      onGoBackPath() {
        const _path = this.path.split('/')
        _path.pop()
        const jPath = _path.join('/')
        this.path = jPath[jPath.length - 1] === ':' ? jPath + '/' : jPath
        this.onGetFilePath(this.path)
      },
      onSelectPath({ name }) {
        const { path } = this
        if(path[path.length - 1] !== '/') {
          this.path += '/' + name
        } else {
          this.path += name
        }
        this.onGetFilePath(this.path)
      },
      onEditPath() {
        this.isEditPath = !this.isEditPath
        if(this.isEditPath === true){
          this.path = this.cachePath
          this.onGetFilePath(this.path)
        } else {
          this.cachePath = this.path
          this.$nextTick(() => this.$refs['r-cache-path'].focus())
        }
      },
      onCancelPath() {
        this.isPathDialog = false
      },
      onSubmitPath() {
        this.$set(this.project.config, this.pathSetKey, this.path)
        this.isPathDialog = false
      },
      async onOpenPathDialog(path, key) {
        this.path = path
        await this.onGetFilePath(path)
        this.isPathDialog = true
        this.isEditPath = true
        this.pathSetKey = key
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
  .projects {
    width: 80%;
    max-width: 800px;
    margin: 16px auto 0;
  }
  .project {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .name {
      font-weight: 900;
      flex: 1;
      padding: 0 10px;
    }
    .btns {
      display: flex;
    }
  }

  .create-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px auto;
    width: 80%;
    max-width: 800px;
  }

  .no-project-tip {
    color: #606266;
    text-align: center;
    margin-right: 10px;
    font-size: 13px;
  }

  .form-path {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    button {
      margin-left: 6px;
    }
  }

  .form-compile-file {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &__select {
      margin-left: 6px;
    }
  }

  .path-edit {
    position: relative;
    margin-bottom: 6px;

    i {
      position: absolute;
      right: 10px;
      top: 9px;
      cursor: pointer;
    }
  }

  .path-list {
    padding: 10px 5px;
    border-bottom: 1px solid #DCDFE6;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
      background: rgba(#DCDFE6, .2);
    }
    i {
      margin-right: 6px;
    }
  }
</style>