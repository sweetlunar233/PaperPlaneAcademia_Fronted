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
        
        <!-- 头像选择 -->
        <el-form-item label="头像">
          <el-button @click="showAvatarDialog = true" type="primary">选择头像</el-button>
          <span v-if="registerForm.avatar" style="margin-left: 5px;">已选择头像</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitRegisterForm('registerForm')">注册</el-button>
          <el-button type="text" @click="$router.push('/login')">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 头像选择弹窗 -->
    <el-dialog
      title="选择头像"
      v-model="showAvatarDialog"
      width="60%"
      @close="resetSelectedAvatar"
    >
      <div class="avatar-carousel">
        <div class="avatar-wrapper">
          <img
            v-for="(avatar, index) in availableAvatars"
            :key="index"
            :src="avatar"
            alt="头像选项"
            class="avatar-option"
            :class="{ selected: selectedAvatar === index }"
            @click="selectAvatar(index)"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="showAvatarDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAvatar">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Register } from "@/api/user";
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
        avatar: "", // 添加 avatar 字段
      },
      showAvatarDialog: false, // 控制弹窗显示
      selectedAvatar: "", // 选中的头像
      availableAvatars: [ // 可供选择的头像
      "https://img.zcool.cn/community/016a2e5f110b9fa801215aa097202c.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp",
        "https://img.zcool.cn/community/01a6095f110b9fa8012066219b67d4.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp",
        "https://img.zcool.cn/community/01972c5f110b9fa801206621eba569.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp",
        "https://img.zcool.cn/community/0143395f110b9fa801215aa060a140.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp",
        "https://img.zcool.cn/community/014f685f110b9fa801215aa096689e.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp",
        "https://img.zcool.cn/community/015ac85f110b9fa801206621387957.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp",
      ],
      rules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        confirmPassword: [
          { required: true, message: "请确认您的密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value !== this.registerForm.password) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入您的邮箱", trigger: "blur" },
          { type: "email", message: "非法的邮箱地址", trigger: "blur" },
        ],
        organization: [{ required: true, message: "请输入您的机构或组织", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 选择头像
    selectAvatar(avatar) {
      this.selectedAvatar = avatar;
    },
    // 确认头像
    confirmAvatar() {
      this.registerForm.avatar = this.selectedAvatar; // 把选中的头像保存到 registerForm
      this.showAvatarDialog = false;
    },
    // 重置头像
    resetSelectedAvatar() {
      this.selectedAvatar = "";
    },

    submitRegisterForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            var promise = Register(this.registerForm.username, this.registerForm.password, this.registerForm.email, this.registerForm.organization, this.registerForm.avatar);
            promise.then((result) => {
              if (result && result.status === "success") {
                ElMessage({
                  message: "注册成功！将为您跳转到登录界面",
                  type: 'success',
                });
                this.$router.push("/login");
              } else {
                ElMessage({
                  message: result.message,
                  type: 'error',
                });
              }
            });
          } catch (error) {
            console.error("注册失败:", error);
            ElMessage({
              message: "注册失败，请检查网络连接或稍后重试。",
              type: 'error',
            });
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
  height: 100vh; /* 设置为视口高度 */
  background: url("../../assets/images/bg3.png") no-repeat center center; /* 背景图片 */
  background-size: cover; /* 背景图自适应容器 */
  background-attachment: fixed; /* 保持背景固定 */
  overflow: hidden; /* 防止出现滚动条 */
}

.register-card {
  width: 500px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
  border-radius: 8px; /* 圆角 */
}

.avatar-wrapper {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.avatar-option {
  width: 60px;
  height: 60px;
  margin: 10px;
  cursor: pointer;
  border: 3px solid transparent;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.avatar-option:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.avatar-option.selected {
  border-color: #3697ff; /* 蓝色边框颜色 */
}



</style>

