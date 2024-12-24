<template>
  <div>
    <!-- 导航栏 -->
    <el-container class="navbar">
      <el-header>
        <!-- 左侧 Logo -->
        <div class="logo" @click="goToHome">
          PaperPlane
        </div>

        <!-- 高级搜索按钮和学者搜索按钮 -->
        <div class="advanced-search">
          <el-button class="TieZhu-button" style="color:rgb(216, 210, 210);" link @click="goToAdvSearch">高级搜索</el-button>
          <!-- 新增学者搜索按钮 -->
          <el-button class="TieZhu-button" style="color:rgb(216, 210, 210); padding-left: 20%;" link @click="goToSearchScholar">学者搜索</el-button>
        </div>

        <!-- 中间搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="请输入搜索内容"
            @keydown.enter="onSearch" 
            clearable
          >
            <template #append>
              <el-button type="primary" @click="onSearch">搜索</el-button>
            </template>
          </el-input>
        </div>

        <!-- 右侧按钮 -->
        <div class="auth-buttons">
          <template v-if="!loggedIn">
            <el-button @click="goToLogin">登录</el-button>
            <el-button @click="goToRegister">注册</el-button>
          </template>
          <template v-else>
            <span style="font-family: 'Microsoft YaHei', sans-serif;text-decoration: underline;margin-right: 10px;font-size: 18px;" @click="goToMyGateway">欢迎, {{ $cookies.get('username') }}</span>
            <el-button @click="logout">注销</el-button>
          </template>
        </div>
      </el-header>
    </el-container>

    <!-- 页面内容 -->
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios';
import {GetMyUserData} from "@/api/user.js";
export default {
  data() {
    return {
      searchQuery: "", // 搜索框内容
      loggedIn: false, // 登录状态
      username: "", // 用户名
      OnlineUser: 1, // 用户Id
    };
  },
  methods: {
    goToHome() {
      this.$router.push("/home"); // 跳转到主页
    },
    goToLogin() {
      this.$router.push("/login"); // 跳转到登录页面
    },
    goToRegister() {
      this.$router.push("/register"); // 跳转到注册页面
    },
    goToMyGateway() {
      if(this.username === 'admin'){
        this.$router.push("/admin");
      }
      else{
        this.$router.push("/myGateway"); // 跳转到个人主页
      }
    },
    async logout() {
      this.loggedIn = false;
      this.username = "";
      this.OnlineUser = 0;
      
      this.$cookies.remove('userId');
      this.$cookies.remove('username');
      ElMessage({
        message: "已注销！",
        type: 'success',
      });
      this.$router.push("/home");
    },
    async onSearch() {
      // 检查搜索文本是否已填写
      if (this.searchQuery.trim() === "") {
        this.$message.warning("请输入搜索内容");
        return;
      }

      try {
        // 跳转到 SearchRes.vue 页面并传递搜索文本
        this.$router.push({ 
          name: "searchRes", 
          query: {
            searchConditions: JSON.stringify([{
              "logic": null, 
              "value": this.searchQuery, 
              "scope": "title",
            }])
          }
        });


      } catch (error) {
        console.error("搜索请求失败：", error);
        ElMessage({
          message:"搜索失败，请稍后再试！",
          type: 'error',
        });
      }
    },


    goToAdvSearch() {
      this.$router.push("/advsearch"); // 跳转到高级搜索页面
    },
    // 新增跳转到学者搜索页面的方法
    goToSearchScholar() {
      this.$router.push("/searchScholar"); // 跳转到学者搜索页面
    },
    checkLoginStatus() {
      this.username = this.$cookies.get("username");
      this.OnlineUser = this.$cookies.get("userId");
      
      if (this.username && this.OnlineUser) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    }

  },
  created() {
    this.checkLoginStatus(); // 组件加载时检查登录状态
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap'); /* 引入 Montserrat 字体 */

.navbar {
  background-color: #333; /* 深灰色背景 */
  color: #fff; /* 白色字体 */
  padding: 10px 40px; /* 增加内边距 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 阴影效果 */
}

.navbar .el-header {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 左右均匀分布 */
}

.logo {
  color: white; /* 设置文字为白色 */
  font-size: 32px; /* 设置字体大小 */
  font-family: 'Montserrat', sans-serif; /* 使用 Montserrat 字体 */
  cursor: pointer; /* 鼠标悬停时显示为点击样式 */
  font-weight: bold; /* 设置为加粗 */
}

.el-button {
  color: #fff; /* 按钮文字为白色 */
  border: 1px solid #555; /* 灰色边框 */
  background-color: #444; /* 深灰色按钮背景 */
  line-height: normal; /* 取消默认的行高，避免文字偏移 */
  padding: 8px 16px;
  font-size: 14px;
  display: flex; /* 使按钮内容为弹性盒子 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  height: 36px; /* 固定按钮高度，确保居中 */
  font-family: 'Microsoft YaHei', sans-serif;
}

.search-box {
  flex: 1; /* 占据可用空间 */
  max-width: 500px; /* 限制最大宽度 */
  margin: 0 20px; /* 搜索框左右间距 */
}

.advanced-search,
.auth-buttons {
  flex-shrink: 0; /* 固定宽度，避免被压缩 */
}

.auth-buttons :hover{
  cursor: pointer;
}

.advanced-search {
  display: flex;
  gap: 20px; /* 增加按钮之间的间距 */
}

.auth-buttons {
  display: flex;
  gap: 15px; /* 按钮间距 */
}

.auth-buttons .el-button {
  margin: 0; /* 去掉多余间距 */
}

.auth-buttons .el-button:first-child {
  margin-right: 10px; /* 登录与注销按钮间距 */
}

.auth-buttons span {
  display: inline-block; 
  line-height: 1.8; /* 使文本与其他按钮保持一致的行高 */
  vertical-align: middle; /* 调整“欢迎，用户名”文本的垂直对齐 */
}

html {
  overflow-y: scroll; /* 防止滚动条跳动 */
}

.TieZhu-button{
  font-size: 18px;
  color: rgb(216, 210, 210);
  font-family: 'Microsoft YaHei', sans-serif;
}

.TieZhu-button :hover{
  color: white;
  cursor: pointer;
  transform: scale(1.015, 1.02);
}
</style>
