<template>
  <!-- 登录页面 用户名：admin 密码：123456 -->
  <div class="login-background" @keyup.enter="handleLogin">
    <!-- 登录背景 -->
    <el-form class="login-box" ref="loginform" :model="loginform" :rules="loginformrules">
      <h3 class="title">某后台管理系统</h3>
      <el-form-item prop="username">
        <el-input placeholder="账号" v-model="loginform.username" type="text" clearable prefix-icon="el-icon-user-solid">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input placeholder="密码" v-model="loginform.password" type="password" show-password
                  prefix-icon="el-icon-lock">
        </el-input>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" @click="handleLogin" style="width:100%">登录</el-button> -->
        <el-button type="primary" @click="anotherLogin" style="width:100%">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
 
<script>
import { login } from '../api/index.js';
export default {
  data() {
    return {
      loginform: {
        username: "",
        password: "",
      },
      loginformrules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入登密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // handleLogin() {
    //   this.$refs.loginform.validate(async (valid) => {
    //     console.log(valid);
    //     if (!valid) {
    //       return;
    //     } else {
    //       const { data: res } = await this.$http.post("login", this.loginform);
    //       console.log(res);
    //       if (res.meta.status !== 200) {
    //         this.$message.error("登录失败！" + res.meta.msg); // 页面弹出失败提示框
    //         return;
    //       } else {
    //         this.$message.success("登录成功！");
    //         window.sessionStorage.setItem("token", res.data.token);
    //         this.$router.push("/home");//登录跳转
    //       }
    //     }
    //   });
    // },
    anotherLogin() {
      this.$refs.loginform.validate((valid) =>{
        if(valid){
          login(this.loginform).then((res)=>{
            if(res){
              this.$message.success(res.meta.msg);
              window.sessionStorage.setItem("token", res.data.token);
              this.$router.push("/home");
            }
          })
        }else return;
      });
    }
  },
};
</script>
<style>
.login-background {
  /* 使盒子内开启flex布局 */
  display: flex;
  /* 盒子内部元素纵向排列(主轴为纵向) */
  flex-direction: column;
  /* 主轴上居中对齐 */
  justify-content: center;
  /* 交叉轴上居中对齐 */
  align-items: center;
  height: 100%;
  background-image: url("../assets/login-background.jpg");
  background-size: cover;
}
.login-box {
  /* 使盒子内开启flex布局 */
  display: flex;
  /* 盒子内部元素纵向排列(主轴为纵向) */
  flex-direction: column;
  /* 主轴上居中对齐 */
  justify-content: center;
  /* 交叉轴上居中对齐 */
  align-items: center;
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}
.el-form-item {
  width: 100%;
}
</style>
