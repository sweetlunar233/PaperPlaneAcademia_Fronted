<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2>注册</h2>
      <el-form
        :model="registerForm"
        :rules="rules"
        ref="registerForm"
        label-width="150px"
        class="register-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="输入您的用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            placeholder="输入您的密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            placeholder="确认您的密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="输入您的邮箱"></el-input>
        </el-form-item>
        <el-form-item label="机构或组织" prop="organization">
          <el-input v-model="registerForm.organization" placeholder="输入您的机构或组织"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-select v-model="registerForm.userType" placeholder="选择您的用户类型">
            <el-option label="科研人员" value="researcher"></el-option>
            <el-option label="审核人员" value="reviewer"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRegisterForm('registerForm')">注册</el-button>
          <el-button type="text" @click="$router.push('/login')">登录</el-button>
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
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        organization: "",
        userType: "",
      },
      rules: {
        username: [{ required: true, message: "Username is required", trigger: "blur" }],
        password: [{ required: true, message: "Password is required", trigger: "blur" }],
        confirmPassword: [
          { required: true, message: "Please confirm your password", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value !== this.registerForm.password) {
                callback(new Error("Passwords do not match"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "Email is required", trigger: "blur" },
          { type: "email", message: "Invalid email format", trigger: "blur" },
        ],
        organization: [{ required: true, message: "Organization is required", trigger: "blur" }],
        userType: [{ required: true, message: "User type is required", trigger: "blur" }],
      },
    };
  },
  methods: {
    async submitRegisterForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const newUser = { ...this.registerForm };
          delete newUser.confirmPassword; // 确认密码不需要发送到后端
          try {
            const response = await axios.post("/user/register/", newUser);
            if (response.data.status === "success") {
              alert("注册成功！将为您跳转到登录界面");
              this.$router.push("/login");
            } else {
              alert(response.data.message);
            }
          } catch (error) {
            console.error("注册失败:", error);
            alert("注册失败，请检查网络连接或稍后重试。");
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background: #f5f5f5;
}
.register-card {
  width: 500px;
  padding: 20px;
}
</style>
