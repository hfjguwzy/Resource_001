<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rolesList" stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdtop bdbottom']" v-for="item1 in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i><!-- 箭头小图标 -->
              </el-col>
              <!-- 渲染二级、三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环，嵌套渲染二级权限 -->
                <el-row :class="['bdbottom']" v-for="item2 in item1.children" :key="item2.id">
                  <!-- 渲染二级权限 -->
                  <el-col :span="5">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i><!-- 箭头小图标 -->
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="19">
                    <el-tag :class="['bdbottom']" type="warning" v-for="item3 in item2.children" :key="item3.id"
                            closable @close="removeRightById(scope.row, item3.id)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
      <!-- 树形组件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox default-expand-all node-key="id"
               :default-checked-keys="defkeys" ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getroleslist, removerightbyid } from '../../api/index';
export default {
  data() {
    return {
      rolesList: [],
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //所有权限的数据
      rightsList: [],
      //树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //默认选中的权限ID数组对象
      defkeys: [],
      //当前即将分配权限的角色ID
      roleId: ''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const res = await getroleslist();
      if (res) {
        this.rolesList = res.data;
      }
    },
    //根据ID删除对应的权限
    removeRightById(role, rightId) {
      //弹框提示用户是否需要删除
      this.$confirm("是否删除该权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await removerightbyid(role.id, rightId);
          if (res) {
            // 获取服务器返回的当前角色的最新权限数据，然后赋值给原来的角色对象
            role.children = res.data;
          }
        }, () => { this.$message({ type: "info", message: "已取消删除" }); })
    },
    //展示权限分配的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      //获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree');
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！');
      }
      //把获取到的权限数据保存到data中
      this.rightsList = res.data;
      //递归获取三级节点的ID
      this.defkeys = [];//清空数组
      this.getLeafKeys(role, this.defkeys);
      //显示对话框
      this.setRightDialogVisible = true;
    },
    //获取角色下的三级权限ID(通过递归)，保存到defkeys数组
    getLeafKeys(node, arr) {
      //如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => this.getLeafKeys(item, arr));
    },
    //点击为角色分配权限
    async allotRights() {
      //"..."为“展开运算符”，将一个数组转为用逗号分隔的参数序列
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post('roles/' + this.roleId + '/rights', { rids: idStr });
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！');
      }
      this.$message.success('分配权限成功！');
      //重新刷新角色列表
      this.getRolesList();
      //关闭对话框
      this.setRightDialogVisible = false;
    }
  },
};
</script>

<style>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
</style>