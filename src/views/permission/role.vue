<template>
  <div class="app-container">
    <el-row style="margin-bottom:20px;">
    <el-switch v-model="detailSearch" inactive-text="详细检索">
    </el-switch>
    <el-button type="primary" @click="resetSearch" style="margin-left: 10px;">
      {{ $t('permission.clear') }}
    </el-button>
    <el-button type="primary" @click="handleAddRole" style="float:right;">
      {{ $t('permission.addRole') }}
    </el-button>
    </el-row>

    <!-- 权限 组名称 -->
    <el-row style="margin-bottom:20px;" v-show="detailSearch">
    <el-col :span="7" :offset="1">
          权限：
          <el-input size="medium" style="width: 200px;" v-model="search_obj.permission" class="filter-item" placeholder="模糊查找权限"></el-input>
    </el-col>
    <el-col :span="7" :offset="1">
          组名称：
          <el-input size="medium" style="width: 200px;" v-model="search_obj.name" class="filter-item" placeholder="模糊查找权限组名称"></el-input>
    </el-col>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchGroup" style="float:right;" :disabled="btnStatus">搜索</el-button>
    </el-row>
    <!-- end 权限 组名称 -->

    <el-table :data="list" v-loading="listLoading" element-loading-text="你等会！着啥急" border fit highlight-current-row style="width: 100%;margin-top:30px;" border>

      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>


      <el-table-column align="center" label="角色名" width="120">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>


      <el-table-column align="header-center" label="权限列表">
        <div slot-scope="scope">
          <template v-for="permission in scope.row.permissions">
            <el-tag :key="permission.id">{{ permissions_tag[permission] }}</el-tag>
          </template>
        </div>
      </el-table-column>


      <el-table-column align="center" label="操作" width="190">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope)">
            {{ $t('permission.editPermission') }}
          </el-button>
          <el-button type="danger" size="small" @click="deleteGroup(scope)">
            {{ $t('permission.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="routesData" :props="defaultProps" show-checkbox node-key="path" class="permission-tree" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRole">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogGroupVisible" width="50%" top="18vh">
      <el-form :rules="rules" ref="groupForm" :model="commit_obj" label-position="left" label-width="100px" >

        <el-form-item label="权限组名称" prop="name" >
          <el-tooltip content="请输入您的权限组名称，如:云服务平台开发组" placement="top" effect="light">
            <el-input v-model="commit_obj.name"></el-input>
          </el-tooltip>
        </el-form-item>


        <el-form-item label="所属用户组" prop="users">
          <el-transfer v-model="commit_obj.permissions" :data="permissions" placeholder="请选择权限" filterable>
          </el-transfer>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupVisible = false" :disabled="btnStatus">取消</el-button>
        <el-button type="primary" @click="handleQRCode" :disabled="btnStatus">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="QRCode二次验证" :visible.sync="dialogQRCodeVisible" width="30%" top="20vh">
      <!--<span>请确认您的权限是运维工程师并且已经拥有QR-Code</span>-->
      <!--<el-input v-model="commit_obj.qrcode" placeholder="请输入您当前账户的QR-Code"></el-input>-->
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createGroup" :disabled="btnStatus">创建</el-button>
        <el-button v-else-if="dialogStatus=='update'" type="primary" @click="updateGroup" :disabled="btnStatus">更新</el-button>
        <el-button v-else-if="dialogStatus=='delete'" type="primary" @click="deleteGroup" :disabled="btnStatus">删除</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import i18n from '@/lang'
import { fetch_Permission,fetch_PmnGroupListByPage,is_expire_User,update_PmnGroup,create_PmnGroup,delete_PmnGroup } from '@/api/auth'

const defaultRole = {
  key: '',
  name: '',
  permissions: '',
  routes: []
}

export default {
  data() {
    return {
      list: null,
      // 加载状态描述
      listLoading: true,
      // 角色对象赋值给role
      role: Object.assign({}, defaultRole),
      // routes: [],
      rolesList: [],
      dialogVisible: false,
      // 权限对象集合列表，每个权限包含三个属性：disabled:false,key: 41，label: "罗列所有权限"
      permissions: [],
      // 所有权限和其所对应的id号的列表，例如:6: "修改文件"
      permissions_tag: [],
      // 收索对象存储集合
      search_obj: {},
      // 搜索按钮是否显示，默认不显示
      btnStatus: false,
      detailSearch: false,
      dialogType: 'new',
      checkStrictly: false,
      pagination: {
        page: 1,
        count: 0
      },
      // 新增角色相关参数
      dialogStatus: "",
      commit_obj: {},
      textMap: {
        create: "创建权限组",
        update: "修改权限组"
      },
      dialogGroupVisible: false,
      dialogQRCodeVisible: false,
      // 新建组的约束参数
      rules: {
        name: [
          {
            required: true,
            message: "应用组名称是必须的",
            trigger: "blur"
          }
        ]
      },

      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.init()
    // 获取路径，暂时先不做
    // this.getRoutes()
    // 获取角色
    this.getRoles()
    // 获取权限数据的函数
    this.init_permission_name()
  },
  methods: {
    init() {
      // 执行该方法时设置加载状态为true
      this.listLoading = true;
      // 获取权限组，共有多少个组，每个组ID和name
      fetch_PmnGroupListByPage(this.pagination, this.search_obj).then(
        response => {
          // 有多少个组
          this.pagination.count = response.data.count;
          // 每个组所包含的权限
          this.list = response.data.results;
          // console.log('this.list!!!!!',this.list)
          // 加载结束，设置取消状态
          this.listLoading = false;
        }
      );
    },
    // 创建组
    createGroup() {
      this.$refs["groupForm"].validate(valid => {
        if (valid) {
          this.btnStatus = true;
          create_PmnGroup(this.commit_obj)
            .then(() => {
              this.init();
              this.reset_dialog();
              this.$message({
                showClose: true,
                message: "创建成功",
                type: "success"
              });
              this.btnStatus = false;
            })
            .catch(error => {
              this.btnStatus = false;
              this.reset_dialog();
            });
        }
      });
    },
    // 删除组
    deleteGroup(scope) {
          this.btnStatus = true;
          delete_PmnGroup(scope.row)
            .then(() => {
              this.init();
              this.reset_dialog();
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success"
              });
              this.btnStatus = false;
            })
            .catch(error => {
              this.btnStatus = false;
              this.reset_dialog();
            });
    },

    reset_dialog() {
      this.dialogGroupVisible = false;
      this.dialogQRCodeVisible = false;
    },
    // 输入验证码（临时token）
    handleQRCode() {
      // 验证用户是否已经超时
      is_expire_User()
        .then(response => {
          if (response.data.isexpire) {
            this.dialogGroupVisible = false;
            this.dialogQRCodeVisible = true;
          } else {
            if (this.dialogStatus === "create") {
              this.createGroup();
            } else if (this.dialogStatus === "update") {
              this.updateGroup();
            } else {
              // delete
            }
          }
        })
        .catch(error => {
          this.$message({
            showClose: true,
            message: "过期时间确定失败",
            type: "danger"
          });
        });
    },

    // 创建新角色，更新的组
    updateGroup() {
      this.$refs["groupForm"].validate(valid => {
        if (valid) {
          this.btnStatus = true;
          update_PmnGroup(this.commit_obj)
            .then(() => {
              this.init();
              this.reset_dialog();
              this.$message({
                showClose: true,
                message: "更新权限组成功",
                type: "success"
              });
              this.btnStatus = false;
            })
            .catch(error => {
              this.btnStatus = false;
              this.reset_dialog();
              console.log(error);
            });
        }
      });
    },
    // 更新组
    handleUpdate(scope) {
      this.dialogStatus = "update";
      this.dialogGroupVisible = true;
      this.commit_obj = Object.assign({}, scope.row);
    },

    // 新增角色
    handleAddRole() {
      this.reset_commit();
      this.dialogStatus = "create";
      this.dialogGroupVisible = true;
      this.$nextTick(() => {
        this.$refs["groupForm"].clearValidate();
      });
    },
    reset_commit() {
      this.commit_obj = {};
    },

    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      const routes = this.generateRoutes(res.data)
      this.routes = this.i18n(routes)
    },
    // 获取角色
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    // 清除搜索内容
    resetSearch() {
      this.reset_search();
      this.getRoles()
    },
    // 按组名称搜索
    searchGroup() {
      this.init();
    },
    i18n(routes) {
      const app = routes.map(route => {
        route.title = i18n.t(`route.${route.title}`)
        if (route.children) {
          route.children = this.i18n(route.children)
        }
        return route
      })
      return app
    },

    init_permission_name() {
      fetch_Permission().then(response => {

        this.permissions_tag = [];
        for (const per of response.data) {
          // 设置权限标签对象，ID=name形式的列表
          this.permissions_tag[per.id] = per.name;
        }
        this.permissions = [];
        for (const per of response.data) {
          // 设置权限列表对象数组，重新构造对象属性
          this.permissions.push({
            key: per.id,
            label: per.name,
            disabled: false
          });
        }
      });
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    // handleAddRole() {
    //   this.role = Object.assign({}, defaultRole)
    //   if (this.$refs.tree) {
    //     this.$refs.tree.setCheckedNodes([])
    //   }
    //   this.dialogType = 'new'
    //   this.dialogVisible = true
    // },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    // handleDelete({ $index, row }) {
    //   this.$confirm('Confirm to remove the role?', 'Warning', {
    //     confirmButtonText: 'Confirm',
    //     cancelButtonText: 'Cancel',
    //     type: 'warning'
    //   })
    //     .then(async() => {
    //       await deleteRole(row.key)
    //       this.rolesList.splice($index, 1)
    //       this.$message({
    //         type: 'success',
    //         message: 'Delete succed!'
    //       })
    //     })
    //     .catch(err => { console.error(err) })
    // },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        await updateRole(this.role.key, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].key === this.role.key) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRole(this.role)
        this.role.key = data.key
        this.rolesList.push(this.role)
      }

      const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${key}</div>
            <div>Role Nmae: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },
    // 重置收索的值
    reset_search() {
      this.search_obj = {};
    },
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
