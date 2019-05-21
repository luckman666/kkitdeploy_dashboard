<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-input v-model="search_obj.hostname" :placeholder="$t('table.hostname')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
       <el-input v-model="search_obj.ip" :placeholder="$t('table.ip')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-select v-model="search_obj.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-tickets" @click="handleHardware">
        {{ $t('table.updateAssesInfo') }}
      </el-button>

      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        {{ $t('table.reviewer') }}
      </el-checkbox>
    </div>
    <!-- end搜索栏 -->
    <!-- 横表显示 -->

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="assetsUserList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >

    <el-table-column
      type="selection"
      width="55">
    </el-table-column>


      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.date_created')" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date_created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>



      <el-table-column :label="$t('table.hostname')">
        <template slot-scope="{row}">
          <el-tag class="link-type" @click="handleUpdate(row)">{{ row.hostname }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.ip')" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" :label="$t('table.reviewer')" width="110px" align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.importance')" width="80px">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.comment')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.comment }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.status')" width="80px" class-name="status-col">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.is_active | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>



<!-- 分页 -->
    <pagination :total="pagination.count" :page.sync="pagination.page" :limit.sync="pagination.limit" @pagination="ListAssets" />


<!-- 创建弹出框内容 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="commit_obj" label-position="left" label-width="80px" >

        <el-row style="margin-bottom:0px;">
          <el-col :span="11">
            <el-form-item :label="$t('table.protocol')" prop="protocol">
              <el-select v-model="commit_obj.protocol" class="filter-item" placeholder="Please select" style="width: 100%">
                <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="11" style="float:right;">
            <el-form-item :label="$t('table.platform')" prop="protocol">
              <el-select v-model="commit_obj.platform" class="filter-item" placeholder="Please select">
                <el-option v-for="item in osType" :key="item.key" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-bottom:0px;">
          <el-col :span="11">
            <el-form-item :label="$t('table.ip')" prop="ip">
              <el-input v-model="commit_obj.ip" />
            </el-form-item>
          </el-col>

          <el-col :span="11" style="float:right;">
            <el-form-item :label="$t('table.public_ip')" prop="public_ip">
              <el-input v-model="commit_obj.public_ip" />
            </el-form-item>
          </el-col>
        </el-row>


        <el-row style="margin-bottom:0px;">
          <el-col :span="11">
            <el-form-item :label="$t('table.hostname')" prop="hostname">
              <el-input v-model="commit_obj.hostname" />
            </el-form-item>
          </el-col>

          <el-col :span="11" style="float:right;">
            <el-form-item :label="$t('table.is_active')" prop="is_active">
              <el-select v-model="commit_obj.is_active" class="filter-item" placeholder="Please select" style="width: 100%">
                <el-option v-for="item in assetsStatus" :key="item.key" :label="item.assetsValue" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-bottom:0px;">
        <el-col :span="11">
          <el-form-item :label="$t('table.node')" prop="node">
            <el-select v-model="commit_obj.nodes" class="filter-item" placeholder="Please select" style="width: 100%">
              <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="11" style="float:right;">
          <el-form-item :label="$t('table.lable')" prop="lable">
            <el-select v-model="commit_obj.lables" class="filter-item" placeholder="Please select">
              <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        </el-row>



        <el-form-item :label="$t('table.port')" prop="port">
          <el-input v-model="commit_obj.port" />
        </el-form-item>

          <el-form-item :label="$t('table.admin_user')" prop="lable">
            <el-select v-model="commit_obj.admin_user" class="filter-item" placeholder="Please select">
              <el-option v-for="item in amdinUserList" :key="item.key" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>

        <el-form-item :label="$t('table.importance')">
          <el-rate v-model="commit_obj.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>

        <el-form-item :label="$t('table.comment')">
          <el-input v-model="commit_obj.comment" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" placeholder="请写入相应备注……" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="danger" @click="deleteData">
          {{ $t('table.delete') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>

      </div>
    </el-dialog>

    <!--<el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">-->
      <!--<el-table :data="pvData" border fit highlight-current-row style="width: 100%">-->
        <!--<el-table-column prop="key" label="Channel" />-->
        <!--<el-table-column prop="pv" label="Pv" />-->
      <!--</el-table>-->
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>-->
      <!--</span>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>

import { fetch_Admin_User, create_Assets , delete_Assets,fetch_Assets_page,fetch_Assets, update_Assets,fetch_Hardware } from "@/api/assets";
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


const calendarTypeOptions = [
  'ssh',
  'rdp',
  'telnet (beta)',
  'vnc'
]
const osType = [
  'Linux',
  'Unix',
  'Windows',
  'Other'
]

const assetsStatus = [
  {'key':true,'assetsValue':'开启'}, {'key':false,'assetsValue':'关闭'}
]


export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'true': '开启',
        'false': '关闭'
        // deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      list: null,
      tableKey: 0,
      amdinUserList: null,
      total: 0,
      listLoading: true,

      btnStatus: false,
      importanceOptions: [],
      dialogUserVisible: false,
       //全选
      multipleSelection: [],
      calendarTypeOptions,
      osType,
      assetsStatus,
      sortOptions: [{ label: 'ID', key: '+id' }, { label: 'ID', key: '-id' }],
      showReviewer: false,
      commit_obj:{
        protocol: 'ssh',
        platform: 'Linux',
        importance: 1,
        port: 22,
        sort: '+id'
      },
      search_obj: {},
      assetsUserList: null,
      pagination: {
        page: 1,
        limit: 10,
        count: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑资产',
        create: '创建资产',
        delete: '删除资产'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "您的资产类型是必须的", trigger: "blur" }
        ],
        // timestamp: [
        //   { type: 'date', required: true, message: '资产创建时间是必须填写的', trigger: 'change' }
        //   ],
        ip: [
          { required: true, message: 'IP地址必须填写', trigger: 'blur' }
          ],
        os: [
          { required: true, message: '系统类型必须填写', trigger: 'blur' }
        ],
        hostname: [
          { required: true, message: '主机名必须填写', trigger: 'blur' }
        ]

      },
      downloadLoading: false
    }
  },
  created() {
    // this.getList()
    this.ListAssets()
    this.listAdminUser()

  },
  methods: {
    ListAssets(){
      this.listLoading = true;
        // console.log(this.pagination,'this.pagination%%%', this.search_obj,'this.search_obj%')
        fetch_Assets(this.pagination, this.search_obj).then(response => {
        // console.log('response.data!!!!',response)
        this.pagination.count = response.data.count;
        this.assetsUserList = response.data.results;
        // console.log('this.assetsUserList@@##',this.assetsUserList)
        this.listLoading = false;
      });
    },

    listAdminUser() {
      this.listLoading = true;
      fetch_Admin_User(this.pagination, this.search_obj).then(response => {
        // this.pagination.count = response.data.count;
        this.amdinUserList = response.data.results;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.ListAssets()
    },
    handleHardware(){


      // console.log('this.type',this.type)
      // for (let item of this.multipleSelection){
      //   item['type']='handleHardware'
      // }
      const dataTmp={}
      // const hostTmp={}
      const groupvars = {"g1key":"g1value"}
      // const hostTmp={'hosts':this.multipleSelection}
      dataTmp['group1']={'hosts':this.multipleSelection,groupvars}

      console.log('dataTmpdataTmp',dataTmp)
      // fetch_Hardware(this.multipleSelection)
      fetch_Hardware(dataTmp)
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    reset_search() {
      this.search_obj = {};
    },
    resetSearch() {
      this.reset_search();
      this.ListAssets();
    },
    handleCreate() {
      this.resetSearch()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.commit_obj = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.dialogFormVisible = true
    },
    handleSelectionChange(val) {
      // console.log('valvalval',val)
        this.multipleSelection = val;
      },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnStatus = true;
          create_Assets(this.commit_obj).then(() => {
            this.dialogFormVisible = false
            this.resetSearch()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
            this.btnStatus = false;
          })
        }
      })
    },
    deleteData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnStatus = true;
          delete_Assets(this.commit_obj).then(() => {
            this.dialogFormVisible = false
            this.resetSearch()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.btnStatus = false;
          })
        }
      })
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          update_Assets(this.commit_obj).then(() => {
            this.ListAssets()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // handleDelete(row) {
    //   this.$notify({
    //     title: '成功',
    //     message: '删除成功',
    //     type: 'success',
    //     duration: 2000
    //   })
    //   const index = this.list.indexOf(row)
    //   this.list.splice(index, 1)
    // },
    // handleFetchPv(pv) {
    //   fetchPv(pv).then(response => {
    //     this.pvData = response.data.pvData
    //     this.dialogPvVisible = true
    //   })
    // },
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
    }
  }
}
</script>
