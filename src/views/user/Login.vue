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
import axios from "axios";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "Username is required", trigger: "blur" }],
        password: [{ required: true, message: "Password is required", trigger: "blur" }],
      },
    };
  },
  methods: {
    async submitLoginForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const userCredentials = { ...this.loginForm };
          try {
            const response = await axios.post("/api/user/login", userCredentials);
            if (response.data.status === "success") {
              alert("登录成功！");
              this.$root.loggedIn = true; // 修改根组件的登录状态
              this.$router.push("/dashboard"); // 登录成功跳转到主页面
            } else {
              alert(response.data.message);
            }
          } catch (error) {
            console.error("登录失败:", error);
            alert("登录失败，请检查网络连接或稍后重试。");
          }
        } else {
          console.log("error submit!!");
        }
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background: #f5f5f5;
}
.login-card {
  width: 450px;
  padding: 20px;
}
</style>
