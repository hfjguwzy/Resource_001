<template>
  <div class="facility-list-box">
    <!-- 搜索区 -->
    <el-form class="search" ref="searchForm" :model="searchForm" label-suffix=":" inline :rules="searchFormRules">
      <el-form-item label="租户编号" prop="tenantId">
        <el-input v-model="searchForm.tenantId" />
      </el-form-item>
      <el-form-item label="租户名称" prop="tenantName">
        <el-input v-model="searchForm.tenantId" />
      </el-form-item>
      <el-form-item label="所属城市" prop="city">
        <el-input v-model="searchForm.city" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
        <el-button type="warning" icon="el-icon-refresh" size="small" @click="resetsearchForm">重置</el-button>
        <!-- <el-button type="success" icon="el-icon-download" size="small">导出</el-button> -->
      </el-form-item>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addFacility">添加设备</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表单区 -->
    <el-table :data="facilities" v-loading="listLoad" stripe style="width: 100%">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="租户编号" prop="tenantId"></el-table-column>
      <el-table-column label="租户名称" prop="tenantName"></el-table-column>
      <el-table-column label="所属城市" prop="city"></el-table-column>
      <el-table-column label="联系人员" prop="linkMan"></el-table-column>
      <el-table-column label="联系电话" prop="phone"></el-table-column>
      <el-table-column label="邮件地址" prop="email"></el-table-column>
      <!-- <el-table-column label="所属应用" prop="serviceAddress" v-model="facilities.remark"></el-table-column> -->
      <el-table-column label="备注信息" prop="remark"></el-table-column>
      <el-table-column label="操作" width="200px" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="editFacility(scope.row.cspTenant)">修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteFacility(scope.row.cspTenant.id)">删除
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-tickets" @click="checkFacility(scope.row.cspTenant)">查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <div class="list--pagination">
      <el-pagination background layout="prev, pager, next" :current-page="queryInfo.pageNum" :total="queryInfo.total"
                     @current-change="handleCurrentChange"> </el-pagination>
    </div>
    <!-- 对话框 -->
    <el-dialog :title="changename" :visible.sync="addFacilityVisible" width="50%" @close="dialogClosed"
               :close-on-click-modal="false">
      <el-form :model="addFacilityForm" status-icon :rules="addFacilityFormRules" ref="addFacilityFormRef"
               label-width="100px" label-suffix=":" inline>
        <el-form-item label="租户名称" prop="tenantName">
          <el-input autocomplete="off" clearable v-model="addFacilityForm.tenantName" :disabled="dialogtype==='check'">
          </el-input>
        </el-form-item>
        <el-form-item label="租户编号" prop="tenantId">
          <el-input autocomplete="off" clearable v-model="addFacilityForm.tenantId" :disabled="dialogtype==='check'">
          </el-input>
        </el-form-item>
        <el-form-item label="id" prop="id">
          <el-input autocomplete="off" clearable v-model="addFacilityForm.id" :disabled="dialogtype==='check'">
          </el-input>
        </el-form-item>
        <el-form-item label="所属城市" prop="city">
          <el-input autocomplete="off" clearable v-model="addFacilityForm.city" :disabled="dialogtype==='check'">
          </el-input>
        </el-form-item>
        <el-form-item label="联系人员" prop="linkMan">
          <el-input autocomplete="off" clearable v-model="addFacilityForm.linkMan" :disabled="dialogtype==='check'">
          </el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input autocomplete="off" clearable v-model="addFacilityForm.phone" :disabled="dialogtype==='check'">
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input autocomplete="off" clearable v-model="addFacilityForm.email" :disabled="dialogtype==='check'">
          </el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input autocomplete="off" clearable v-model="addFacilityForm.remark" :disabled="dialogtype==='check'">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFacilityVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickFacility" :loading="submitLoad">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { async } from '@sheca/ukjsbridge-http'
