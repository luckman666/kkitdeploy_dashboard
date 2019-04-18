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
         <el-col :span="7" :offset="1">
          联系方式： <el-input size="medium" style="width: 200px;" v-model="search_obj.phone" class="filter-item" placeholder="根据电话号码模糊搜索"></el-input>
        </el-col>
        <el-col :span="7" :offset="1">
          姓名： <el-input size="medium" style="width: 200px;" v-model="search_obj.name" class="filter-item" placeholder="根据姓名模糊搜索"></el-input>
        </el-col>
        <el-col :span="5" :offset="1">
          用户名： <el-input size="medium" style="width: 200px;" v-model="search_obj.username" class="filter-item" placeholder="根据用户名模糊搜索"></el-input>
        </el-col>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchUser" style="float:right;" :disabled="btnStatus">搜索</el-button>
      </el-row>
      <el-row style="margin-bottom:20px;" v-show="detailSearch">
         <el-col :span="7" :offset="1">
          电子邮箱： <el-input size="medium" style="width: 200px;" v-model="search_obj.email" class="filter-item" placeholder="根据邮箱精准搜索"></el-input>
        </el-col>
        <el-col :span="7" :offset="1">
          状态： 
          <el-select v-model="search_obj.is_active" placeholder="请选择" clearable>
            <el-option
              key="True"
              label="可使用"
              value="True">
            </el-option>
            <el-option
              key="False"
              label="禁用"
              value="False">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <!--<el-button class="filter-item" @click="handleCreate()" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="btnStatus">新增</el-button>-->
    </div>

    <!-- 用户横栏信息表 -->
    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
              style="width: 100%">

      <el-table-column width="50px" align="center" label="ID">
        <template slot-scope="user">
          <span>{{ user.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="状态" class-name="status-col" >
        <template slot-scope="user">
          <el-tag :type="user.row.is_active | statusFilter">{{ activeState(user.row.is_active) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="用户名">
        <template slot-scope="user">
          <span>{{ user.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="名称">
        <template slot-scope="user">
          <span>{{ user.row.full_name }}</span>
        </template>
      </el-table-column>

      <!--<el-table-column  align="center" label="密码">-->
        <!--<template slot-scope="user">-->
          <!--<span>{{ user.row.password }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column  align="center" label="邮箱">
        <template slot-scope="user">
          <span>{{ user.row.email8531 }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="号码">
        <template slot-scope="user">
          <span>{{ user.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="应用组关联">
        <template slot-scope="user">
          <span>{{ user.row.group_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="二次验证时间">
        <template slot-scope="user">
          <span>{{ user.row.expire }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="220px" >
        <template slot-scope="user">
          <!--<el-button type="primary" size="medium" @click="handleGroup(user.row)" :disabled="btnStatus">管理组</el-button>-->
          <el-button type="warning" size="medium" @click="handleUpdate(user.row)" :disabled="btnStatus">编辑</el-button>
          <!--<el-button type="danger" size="medium" @click="handleReset(user.row)" :disabled="btnStatus">重置</el-button>-->
          <el-button type="danger" size="medium" @click="handleStatus(user.row)" :disabled="btnStatus">改变状态</el-button>
          <!--<el-button type="primary" size="medium" @click="handleDetail(user.row)" disabled="">操作详情</el-button>-->
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

        <el-form-item label="登录用户名" prop="username">
          <el-input v-model="commit_obj.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="commit_obj.password"></el-input>
        </el-form-item>

        <el-form-item label="面板显示名" prop="full_name">
          <el-input v-model="commit_obj.full_name"></el-input>
        </el-form-item>

        <el-form-item label="Phone" prop="phone">
          <el-input v-model="commit_obj.phone"></el-input>
        </el-form-item>
        
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="commit_obj.email"></el-input>
        </el-form-item>

        <el-form-item label="头衔与位置" prop="info">
          <el-input v-model="commit_obj.info"></el-input>
        </el-form-item>

        <el-form-item label="二次验证时间" prop="expire">
          <el-input-number 
          :min="1"
          v-model="commit_obj.expire"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button type="primary" @click="handleQRCode" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>


<!-- 编辑用户组 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogGroupVisible" width="48%" top="7vh">
      <el-form ref="userGrpForm" :model="commit_obj" label-position="left" label-width="100px" style='width: 700px; margin-left:40px;'>
        <el-form-item label="所属用户组" prop="users">
          <el-transfer v-model="commit_obj.groups" :data="groups" placeholder="请选择所属用户组" filterable>
          </el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupVisible = false" :disabled="btnStatus">取消</el-button>
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
  fetch_UserListByPage,
  create_User,
  update_User,
  fetch_PmnGroupList,
  is_expire_User
} from "@/api/auth";
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      btnStatus: false,
      // dialogStatus: "",
      detailSearch: false,
      search_obj: {},
      commit_obj: {},
      pagination: {
        page: 1,
        count: 0
      },
      groups: [],
      dialogStatus: "",
      textMap: {
        group: "管理组",
        update: "编辑用户",
        create: "新建用户",
        reset: "重置用户",
        status: "更改用户状态"
      },
      dialogGroupVisible: false,
      dialogUserVisible: false,
      dialogQRCodeVisible: false,
      rules: {
        username: [
          { required: true, message: "您的用户名是必须的", trigger: "blur" }
        ],
        password: [
          { required: true, message: "您的密码是必须的", trigger: "blur" }
        ],
        full_name: [
          { required: true, message: "您的姓名是必须的", trigger: "blur" }
        ],
        email: [
          { required: true, message: "您的邮箱是必须的", trigger: "blur" }
          ],
        phone: [
          {
            required: true,
            message: "您的手机号码是必须的",
            trigger: "blur"
          },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "您输入的手机号码有误",
            trigger: "blur"
          }
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
        return "success";
      } else {
        return "danger";
      }
    }
  },
  methods: {
    init() {
      this.listLoading = true;
      fetch_UserListByPage(this.pagination, this.search_obj).then(response => {
        console.log('response.data!!!!@@!',response.data)
        this.pagination.count = response.data.count;
        this.list = response.data.results;
        this.listLoading = false;
      });
    },
    init_pmngroup() {
      fetch_PmnGroupList().then(response => {
        this.groups = [];
        for (const group of response.data) {
          this.groups.push({
            key: group.id,
            label: group.name,
            disabled: false
          });
        }
      });
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
    // handleUpdate(row) {
    //   this.commit_obj = Object.assign({}, row); // copy obj
    //   this.dialogStatus = "update";
    //   this.$nextTick(() => {
    //     this.$refs["userForm"].clearValidate();
    //   });
    //   this.dialogUserVisible = true;
    // },
    handleUpdate(row){
      this.commit_obj = Object.assign({}, row);
      this.$router.push({name: "edituser", params: {'userinfo':this.commit_obj}});
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
            } else {
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
        update_User(this.commit_obj).then(response => {
          this.$message({
            showClose: true,
            message: "重置成功",
            type: "success"
          });
          this.init()
          this.reset_dialog()
        })
    },
    statusUser(){
      this.commit_obj.is_active = !this.commit_obj.is_active
      update_User(this.commit_obj).then(response => {
          this.$message({
            showClose: true,
            message: "状态修改成功",
            type: "success"
          })
          this.init()
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
          console.log('this.commit_obj!!!!',this.commit_obj)
          create_User(this.commit_obj)
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
          update_User(this.commit_obj)
            .then(() => {
              this.reset_commit();
              this.init();
              this.reset_dialog()
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
    },
    updateGroup() {
      this.$refs["userGrpForm"].validate(valid => {
        if (valid) {
          this.btnStatus = true;
          update_User(this.commit_obj)
            .then(() => {
              this.resetSearch();
              this.reset_dialog()
              this.$message({
                showClose: true,
                message: "更新组成功",
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
