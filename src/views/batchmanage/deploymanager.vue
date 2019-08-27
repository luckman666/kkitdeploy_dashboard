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
            <el-checkbox v-model="configFileChecked" border size="medium">配置 </el-checkbox>
          </el-col>
        </div>
        <!--</el-col>-->
        <!-- end -->
        <el-col :span="12">

          <!-- 搜执行栏 -->
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
          <!-- 搜执行栏 -->
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

          <!-- 搜执行栏 -->
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

        </el-col>
        <el-col :span="12">
          <div class="filter-container">
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

          <!--<div class="filter-container">-->
          <!--<div class="block">-->
          <!--<span class="demonstration"></span>-->
          <!--<el-cascader-->
          <!--v-model="value"-->
          <!--placeholder="其他"-->
          <!--:options="OtherOpsList"-->
          <!--:props="{ expandTrigger: 'hover' }"-->
          <!--@change="handleChange">-->
          <!--</el-cascader>-->
          <!--</div>-->
          <!--</div>-->

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

      <!--<el-input v-model="uploadDest" :placeholder=remindInfo style="width: 50%;" class="filter-item"  />-->

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

    <!-- 金 榜 -->
    <!--<el-button type="text" @click="open">点击打开 Message Box</el-button>-->

  </div>

</template>

<script>

import { fetch_deploy_metadata, exec_deploy, fetch_config_file, updata_configfile, updata_ymlConfigfile, UnRarUploadFile } from '@/api/deploy'
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
      // OtherOpsList:[],
      SustomDataOpsList: [],
      DeployEnvOpsList: [],
      ToolOpsList: [],
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
      // upLoadData:{},
      upLoadFielCount: 0,
      uploadFileNameList: [],
      uploadObject: {},

      options: [{
        TimeOutValue: 30 * 60,
        label: '限时三十分钟'
        // disabled: true
      }, {
        TimeOutValue: 60 * 60,
        label: '限时一小时'
        // disabled: true
      }, {
        TimeOutValue: 60 * 60 * 3,
        label: '限时三小时'
      }, {
        TimeOutValue: 60 * 60 * 8,
        label: '限时八小时'
      }],
      TimeOutValue: 60 * 60,
      submitStatus: false,
      reviveStatus: true,
      configFileChecked: false,
      deployObjectInfo: {}
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
        // this.handleOther(response)
        this.handlecustomData(response)
        this.handleTool(response)
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
      this.textareaVisible = false
      this.dataListVisible = true


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
        this.$alert('<strong><img src='+ weiXinUrl + ' width=100px height=100px></strong>', '作者公众号', {
          dangerouslyUseHTMLString: true,
          // center: true
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
    handleChange(value) {
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
            this.content = response.data.ymkFile
          } else if (this.configFileChecked) {
            this.configFileFormVisible = true
          } else {
            this.handleModifyStatus(response.data)
            this.websock.onopen = this.websocketonopen(response.data)
            this.reSet()
            this.websock.onmessage = this.websocketonmessage
            this.websock.onerror = this.websocketonerror
            this.websock.onclose = this.websocketclose
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
          this.websock.onerror = this.websocketonerror
          this.websock.onclose = this.websocketclose
        }
      })
    },

    // weblocket
    //
    initWebSocket() { // 初始化weosocket
      const wsuri = process.env.VUE_APP_WS_BASE_API
      this.websock = new WebSocket(wsuri)

      this.websock.onmessage = this.websocketonmessage
      // this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
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
      } else {
        this.submitStatus = true
        this.reviveStatus = false
        this.dataList.push(message)
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
      // console.log('this.deployObjectInfo', this.deployObjectInfo)
      this.websocketsend(this.deployObjectInfo)
      this.reSet()
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
