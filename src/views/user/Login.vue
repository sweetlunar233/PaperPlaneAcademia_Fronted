<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>登录</h2>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        label-width="120px"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitLoginForm('loginForm')">登录</el-button>
          <el-button type="text" @click="$router.push('/register')">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { Login } from "@/api/user";
import axios from "axios";
import { getCurrentInstance } from "vue";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitLoginForm() {
      var promise = Login(this.loginForm.username,this.loginForm.password);
        promise.then((result) => {
            if(result.status === "success"){
              ElMessage({
                message: '登录成功',
                type: 'success',
              });
              this.$cookies.set("userId", result.UserId);
              this.$cookies.set("username", result.username);
              this.$cookies.set("avatar",result.avatarId);
              // 更新 App.vue 状态
              this.$root.checkLoginStatus();  // 调用 checkLoginStatus 更新状态
              if(this.loginForm.username === "admin"){
                this.$router.push("/admin");// 管理员上号
              }else{
                this.$router.push("/home"); // 登录成功跳转到主页面
              }
            }
            else{
              ElMessage({
                message: result.message,
                type: 'error',
              });
            }
        })
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 设置为视口高度 */
  background: url("../../assets/images/bg3.png") no-repeat center center; /* 背景图片 */
  background-size: cover; /* 使背景图自适应容器 */
  background-attachment: fixed; /* 保持背景固定 */
  overflow: hidden; /* 防止出现滚动条 */
}

.login-card {
  width: 450px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
  border-radius: 8px; /* 圆角 */
}

</style>
