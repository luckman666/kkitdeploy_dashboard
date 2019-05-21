<template>
  <div class="manager-user-container">
    <div class="filter-container">
      <el-row style="margin-bottom:20px;">
        <el-switch
        v-model="detailSearch"
        inactive-text="详细检索">
        </el-switch>
        <el-button class="filter-item" @click="resetSearch" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" :disabled="btnStatus">清除</el-button>
        <el-button class="filter-item" @click="handleCreate" style="float:right;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>
      </el-row>
      <el-row style="margin-bottom:5px;" v-show="detailSearch">
        <!--<el-col :span="7" :offset="1">-->
          <!--名称： <el-input size="medium" style="width: 200px" v-model="search_obj.name" class="filter-item" placeholder="根据姓名模糊搜索"></el-input>-->
        <!--</el-col>-->
        <el-col :span="7" :offset="1">
          用户名： <el-input size="medium" style="width: 190px;" v-model="search_obj.name" class="filter-item" placeholder="根据用户名模糊搜索"></el-input>
        </el-col>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchUser" style="float:right;" :disabled="btnStatus">搜索</el-button>
      </el-row>

    </div>

    <!-- 用户横栏信息表 -->
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <el-table-column width="50px" align="center" label="ID">
        <template slot-scope="user">
          <span>{{ user.row.id }}</span>
        </template>
      </el-table-column>


      <el-table-column  align="center" label="用户名">
        <template slot-scope="user">
          <span>{{ user.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="管理资产数">
        <template slot-scope="user">
          <span>{{ user.row.full_name }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="备注">
        <template slot-scope="user">
          <span>{{ user.row.comment }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" >
        <template slot-scope="user">
          <el-button type="warning" size="medium" @click="handleUpdate(user.row)" :disabled="btnStatus">编辑</el-button>
          <!--<el-button type="danger" size="medium" @click="handleStatus(user.row)" :disabled="btnStatus">改变状态</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="pagination.count">
      </el-pagination>
    </div>

<!-- 创建用户 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogUserVisible" width="45%" top="20vh">
      <el-form :rules="rules" ref="userForm" :model="commit_obj" label-position="left" >
        <el-row style="margin-bottom:10px;">
          <el-col :span="11" style="margin-left: 5px;">
            <el-form-item label="登录账号" prop="name">
              <el-input v-model="commit_obj.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" style="float:right;">
            <el-form-item label="密码" prop="password">
              <el-input v-model="commit_obj.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


        <el-form-item label="ssh私钥(可选)" prop="privatkey">
          <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="commit_obj.private_key">
          <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

      <el-form-item label="备注" prop="info">
        <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="commit_obj.comment">
        </el-input>
      </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button type="danger" size="medium" @click="deleteUser" :disabled="btnStatus">删除</el-button>
        <el-button type="primary" @click="handleQRCode" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

    <!-- 二次验证 -->
    <el-dialog title="QRCode二次验证" :visible.sync="dialogQRCodeVisible" width="30%" top="20vh">
      <!--<span>请确认您的权限是运维工程师并且已经拥有QR-Code</span>-->
      <!--<el-input v-model="commit_obj.qrcode" placeholder="请输入您当前账户的QR-Code"></el-input>-->
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createUser" :disabled="btnStatus">创建</el-button>
        <el-button v-else-if="dialogStatus=='update'" type="primary" @click="updateUser" :disabled="btnStatus">更新</el-button>
        <el-button v-else-if="dialogStatus=='group'" type="primary" @click="updateGroup" :disabled="btnStatus">归类</el-button>
        <el-button v-else-if="dialogStatus=='status'" type="primary" @click="statusUser" :disabled="btnStatus">更改</el-button>
        <el-button v-else-if="dialogStatus=='reset'" type="primary" @click="resetUser" :disabled="btnStatus">重置</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
create_Admin_User,fetch_Admin_User,delete_admin_User,update_admin_User
} from "@/api/assets";
import {
  is_expire_User,
} from "@/api/auth";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      btnStatus: false,
      detailSearch: false,
      search_obj: {},
      commit_obj: {},
      // fileList: [],
      pagination: {
        page: 1,
        count: 0
      },

      dialogStatus: "",
      // 授权时长选项
      expire: '' ,
      textMap: {
        group: "管理组",
        update: "编辑用户",
        create: "新建管理用户",
        reset: "重置用户",
        status: "更改用户状态"
      },
      dialogGroupVisible: false,
      dialogUserVisible: false,
      dialogQRCodeVisible: false,
      rules: {
        name: [
          { required: true, message: "系统用户名是必须的", trigger: "blur" }
        ],
        password: [
          { required: true, message: "系统用户密码是必须的", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  filters: {
    statusFilter(is_active) {
      if (is_active) {
        return "true";
      } else {
        return "false";
      }
    }
  },
  methods: {
    init() {
      this.listLoading = true;
      fetch_Admin_User(this.pagination, this.search_obj).then(response => {
        console.log('response.data!!!!',response)
        this.pagination.count = response.data.count;
        this.list = response.data.results;
        this.listLoading = false;
      });
    },

    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
    handlePreview(file) {
        console.log(file);
      },
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
    beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },

    // 创建用户全选组方法
    handleCheckAllChange(val) {
      this.commit_obj.groups = []
      const newCheckedGroup = this.groupList
      this.checkedGroup = val ? newCheckedGroup : [];
      if (this.checkedGroup) {
          for (const newGroupObjId of this.checkedGroup) {
          this.commit_obj.groups.push(
            newGroupObjId.id
          );
        }
      }
      },

    reset_commit() {
      this.commit_obj = {
        is_active: false
      };
    },
    reset_search() {
      this.search_obj = {};
    },
    reset_dialog() {
      this.dialogGroupVisible = false
      this.dialogUserVisible = false
      this.dialogQRCodeVisible = false
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.init();
    },
    searchUser() {
      this.init();
    },
    resetSearch() {
      this.reset_search();
      this.init();
    },
    activeState(is_active) {
      if (is_active) {
        return "可使用";
      } else {
        return "已禁用";
      }
    },
    handleGroup(row) {
      this.dialogStatus = "group";
      this.dialogGroupVisible = true;
      this.commit_obj = Object.assign({}, row);
      this.init_pmngroup();
    },
    handleCreate(row) {
      this.dialogStatus = "create";
      this.dialogUserVisible = true;
      this.reset_commit();
      this.$nextTick(() => {
        this.$refs["userForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.commit_obj = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.$nextTick(() => {
        this.$refs["userForm"].clearValidate();
      });
      this.dialogUserVisible = true;
    },
    handleDelete(row) {
      this.dialogStatus = "delete";
      this.dialogGroupVisible = true;
      this.commit_obj = Object.assign({}, row);
      this.init_pmngroup();
    },

    handleQRCode() {
      is_expire_User()
        .then(response => {
          if (response.data.isexpire) {
            this.reset_dialog()
            this.dialogQRCodeVisible = true
          } else {
            if (this.dialogStatus === "group") {
              this.updateGroup()
            } else if (this.dialogStatus === "update") {
              this.updateUser()
            } else if (this.dialogStatus === "status"){
              this.statusUser()
            } else if (this.dialogStatus === "reset"){
              this.resetUser()
            } else if (this.dialogStatus === "delete"){
              this.deleteUser()
            }else {
              this.createUser()
            }
          }
        }).catch(error => {
          this.$message({
            showClose: true,
            message: "过期时间确定失败",
            type: "danger"
          })
        })
    },
    handleReset(row) {
      this.commit_obj = Object.assign({}, row)
      this.dialogStatus = "reset"
      this.$confirm("此操作将重置用户二次验证, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.handleQRCode()
      })
    },
    resetUser(){
      this.commit_obj.have_qrcode = false
        update_admin_User(this.commit_obj).then(response => {
          this.$message({
            showClose: true,
            message: "重置成功",
            type: "success"
          });
          this.init()
          this.reset_dialog()
        })
    },
    deleteUser(){
      // this.commit_obj.have_qrcode = false
        delete_admin_User(this.commit_obj).then(response => {
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.init()
          this.reset_dialog()
        })
    },
    handleStatus(row) {
      this.dialogStatus = 'status'
      this.commit_obj = Object.assign({}, row)
      this.$confirm("此操作将修改该用户状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.handleQRCode()
      })
    },
    handleDetail(row) {
      return
    },
    createUser() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          this.btnStatus = true;
          console.log('this.commit_obj!!',this.commit_obj)
          create_Admin_User(this.commit_obj)
            .then(() => {
              this.resetSearch();
              this.reset_dialog();
              this.$message({
                showClose: true,
                message: "添加用户成功",
                type: "success"
              });
              this.btnStatus = false;
            })
            .catch(error => {
              this.btnStatus = false;
              this.reset_dialog()
            });
        }
      });
    },
    updateUser() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          this.btnStatus = true;
          update_admin_User(this.commit_obj)
            .then(() => {
              this.reset_commit();
              this.init();
              this.reset_dialog();
              this.commit_obj.type = this.dialogStatus
              this.$message({
                showClose: true,
                message: "更新成功",
                type: "success"
              });
              this.btnStatus = false;
            })
            .catch(error => {
              this.btnStatus = false;
              this.reset_dialog()
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.manager-user-container {
  padding: 32px;
  /*background-color: rgb(240, 242, 245);*/
}
</style>
