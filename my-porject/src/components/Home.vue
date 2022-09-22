<template>
  <el-container class="main">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="sidebar-logo-container">
        <img src="../assets/ManageSystem_logo.png" height="30px" class="sidebar-logo"
             :class="{ 'collapse':  isCollapse}" />
        <h1 class="sidebar-title">某后台管理系统</h1>
      </div>
      <!-- 侧边栏列表 :default-active="activePath"-->
      <el-menu class="el-menu-vertical-demo" :default-active="this.$router.path" background-color="#304156"
               text-color="#fff" active-text-color="#409BFF" style="width:200px" :unique-opened="true"
               :collapse="isCollapse" :collapse-transition="false" :router="true">
        <!-- 一级列表 -->
        <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
          <template slot="title">
            <i :class="iconsObj[item.id]"></i>
            <span>{{item.authName}}</span>
          </template>
          <!-- 二级列表 -->
          <el-menu-item-group :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
            <el-menu-item :index="'/'+subItem.path" @click="saveNavState('/'+subItem.path)">{{subItem.authName}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 除侧边栏以外的右侧区域 -->
    <el-container>
      <!-- 头部栏 -->
      <el-header>
        <!-- 侧边栏回收按钮 -->
        <el-button :class="{ 'el-icon-s-unfold' : isCollapse,'el-icon-s-fold' : !isCollapse,}"
                   style="font-size: 20px;color:black" type="text" @click="toggleCollapse()">
        </el-button>
        头部栏
        <div>
          <el-button style="margin-right:10px" @click="ADD">+</el-button>
          <el-button style="margin-right:10px" @click="addwait">异步加</el-button>
          {{count}}
          <el-button @click="subtractwait">异步减</el-button>
          <el-button @click="SUBTRACT">-</el-button>
        </div>
        <el-button type="danger" @click="logout" size="small" style="margin: 10px 0">退出</el-button>
      </el-header>
      <!-- 各个界面不一样的数据区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getmenu } from '../api/index.js';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        '125': 'el-icon-user-solid',//用户管理
        '103': 'el-icon-s-check',//权限管理
        '101': 'el-icon-s-goods',//商品管理
        '102': 'el-icon-s-order',//订单管理
        '145': 'el-icon-s-data',//数据管理
      },
      isCollapse: false,
      activePath: '', //右侧边栏被高亮激活的路径
    };
  },
  computed: {
    // count(){
    //   return this.$store.state.count;
    // }
    ...mapState('count', ['count']),
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  mounted() {
    // this.getMenuList();
  },
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    // 获取右侧栏列表
    async getMenuList() {
      const res = await getmenu();
      if (res) {
        this.menuList = res.data;
      }
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 获得点击页面的path值
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
    },

    // add() {
    //   this.$store.commit('count/ADD');
    // },
    // addwait() {
    //   this.$store.dispatch('addwait', 1);
    // },
    // subtract() {
    //   this.$store.commit('SUBTRACT');
    // },
    // subtractwait() {
    //   this.$store.dispatch('subtractwait')
    // }
    // ...mapMutations({add:'ADD',subtract:'SUBTRACT'}),
    ...mapMutations('count', ['ADD', 'SUBTRACT']),
    ...mapActions('count', ['addwait', 'subtractwait']),
  },
};
</script>

<style>
.el-header {
  display: flex;
  background-color: #fff;
  color: #333;
  line-height: 60px;
  justify-content: space-between;
  align-items: center;
}

.el-aside {
  background-color: #304156;
  color: #333;
  text-align: center;
  line-height: 200px;
  /* overflow:visible; */
}

.el-aside .el-menu {
  border-right: none;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}
.main {
  height: 100vh;
}
.sidebar-logo-container {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #304156;
  text-align: center;
  overflow: hidden;
}
.sidebar-logo {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  margin-right: 12px;
}
.sidebar-title {
  display: inline-block;
  margin: 0;
  color: #fff;
  font-weight: 600;
  line-height: 50px;
  font-size: 14px;
}
.el-submenu__title {
  display: flex;
  align-items: center;
}
.collapse {
  padding-left: 15px;
}
</style>