<template>
  <div class="app-container">

    <el-row>

      <el-col :span="10">
        <!-- 搜索栏 -->
        <div class="filter-container">
          <el-col :span="12">
            <el-button
              v-waves
              :loading="uploadLoading"
              class="filter-item"
              type="primary"
              icon="el-icon-upload"
              @click="handleUpload"
            >
              {{ $t('table.upload') }}
            </el-button>
            <el-button
            v-waves
            :loading="downloadLoading"
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            @click="handleHeroes"
            >
            {{ $t('table.Heroes') }}
            </el-button>
          </el-col>
          <el-col :span="12">
            <!--超时:-->
            <el-button v-waves type="primary" class="filter-item" @click="handleCheckPort"><svg-icon icon-class="port"></svg-icon>&nbsp;{{ $t('table.checkProt') }}</el-button>
          </el-col>
        </div>
        <!-- end -->
        <!--菜单-->
        <el-col :span="12">

          <div class="filter-container">
            <div class="block">
              <span class="demonstration" />
              <el-cascader
                v-model="value"
                :options="DataDaseOpsList"
                placeholder="数据库"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              />
            </div>
          </div>

          <div class="filter-container">
            <div class="block">
              <span class="demonstration" />
              <el-cascader
                v-model="value"
                :options="ContainerOpsList"
                placeholder="容器"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              />
            </div>
          </div>

          <div class="filter-container">
            <div class="block">
              <span class="demonstration" />
              <el-cascader
                v-model="value"
                :options="StorageOpsList"
                placeholder="存储"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              />
            </div>
          </div>

          <div class="filter-container">
            <div class="block">
              <span class="demonstration" />
              <el-cascader
                v-model="value"
                :options="DeployEnvOpsList"
                placeholder="开发环境"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              />
            </div>
          </div>

          <div class="filter-container">
            <div class="block">
              <span class="demonstration" />
              <el-cascader
                v-model="value"
                :options="MiddlewareOpsList"
                placeholder="中间件"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              />
            </div>
          </div>

        </el-col>
        <el-col :span="12">

          <div class="filter-container">
            <el-col :span="11">
            <div class="block">
              <el-select v-model="TimeOutValue" placeholder="任务时长">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.TimeOutValue"
                  :disabled="item.disabled"
                />
              </el-select>
            </div>
            </el-col>
            <el-col :span="13" style="float:right" >
            <div>
              <el-checkbox v-model="configFileChecked" border size="medium">配置</el-checkbox>
            </div>
              </el-col>
          </div>
          <!-- 搜执行栏 -->
          <div class="filter-container">
            <div class="block">
              <span class="demonstration" />
              <el-cascader
                v-model="value"
                placeholder="反向代理"
                :options="ProxyOpsList"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              />
            </div>
          </div>

          <div class="filter-container">
            <div class="block">
              <span class="demonstration" />
              <el-cascader
                v-model="value"
                placeholder="实用工具"
                :options="ToolOpsList"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              />
            </div>
          </div>

          <div class="filter-container">
            <div class="block">
              <span class="demonstration" />
              <el-cascader
                v-model="value"
                placeholder="备份"
                :options="backupOpsList"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              />
            </div>
          </div>

          <div class="filter-container">
            <div class="block">
              <span class="demonstration" />
              <el-cascader
                v-model="value"
                placeholder="自定义"
                :options="SustomDataOpsList"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              />
            </div>
          </div>



        </el-col>
        <!--菜单-->
      </el-col>
      <el-col :span="14">
        <div v-if="textareaVisible" :style="{height:dataListHeight}">
          <el-card shadow="never" class="text-card">
            <el-input v-model="content" type="textarea" placeholder="请输入内容" />
          </el-card>
          <div>
            <p align="right">
              <el-button @click="reSetCommit">{{ $t('deploy.reset') }}</el-button>
              <el-button type="primary" :disabled="reviveStatus" @click="reviveLog">{{ $t('deploy.checklog') }}</el-button>
              <el-button type="primary" :disabled="submitStatus" @click="submitHandle">{{ $t('deploy.commit') }}</el-button></p>
          </div>
        </div>
        <div v-if="dataListVisible" :style="{height:dataListHeight}">
          <el-card shadow="never" class="text-card">
            <div id="dataWrapper">
              <div v-for="(item,index) in dataList" :key="index" class="data-item">{{ item }}</div>
            </div>
          </el-card>
          <p align="right"><el-button @click="goBack">返回</el-button></p>
        </div>
      </el-col>
    </el-row>

    <!-- 上传RAR弹出框 -->
    <el-dialog :visible.sync="execDialogFormVisible">
      <!--<el-button size="small" type="primary" @click="dialogStatus==='sendFile'?submitUpload():updateData()">确 定</el-button>-->

      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        :limit="1"
        :file-list="fileList"
        :auto-upload="false"
        :action="UploadUrl"
        :on-success="handleUploadSuccess"
        multiple
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将rar压缩包拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">1、请确认脚本文件夹与主执行脚本名字一样！</div>
        <div slot="tip" class="el-upload__tip">2、请确认文件夹内有base.config文件！</div>
        <div slot="tip" class="el-upload__tip">3、只能上传rar压缩包！！</div>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="execDialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitUpload">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传对话框 -->

    <!-- 上传config弹出框 -->
    <el-dialog :visible.sync="configFileFormVisible">
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        :limit="10"
        :file-list="fileList"
        :auto-upload="false"
        :action="UploadUrl"
        :data="deployObjectInfo"
        :on-success="handleUploadConfigSuccess"
        multiple
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将config配置文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">1、最多上传10个配置文件，不允许压缩哦！</div>
        <div slot="tip" class="el-upload__tip">2、配置文件会直接写到脚本文件夹下！</div>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="configFileFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitUpload">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传对话框 -->


  </div>

