<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card>
      <!-- 搜索区 -->
      <el-row type="flex" justify="space-around">
        <!-- gutter是指定每个分栏的间隔 -->
        <!-- 分栏一共占24格 -->
        <el-col :span="20">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表单区 -->
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top-end">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top-start">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 用于 添加用户 的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed"
               :close-on-click-modal="false">
      <!-- 添加用户表单区 -->
      <el-form :model="addUserForm" status-icon :rules="addUserFormRules" ref="addUserFormRef" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password" autocomplete="off" show-password clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 用于 修改用户属性 的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed"
               :close-on-click-modal="false">
      <!-- 内容主体区 -->
      <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getuserlist, userstatechange, adduser, getuserinform, edituserinform, removeuser, getrole, changerole } from '../../api/index';
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      //验证邮箱的正则表达式
      const regEmail =
        /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (regEmail.test(value)) {
        return callback(); //合法邮箱
      }
      return callback(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rule, value, callback) => {
      //验证手机号的正则表达式
      const regMobile =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regMobile.test(value)) {
        return callback(); //合法手机号
      }
      return callback(new Error("请输入合法的手机号"));
    };
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      addDialogVisible: false, //控制添加用户对话框的显示与隐藏
      editDialogVisible: false, //控制修改用户对话框的显示与隐藏
      setRoleDialogVisible: false, //控制用户分配角色对话框的显示与隐藏
      addUserForm: {}, //添加用户的表单数据
      addUserFormRules: {
        //添加用户表单的验证规则对象
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名长度在3~10个字符", trigger: "blur", },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "密码长度在6~15个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editUserForm: {}, //修改用户的表单数据
      editUserFormRules: {
        //修改用户表单的验证规则对象
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      //需要被分配角色的用户信息
      userInfo: [],
      //所有角色的数据列表
      roleList: [],
      //已选中的角色ID值
      selectRoleId: ''
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    // 获取用户列表
    async getUsersList() {
      const res = await getuserlist(this.queryInfo);
      if (res) {
        this.userList = res.data.users;
        this.total = res.data.total;
      }
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize; //重新指定每页数据量
      this.getUsersList(); //带着新的分页请求获取数据
    },
    //监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage; //重新指定当前页
      this.getUsersList(); //带着新的分页请求获取数据
    },
    // 改变用户状态
    async userStateChange(userinfo) {
      const res = await userstatechange(userinfo);
      if (res) { this.$message.success("更新用户状态成功！"); }
      else { userinfo.mg_state = !userinfo.mg_state; }
    },
    // 添加用户对话框的关闭 清除未提交数据
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields();
    },
    // 使用添加用户对话框 添加用户
    addUser() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (valid) {
          const res = await adduser(this.addUserForm);
          if (res) {
            this.$message.success(res.meta.msg);
            this.addDialogVisible = false;
            this.getUsersList();
          }
        }
      });
    },
    // 获取 编辑用户信息 对话框中数据
    async showEditDialog(id) {
      const res = await getuserinform(id);
      if (res) {
        this.editUserForm = res.data;
        this.editDialogVisible = true;
      }
    },
    // 编辑用户信息对话框的关闭 清除未提交数据
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields();
    },
    // 点击按钮，修改用户信息
    editUser() {
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (valid) {
          const res = await edituserinform(this.editUserForm);
          // if(res.meta.status!=200){
          //   return this.$message.error('修改用户失败！');
          // }
          if (res) {
            this.$message.success(res.meta.msg);
            // 隐藏修改用户的对话框
            this.editDialogVisible = false;
            //重新获取用户列表数据
            this.getUsersList();
          }
        }
      });
    },
    // 点击按钮，通过id删除用户信息
    async removeUserById(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async() => {
          const res = await removeuser(id);
          if (res) {
            this.$message.success(res.meta.msg);
            this.getUsersList();
          }
        }, () => { this.$message({ type: "info", message: "已取消删除" }); })
    },
    //展示分配角色的对话框
    async setRole(user) {
      const res = getrole();
      if (res) {
        this.roleList = res.data;
        this.userInfo = user;//获取用户信息展示在页面
        this.setRoleDialogVisible = true;
      }
    },
    // 点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error('请选择要分配的角色！');
      }
      const res = await changerole(this.userInfo.id, this.selectRoleId);
      if (res) {
        this.$message.success(res.meta.msg);
        this.getUsersList();//刷新用户列表
        this.selectRoleId = '';//清空本次选择，避免影响下次
        this.setRoleDialogVisible = false;//关闭对话框
      }
    }
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
/* 增加分页区和上面表单区的间隙 */
.el-pagination {
  margin-top: 15px;
}
</style>
