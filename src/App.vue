<template>
  <div id="app">
    <!-- 导航栏 -->
    <el-container class="navbar">
      <el-header>
        <el-row gutter="0" type="flex" align="middle">
          <!-- 左侧 Logo -->
          <el-col :span="6">
            <el-button type="text" @click="goToHome" class="">
              Academia
            </el-button>
          </el-col>

          <!-- 中间搜索框 -->
          <el-col :span="15">
            <el-input 
              v-model="searchQuery"
              placeholder="搜索内容"
              class=""
              clearable
            >
              <template #append>
                <el-button type="primary" :icon="Search" @click="onSearch">Search</el-button>
              </template>
            </el-input>
          </el-col>

          <!-- 右侧按钮：动态显示 -->
          <el-col :span="3">
            <!-- 未登录状态 -->
            <template v-if="!loggedIn">
              <el-button type="primary" @click="goToLogin">登录</el-button>
              <el-button type="success" @click="goToRegister">注册</el-button>
            </template>

            <!-- 已登录状态 -->
            <template v-else>
              <span>欢迎, {{ username }}</span>
              <el-button type="danger" @click="logout">注销</el-button>
            </template>
          </el-col>
        </el-row>
      </el-header>
    </el-container>

    <!-- 页面内容 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "", // 搜索框内容
      loggedIn: false, // 登录状态
      username: "", // 用户名
    };
  },
  methods: {
    async checkLoginStatus() {
      try {
        const response = await axios.get("/api/auth/status"); // 假设后端提供登录状态接口
        if (response.data.success) {
          this.loggedIn = true;
          this.username = response.data.username; // 获取用户名
        } else {
          this.loggedIn = false;
        }
      } catch (error) {
        console.error("获取登录状态失败：", error);
      }
    },
    goToHome() {
      this.$router.push("/home"); // 跳转到主页
    },
    goToLogin() {
      this.$router.push("/login"); // 跳转到登录页面
    },
    goToRegister() {
      this.$router.push("/register"); // 跳转到注册页面
    },
    async logout() {
      try {
        const response = await axios.post("/api/auth/logout"); // 假设后端提供注销接口
        if (response.data.success) {
          this.loggedIn = false;
          this.username = "";
          alert("已注销！");
          this.$router.push("/home");
        }
      } catch (error) {
        console.error("注销失败：", error);
        alert("注销失败，请稍后再试！");
      }
    },
    async onSearch() {
      if (this.searchQuery.trim() !== "") {
        try {
          const response = await axios.post("/api/search", {
            query: this.searchQuery, // 发送的搜索内容
          });
          if (response.data.success) {
            alert(`搜索结果：${response.data.results}`);
            this.$router.push({ path: "/search", query: { q: this.searchQuery } });
          } else {
            alert("未找到相关内容");
          }
        } catch (error) {
          console.error("搜索请求失败：", error);
          alert("搜索失败，请稍后再试！");
        }
      } else {
        alert("请输入搜索内容！");
      }
    },
  },
  mounted() {
    this.checkLoginStatus(); // 组件加载时检查登录状态
  },
};
</script>

<style scoped>
/* 样式与之前一致 */
</style>
