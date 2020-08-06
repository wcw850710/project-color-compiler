<template>
  <div>
    <div class="create-wrap">
      <div class="no-project-tip" v-if="projects.length === 0">還沒有專案嗎？快點擊新增吧！</div>
      <div class="no-project-tip" v-else  :style="{color: isNight ? '#fff' : '#000'}">探索這些專案吧！</div>
      <div class="btns">
        <el-button type="default" @click="onOpenImportDialog" :class="{'night-default-btn': isNight}" plain>匯入</el-button>
        <el-button type="default" @click="onExportProjects" :class="{'night-default-btn': isNight}" plain v-if="projects.length > 0">匯出</el-button>
        <el-button type="primary" @click="onOpenEditorProjectDialog">新增專案</el-button>
      </div>
    </div>

    <el-card v-for="(pro, index) in projects" :key="pro.name" shadow="hover" class="projects" :class="{'night-default-btn': isNight}">
      <div class="project">
        <el-popconfirm
          confirmButtonText='是'
          cancelButtonText='否'
          icon="el-icon-info"
          iconColor="red"
          title="確定刪除此專案嗎？"
          @onConfirm="onDeleteProject(index)"
        >
          <el-button slot="reference" type="danger" icon="el-icon-delete" circle></el-button>
        </el-popconfirm>
        <el-button style="margin-left: 4px;" :class="{'night-default-btn': isNight}" type="default" icon="el-icon-setting" circle @click="onOpenEditorProjectDialog(true, pro, index)"></el-button>
        <div class="name">{{pro.name}}</div>
        <div class="btns">
          <el-button type="default" @click="onOpenTranslateDialog(index)" :class="{'night-default-btn--disabled': isNight}" disabled>移除導入</el-button>
          <el-button type="default" @click="onOpenTranslateDialog(index)" :class="{'night-default-btn--disabled': isNight}" disabled>顏色過濾</el-button>
          <el-button type="default" @click="onOpenTranslateDialog(index)" :class="{'night-default-btn--disabled': isNight}" disabled>導入顏色</el-button>
          <el-button type="primary" @click="onOpenTranslateDialog(index)">轉換變量與顏色</el-button>
          <el-button type="primary" @click="onCompileColors(index)">交叉編譯</el-button>
        </div>
      </div>
    </el-card>

    <el-dialog
      :class="{'night-dialog': isNight}"
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
        <el-form-item label="編譯檔案" prop="config.compileFile[0]">
          <div class="form-compile-file">
            <el-input v-model="proj.config.compileFile[0]"></el-input>
            <el-select v-model="proj.config.compileFile[1]" placeholder="請選擇檔案類型" class="form-compile-file__select" @change="onChangeFileType">
              <el-option
                v-for="extension in compileExtensions"
                :key="extension"
                :label="extension"
                :value="extension"
                :disabled="extension === 'dart'"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="查找類型" prop="config.fileExtensions">
          <el-checkbox-group v-model="proj.config.fileExtensions">
            <el-checkbox
              v-for="extension in searchExtensions"
              :key="extension"
              :label="extension"
              v-if="disabledTypes.indexOf(extension) === -1 && extension !== 'dart'"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="自動導入" prop="config.isAutoImport">
          <el-radio v-model="proj.config.isAutoImport" :label="true">是</el-radio>
          <el-radio v-model="proj.config.isAutoImport" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="檔案過濾">
          <span style="color: #C0C4CC; user-select: none;">計畫中</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCloseEditorProjectDialog">取消</el-button>
        <el-button type="primary" @click="onSubmitProject">{{isEditProject ? '修改' : '新增'}}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :class="{'night-dialog': isNight}"
      :title="'設定' + cachePathTitle"
      width="800px"
      :visible.sync="isPathDialog"
      :close-on-click-modal="false"
      @close="onCancelPath"
    >
      <div class="path-edit">
        <el-input v-model="path" disabled v-if="isEditPath"></el-input>
        <el-input ref="r-cache-path" v-model="cachePath" v-else @change="onEditPath"></el-input>
        <i class="el-icon-edit" :class="{'path-list--night': isNight}" @click="onEditPath"></i>
      </div>
      <ul>
        <li v-if="path.split('/').length && path.split('/')[1] !== '' && path !== ''" @click="onGoBackPath" class="path-list" :class="{'path-list--night': isNight}"><i class="el-icon-back"></i></li>
        <li v-for="path in paths" :key="path.name" @click="onSelectPath(path)" class="path-list" :class="{'path-list--night': isNight}">
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
      :class="{'night-dialog': isNight}"
      title="匯入專案"
      width="800px"
      :visible.sync="isImportDialog"
      :close-on-click-modal="false"
      @close="onCancelImport"
    >
      <el-upload
          class="upload-demo"
          action="hello upload"
          :show-file-list="false"
          :before-upload="onImportProjectJson"
          v-if="cacheImportProjects === null"
      >
        <el-button size="small" type="primary">點擊上傳</el-button>
      </el-upload>
      <span v-else>請選擇要 "新增" 還是 "覆蓋"</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancelImport">取消</el-button>
        <el-button v-if="cacheImportProjects !== null" type="primary" @click="onImportWithNew" plain>新增</el-button>
        <el-button v-if="cacheImportProjects !== null" type="primary" @click="onImportWithCover">覆蓋</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :class="{'night-dialog': isNight}"
      title="轉換變量與顏色"
      width="800px"
      :visible.sync="isTranslateDialog"
      :close-on-click-modal="false"
      @close="onCancelTranslate"
    >
      <span class="translate-tip" :class="{'translate-tip--night': isNight}">
        <i class="el-icon-info"></i>
        不會幫你校正數據格式哦(TODO: 取代顏色)
      </span>
      <div class="colors">
        <div class="color" v-for="color in cacheColors" :key="color.oldVariable">
          <div class="color__cube" :style="{backgroundColor: color.color}"></div>
          <el-input class="color__variable" v-model="color.newVariable" placeholder="請輸入變量名稱">
            <template slot="prepend">$</template>
          </el-input>
          <el-input class="color__color" v-model="color.color" placeholder="請輸入顏色"></el-input>
          <el-input class="color__commit" v-model="color.commit" placeholder="請輸入顏色備註"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancelTranslate">取消</el-button>
        <el-button type="primary" @click="onTranslate">轉換</el-button>
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
        isTranslateDialog: false,
        path: '',
        cachePath: '',
        cachePathTitle: '路徑',
        paths: [],
        pathSetKey: '',
        cacheImportProjects: null, // []
        project: {
          name: '',
          config: {
            fileExtensions: [],
            compileFile: ["_colors", "scss"],
            compilePath: "C:/",
            rootPath: "C:/",
            isAutoImport: false,
          },
        },
        cacheCompileFileType: '',
        disabledTypes: '',
        cacheProject: {}, // 數據結構同 project
        cacheProjectIndex: 0,
        rules: {
          'name': [{ required: true, message: '請輸入專案名稱', trigger: 'change' },],
          'config.compileFile[0]': [{ required: true, message: '請輸入編譯檔案', trigger: 'change' },],
          'config.compilePath': [{ required: true, message: '請輸入編譯路徑', trigger: 'change' },],
          'config.rootPath': [{ required: true, message: '請輸入專案路徑', trigger: 'change' },],
          'config.fileExtensions': [{ required: true, message: '請勾選查找類型', trigger: 'change' },],
          'config.isAutoImport': [{ required: true, message: '請選擇是否自動導入', trigger: 'change' },],
        },
        cacheColors: [],
        regTjs: /^[tj]s$/,
        regSass: /^s[ca]ss$/,
        compileExtensions: ['scss', 'sass', 'js', 'ts', 'dart'],
        searchExtensions: ['scss', 'sass', 'vue', 'js', 'ts', 'dart'],
      }
    },
    computed: {
      theme(){
        return this.$store.state.theme
      },
      isNight(){
        return this.theme === 'night'
      },
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
    // created() {},
    // mounted(){},
    // beforeDestroy() {},
    methods: {
      changeDisabledTypes() {
        const { regTjs, regSass } = this
        if(regSass.test(this.cacheCompileFileType) === true) {
          this.disabledTypes = 'jstsdart'
        } else if(regTjs.test(this.cacheCompileFileType) === true) {
          this.disabledTypes = 'scsssassvue'
        }
      },
      onChangeFileType(type) {
        const { regTjs, regSass } = this
        if(
          (regTjs.test(type) === true && regTjs.test(this.cacheCompileFileType) === false) ||
          (regSass.test(type) === true && regSass.test(this.cacheCompileFileType) === false)
        ) {
          this.$set(this.proj.config, 'fileExtensions', [])
        }
        this.cacheCompileFileType = type
        this.changeDisabledTypes()
      },
      onCancelTranslate(){
        this.isTranslateDialog = false
      },
      async onTranslate(){
        const config = this.projects[this.cacheProjectIndex].config
        const colors = this.cacheColors
        const loading = this.loading()
        try {
          await this.$http.translateColorsAndVariables({config, colors})
          this.$notify.success({
            title: '顏色轉換成功',
            message: '大風吹吹什麼'
          })
        }catch (e) {
          this.$notify.error({
            title: '顏色轉換失敗',
            message: '天哪！驚人的一手'
          })
        }
        loading.close()
        this.isTranslateDialog = false
      },
      async onOpenTranslateDialog(index){
        const config = this.projects[index].config
        const loading = this.loading()
        this.cacheColors = []
        this.cacheProjectIndex = index
        try {
          const colors = (await this.$http.getColors({config})).data.data
          if(colors.length === 0) throw new Error('沒有顏色不讓你開哈哈')
          this.cacheColors = colors.map(color => ({
            commit: color.commit || '',
            color: color.color,
            newVariable: color.variable,
            oldVariable: color.variable,
          }))
          this.$notify.success({
            title: '顏色取得成功',
            message: '這麼輕易就讓你到手'
          })
          this.isTranslateDialog = true
        } catch (e) {
          this.$notify.error({
            title: '暫無顏色',
            message: '沒顏色還敢點呀'
          })
        }
        loading.close()
      },
      loading(){
        return this.$loading({
          lock: true,
          background: this.isNight ? 'rgba(0, 0, 0, .8)' : 'hsla(0,0%,100%,.9)'
        })
      },
      onCompileColors(index){
        const config = this.projects[index].config
        const loading = this.loading()
        this.$http.compiler({config})
          .then(res => {
            this.$notify.success({
              title: '交叉編譯成功',
              message: '懂用哦'
            })
            loading.close()
          })
          .catch(err => {
            this.$notify.error({
              title: '交叉編譯失敗',
              message: '哭哭！請查看專案設定有無問題'
            })
            loading.close()
          })
      },
      onDeleteProject(index){
        this.$store.commit('REMOVE_PROJECT', index)
      },
      onOpenImportDialog(){
        this.isImportDialog = true
      },
      onCancelImport(){
        this.isImportDialog = false
        this.cacheImportProjects = null
      },
      onImportWithNew(){
        this.cacheImportProjects.forEach(pro => {
          !this.projects.find(_pro => _pro.name === pro.name) && this.$store.commit('ADD_PROJECT', pro)
        })
        this.$notify.success({
          title: '新增專案成功',
          message: '敏銳的選擇'
        })
        this.onCancelImport()
      },
      onImportWithCover(){
        this.$store.commit('SET_PROJECTS', this.cacheImportProjects)
        this.$notify.success({
          title: '覆蓋專案成功',
          message: '機智的選擇'
        })
        this.onCancelImport()
      },
      async onImportProjectJson(file) {
        const { type } = file
        if(type !== 'application/json') {
          this.$notify.error({
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
            this.cacheImportProjects = projects
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
            fileExtensions: [],
            compileFile: ["_colors", "scss"],
            compilePath: "C:/",
            rootPath: "C:/",
            isAutoImport: false
          }
        }
        this.cacheCompileFileType = "scss"
        this.disabledTypes = 'jstsdart'
      },
      async onExportProjects() {
        try {
          const fileName = (await this.$http.beforeDownload({
            data: JSON.stringify(this.$store.state.projects)
          })).data.data
          window.open(`${process.env.NODE_ENV === 'production' ? '' : '/api'}/download?fileName=${fileName}`)
        }catch (err) {
          this.$notify.error({
            title: '匯出數據失敗',
            message: '你不會知道是怎麼了'
          })
        }
      },
      onOpenEditorProjectDialog(isEdit = false, project, index) {
        this.resetProjectRuleForm()
        if(isEdit === true) {
          const cloneProject = JSON.parse(JSON.stringify(project))
          const cacheCompileFileType = cloneProject.config.compileFile[1]
          this.isEditorProjectDialog = true
          this.isEditProject = true
          this.cacheProjectIndex = index
          this.cacheProject = cloneProject
          this.cacheCompileFileType = cacheCompileFileType
          this.changeDisabledTypes()
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
              this.$store.commit('ADD_PROJECT', JSON.parse(JSON.stringify(this.project)))
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
        this.$nextTick(() => this.$refs['project-rule-form'] && this.$refs['project-rule-form'].resetFields())
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
        this.$set(this.proj.config, this.pathSetKey, this.path)
        this.isPathDialog = false
      },
      async onOpenPathDialog(path, key) {
        this.path = path
        await this.onGetFilePath(path)
        this.isPathDialog = true
        this.isEditPath = true
        this.pathSetKey = key
        if(key === 'rootPath') {
          this.cachePathTitle = '專案路徑'
        } else if(key === 'compilePath') {
          this.cachePathTitle = '編譯路徑'
        }
      },
    },
  }
</script>
<style  scoped lang="scss">
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
    &--night {
      color: #fff;
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
    &--night {
      color: #fff;
    }
  }

  .colors {}
  .translate-tip {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    color: #606266;
    font-size: 13px;
    i {
      color: #e6a23c;
      font-size: 20px;
      margin-right: 4px;
    }
    &--night {
      color: #c0c0c0;
    }
  }
  .color {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    &__cube {
      min-width: 32px;
      height: 32px;
      margin-right: 4px;
      border-radius: 4px;
    }
    &__variable {
      width: 200px;
      margin-right: 4px;
      &::v-deep .el-input-group__prepend {
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    &__color {
      width: 150px;
      margin-right: 4px;
    }
    &__commit {
      flex: 1;
    }
  }

  .night-default-btn.is-plain:focus {
    background-color: transparent;
  }
  .night-default-btn {
    color: #fff;
    background-color: transparent;
    &:hover {
      background-color: transparent;
    }
  }

  .night-default-btn--disabled {
    color: #C0C4CC;
    background-color: transparent;
    &:hover {
      background-color: rgba(#fff, .2);
    }
  }
</style>