</template>

<script>

import { fetch_deploy_metadata, exec_deploy, fetch_config_file, updata_configfile, updata_ymlConfigfile, UnRarUploadFile, checkPort } from '@/api/deploy'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'

export default {

  directives: { waves },

  filters: {
    statusFilter(status) {
      const statusMap = {
        'true': '开启',
        'false': '关闭'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      dataLoading: true,
      dataListHeight: '',
      textareaVisible: true,
      dataListVisible: false,
      dataList: [],

      yml: false,

      content: '',

      list: null,
      listLoading: true,
      value: [],

      execDeplayDialogFormVisible: false,
      configFileFormVisible: false,

      // 部署元数据
      DataDaseOpsList: [],
      ProxyOpsList: [],
      ContainerOpsList: [],
      StorageOpsList: [],
      MiddlewareOpsList:[],
      SustomDataOpsList: [],
      DeployEnvOpsList: [],
      ToolOpsList: [],
      backupOpsList:[],
      deployObject: {},
      //  部署分类元素
      database: [],

      dialogStatus: '',
      textMap: {
        deploy: '部署应用'
      },
      downloadLoading: false,
      uploadLoading: false,
      // 上传对话框
      execDialogFormVisible: false,
      uploadDest: '',
      fileList: [],
      UploadUrl: `${process.env.VUE_APP_BASE_API}/api-utils/v1/upload/`,

      upLoadFielCount: 0,
      uploadFileNameList: [],
      uploadObject: {},

      options: [{
        TimeOutValue: 30 * 60,
        label: '限三十分钟'
        // disabled: true
      }, {
        TimeOutValue: 60 * 60,
        label: '限一小时'
        // disabled: true
      }, {
        TimeOutValue: 60 * 60 * 3,
        label: '限三小时'
      }, {
        TimeOutValue: 60 * 60 * 8,
        label: '限八小时'
      }],
      TimeOutValue: 60 * 60,
      submitStatus: false,
      reviveStatus: true,
      configFileChecked: false,
      deployObjectInfo: {},
      checkPortIp:{}
    }
  },
  created() {
    this.dataListHeight = document.documentElement.clientHeight - 180 + 'px'
    this.initDeployMetaData()
    this.initWebSocket()
  },
  updated() {
    this.$nextTick(function() {
      const dataWrapper = document.querySelector('#dataWrapper')
      if (dataWrapper) {
        dataWrapper.scrollTop = dataWrapper.scrollHeight
      }
    })
  },
  destroyed() {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  methods: {
    goBack() {
      this.dataListVisible = false
      this.textareaVisible = true
    },
    reviveLog() {
      this.dataListVisible = true
      this.textareaVisible = false
    },

    submitConfig() {
      this.handleNewCongfigFile(this.content)
    },
    submitYmlConfig() {
      this.handleNewYmlCongfigFile(this.content)
    },
    submitHandle() {
      if (this.yml) {
        this.submitYmlConfig()
      } else {
        this.submitConfig()
      }
    },
    initDeployMetaData() {
      fetch_deploy_metadata().then(response => {
        this.handleDatabase(response)
        this.handleProxy(response)
        this.handleContainer(response)
        this.handleStorage(response)
        this.handleDeployEnv(response)
        this.handleMiddleware(response)
        this.handlecustomData(response)
        this.handleTool(response)
        this.handleBackup(response)
      })
    },
    reSetCommit() {
      this.deployObject = {}
      this.content = ''
    },
    reSet() {
      this.yml = false
      this.deployObject = {}
      this.configFileFormVisible = false
      this.deployObjectInfo = {}
      this.submitStatus = false
      this.configFileChecked = false
      this.textareaVisible = true
      // this.content = ''
      this.dataListVisible = false
    },
    handleDatabase(response) {
      this.DataDaseOpsList = []
      const meteObject = JSON.parse(response.data).metaData.database
      for (const key in meteObject) {
        const tmpDate = {}
        tmpDate['value'] = key
        tmpDate['label'] = key
        tmpDate['children'] = []
        this.DataDaseOpsList.push(tmpDate)
        for (const firstInfo of meteObject[key]) {
          const childrenDic = {}
          childrenDic['value'] = firstInfo
          childrenDic['label'] = firstInfo
          tmpDate['children'].push(childrenDic)
        }
      }
    },
    handleProxy(response) {
      this.ProxyOpsList = []
      const meteObject = JSON.parse(response.data).metaData.proxy
      for (const key in meteObject) {
        const tmpDate = {}
        tmpDate['value'] = key
        tmpDate['label'] = key
        tmpDate['children'] = []
        this.ProxyOpsList.push(tmpDate)
        for (const firstInfo of meteObject[key]) {
          const childrenDic = {}
          childrenDic['value'] = firstInfo
          childrenDic['label'] = firstInfo
          tmpDate['children'].push(childrenDic)
        }
      }
    },
    handleContainer(response) {
      this.ContainerOpsList = []
      const meteObject = JSON.parse(response.data).metaData.container
      for (const key in meteObject) {
        const tmpDate = {}
        tmpDate['value'] = key
        tmpDate['label'] = key
        tmpDate['children'] = []
        this.ContainerOpsList.push(tmpDate)
        for (const firstInfo of meteObject[key]) {
          const childrenDic = {}
          childrenDic['value'] = firstInfo
          childrenDic['label'] = firstInfo
          tmpDate['children'].push(childrenDic)
        }
      }
    },
    handleDeployEnv(response) {
      this.DeployEnvOpsList = []
      const meteObject = JSON.parse(response.data).metaData.deployenv
      for (const key in meteObject) {
        const tmpDate = {}
        tmpDate['value'] = key
        tmpDate['label'] = key
        tmpDate['children'] = []
        this.DeployEnvOpsList.push(tmpDate)
        for (const firstInfo of meteObject[key]) {
          const childrenDic = {}
          childrenDic['value'] = firstInfo
          childrenDic['label'] = firstInfo
          tmpDate['children'].push(childrenDic)
        }
      }
    },
    handleHeroes() {
        const weiXinUrl = require("../../icons/weChat.jpg");
        this.$alert('<div style="float:left" ><strong><img src='+ weiXinUrl + ' width=200px height=200px></strong></div><div>1、有bug？</div><div>2、有意见？</div><div>3、想参与该项目？</div><div>4、获取项目最新动态？</div><div>5、共同学习全栈技术？</div><div>6、认识更多技术骚男？</div><div>7、没啥想法！就要喷波哥？</div><div>8、关注公众号！波哥等你！</div>', '作者公众号', {
          dangerouslyUseHTMLString: true,
          showConfirmButton:false,
        });
      },
    handleTool(response) {
      this.ToolOpsList = []
      const meteObject = JSON.parse(response.data).metaData.tool
      for (const key in meteObject) {
        const tmpDate = {}
        tmpDate['value'] = key
        tmpDate['label'] = key
        tmpDate['children'] = []
        this.ToolOpsList.push(tmpDate)
        for (const firstInfo of meteObject[key]) {
          const childrenDic = {}
          childrenDic['value'] = firstInfo
          childrenDic['label'] = firstInfo
          tmpDate['children'].push(childrenDic)
        }
      }
    },
    handleStorage(response) {
      this.StorageOpsList = []
      const meteObject = JSON.parse(response.data).metaData.storage
      for (const key in meteObject) {
        const tmpDate = {}
        tmpDate['value'] = key
        tmpDate['label'] = key
        tmpDate['children'] = []
        this.StorageOpsList.push(tmpDate)
        for (const firstInfo of meteObject[key]) {
          const childrenDic = {}
          childrenDic['value'] = firstInfo
          childrenDic['label'] = firstInfo
          tmpDate['children'].push(childrenDic)
        }
      }
    },
    handlecustomData(response) {
      this.SustomDataOpsList = []
      for (const key of JSON.parse(response.data).customData) {
        const tmpDate = {}
        const childrenDic = {}
        tmpDate['value'] = key
        tmpDate['label'] = key
        tmpDate['children'] = []
        childrenDic['value'] = key
        childrenDic['label'] = key

        this.SustomDataOpsList.push(tmpDate)
        tmpDate['children'].push(childrenDic)
      }
    },
    handleMiddleware(response){
      this.MiddlewareOpsList = []
      const meteObject = JSON.parse(response.data).metaData.middleware
      for (const key in meteObject) {
        const tmpDate = {}
        tmpDate['value'] = key
        tmpDate['label'] = key
        tmpDate['children'] = []
        this.MiddlewareOpsList.push(tmpDate)
        for (const firstInfo of meteObject[key]) {
          const childrenDic = {}
          childrenDic['value'] = firstInfo
          childrenDic['label'] = firstInfo
          tmpDate['children'].push(childrenDic)
        }
      }
    },
    handleChange(value) {
      this.reSet()
      this.deployObject['deployName'] = value[1]
      fetch_config_file(this.deployObject).then(response => {
        this.content = response.data[0]
      })
    },
    handleNewCongfigFile(configfileInfo) {
      if (this.content === '') {
        this.$message({
          message: '没有找到相关配置文件，请重新选择!',
          type: 'error'
        })
      } else {
        const configDic = {}
        configDic['configFile'] = configfileInfo
        configDic['deployName'] = this.deployObject['deployName']
        configDic['TimeOutValue'] = this.TimeOutValue
        updata_configfile(configDic).then(response => {
          this.deployObjectInfo = response.data
          if (response.data.ymkFile != null) {
            this.yml = true
            if (response.data.ymkFile === null){
              fetch_config_file(this.deployObject).then(response => {
              this.content = response.data[0]
            })
            } else {
              this.content = response.data.ymkFile
            }

          } else if (this.configFileChecked) {
            this.configFileFormVisible = true
          } else {
            this.handleModifyStatus(response.data)
            this.websock.onopen = this.websocketonopen(response.data)
            this.reSet()
            this.websock.onmessage = this.websocketonmessage
            this.reviveLog()
          }
        })
      }
    },
    handleNewYmlCongfigFile(configfileInfo) {
      const configDic = {}
      configDic['configFile'] = configfileInfo
      configDic['deployName'] = this.deployObject['deployName']
      configDic['TimeOutValue'] = this.TimeOutValue

      updata_ymlConfigfile(configDic).then(response => {
        if (this.configFileChecked) {
          this.configFileFormVisible = true
        } else {
          this.handleModifyStatus(response.data)
          this.websock.onopen = this.websocketonopen(response.data)
          this.reSet()
          this.websock.onmessage = this.websocketonmessage
          this.reviveLog()
        }
      })
    },
    handleBackup(response) {
      this.backupOpsList = []
      const meteObject = JSON.parse(response.data).metaData.backup
      for (const key in meteObject) {
        const tmpDate = {}
        tmpDate['value'] = key
        tmpDate['label'] = key
        tmpDate['children'] = []
        this.backupOpsList.push(tmpDate)
        for (const firstInfo of meteObject[key]) {
          const childrenDic = {}
          childrenDic['value'] = firstInfo
          childrenDic['label'] = firstInfo
          tmpDate['children'].push(childrenDic)
        }
      }
    },

    initWebSocket() { // 初始化weosocket
      const wsuri = process.env.VUE_APP_WS_BASE_API
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      // this.websock.onopen = this.websocketonopen;
      // this.websock.onerror = this.websocketonerror
      // this.websock.onclose = this.websocketclose
    },
    websocketonopen(actions) { // 连接建立之后执行send方法发送数据
      // let actions = {"root":"root1234"};
      this.websocketsend(actions)
    },
    websocketonerror() { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage(e) { // 数据接收
      var data = JSON.parse(e.data)
      var message = data['message']
      if (message === '52j840y$0_j%aa&') {
        this.submitStatus = false
        this.websock.onclose = this.websocketclose
      } else {
        this.submitStatus = true
        this.reviveStatus = false
        this.dataList.push(message)
        //
      }
    },

    // this.dataLoading = false

    websocketsend(Data) { // 数据发送
      this.websock.send(JSON.stringify(Data))
    },
    websocketclose(e) { // 关闭
      console.log('断开连接', e)
    },

    // weblogket end

    handleCheckPort() {
        this.$prompt('请输入要检查端口开放情况的IP（功能未开放）', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/,
          inputErrorMessage: 'IP格式不正确'
        }).then(({ value }) => {
          // this.websock.onmessage = this.websocketonmessage
          // this.checkPortIp['checkPortIp']=value
          // checkPort(this.checkPortIp)

        this.$message({
          message: '该功能暂未开放！',
          type: 'success'
        })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
    handleModifyStatus(row, status) {
      this.$message({
        message: row.writeConfigRutl,
        type: 'success'
      })
      row.status = status
    },
    handleUpload() {
      this.execDialogFormVisible = true
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    upLoadReset() {
      this.upLoadFielCount = 0
      this.uploadFileNameList = []
    },
    // 上传
    submitUpload() {
      this.upLoadReset()
      this.$refs.upload.submit()
    },
    handleUploadSuccess(response, file, fileList) {
      UnRarUploadFile(file).then(response => {
        this.$message({
          message: response.data.detail,
          type: 'success'
        })
        this.execDialogFormVisible = false
        this.uploadDest = ''
        this.fileList = []
        this.upLoadFielCount = 0
        this.uploadFileNameList = []
        this.initDeployMetaData()
      })
    },
    handleUploadConfigSuccess(data) {
      this.$message({
        message: data.detail,
        type: 'success'
      })

      this.websocketsend(this.deployObjectInfo)
      this.reSet()
      this.reviveLog()
    }

  }
}
</script>
<style>
  .filter-container{
    overflow: hidden;
  }
  .assets-dialog .el-dialog {
    width: 60%;
  }

  .dialog-row {
    line-height: 50px;
  }

  .el-upload, .el-upload-dragger {
    width: 100%;
  }
  .text-card,.el-card__body,.el-textarea,.el-textarea textarea{
    height: 100%;
  }
  .text-card .el-card__body{
    padding: 7px;
    font-size: 14px;
  }
  #dataWrapper{
    height:100%;
    overflow-y: auto;
  }
  .text-card .data-item
  {
    margin-bottom:5px
  }
</style>