import { mapActions } from 'vuex'
export default {
  computed: {
    changename() {
      if (this.dialogtype === 'add') {
        return '添加设备'
      } else if (this.dialogtype === 'edit') {
        return '修改设备'
      } else if (this.dialogtype === 'check') {
        return '查看设备'
      }
    }
  },
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
      // 搜索列表
      searchForm: { 
        tenantId: '', 
        tenantName:'',
        city:''
      },
      // 搜索列表校验
      searchFormRules: {tenantId: [{ required: true, message: '请输入租户编号', trigger: 'blur' },],},
      // 设备列表
      facilities: [],
      // 新增设备列表
      addFacilityForm: {
        id: '',
        tenantId: '',
        tenantName: '',
        city: '',
        linkMan: '',
        phone: '',
        email: '',
        remark: ''
      },
      // 新增设备列表校验规则
      addFacilityFormRules: {
        tenantId: [{ required: true, message: '请输入租户编号', trigger: 'blur' },],
        id: [{ required: true, message: '请输入id', trigger: 'blur' },],
        tenantName: [{ required: true, message: '请输入租户名称', trigger: 'blur' },],
        city: [{ required: true, message: '请输入所属城市', trigger: 'blur' },],
        linkMan: [{ required: true, message: '请输入联系人员', trigger: 'blur' },],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkMobile, trigger: "blur" },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: "blur" },
        ],
        remark: [{ required: true, message: '请输入备注信息', trigger: 'blur' },],
      },
      // 分页参数
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      // 对话框是否出现
      addFacilityVisible: false,
      // 对话框类型
      dialogtype: '',
      // 按钮遮罩层
      submitLoad: false,
      // 表单遮罩层
      listLoad: false,
    }
  },
  created() {
    this.getList();
  },
  methods: {
    ...mapActions('tenant', ['searchData', 'getData', 'deleteData', 'addData', 'editData']),
    // 获取列表
    async getList() {
      this.listLoad = true
      const res = await this.getData(this.queryInfo);
      if (res.code == 200) {
        this.facilities = res.rows
        this.queryInfo.pageNum = res.pageNum
        this.queryInfo.pageSize = res.pageSize
        this.queryInfo.total = res.total
        this.listLoad = false
      }
    },
    //监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pageNum = newPage; //重新指定当前页
      this.getList();
    },
    // 搜索
    search() {
      this.$refs.searchForm.validate(async (valid) => {
        if (valid) {
          const res = await this.searchData(this.searchForm.id);
          if (res.code == 200) {
            this.$message.success("搜索成功");
            this.facilities = []
            const obj = { "cspTenant": res.data }
            this.facilities.push(obj)
            console.log(this.facilities)
          }
        } else { this.handleCurrentChange(1); }
      })
    },
    // 重置搜索表单
    resetsearchForm() {
      this.resetForm("searchForm");
      console.log('重置')
    },
    // 打开新增对话框
    addFacility() {
      this.dialogtype = 'add';
      this.addFacilityVisible = true;
    },
    // 打开修改对话框
    editFacility(el) {
      this.dialogtype = 'edit';
      this.addFacilityForm = el;
      this.addFacilityVisible = true;
    },
    // 打开查看对话框
    checkFacility(el) {
      this.dialogtype = 'check';
      this.addFacilityForm = el;
      this.addFacilityVisible = true;
    },
    // 关闭对话框
    dialogClosed() {
      this.addFacilityVisible = false;
      this.$refs.addFacilityFormRef.resetFields();
    },
    // 点击对话框确定按钮
    clickFacility() {
      if (this.dialogtype === 'check') {
        this.addFacilityVisible = false;
      } else if (this.dialogtype === 'add') {
        this.$refs.addFacilityFormRef.validate(async (valid) => {
          if (valid) {
            const res = await this.addData(this.addFacilityForm);
            this.submitLoad = true;
            if (res.code == 200) {
              this.$message.success("添加成功");
              this.submitLoad = false;
              this.addFacilityVisible = false,
                this.handleCurrentChange(1);
            }
          }
        })
      } else if (this.dialogtype === 'edit') {
        this.$refs.addFacilityFormRef.validate(async (valid) => {
          if (valid) {
            const res = await this.editData(this.addFacilityForm);
            this.submitLoad = true;
            if (res.code == 200) {
              this.$message.success("修改成功");
              this.submitLoad = false;
              this.addFacilityVisible = false,
                this.handleCurrentChange(1);
            }
          }
        })
      }
    },
    // 删除
    deleteFacility(e) {
      console.log(e)
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await this.deleteData(e);
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.handleCurrentChange(1);
        }
      }, () => { this.$message({ type: "info", message: "已取消删除" }); })
    },
  },
}
</script>

<style scoped>
.facility-list-box {
  margin: 20px;
}
</style>