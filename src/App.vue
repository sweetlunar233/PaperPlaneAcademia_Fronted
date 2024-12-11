<template>
  <div id="app">
    <!-- 导航栏 -->
    <el-container class="navbar">
      <el-header>
        <!-- 左侧 Logo -->
        <el-button type="text" @click="goToHome">
          <strong>Academia</strong>
        </el-button>

        <!-- 高级搜索按钮 -->
        <div class="advanced-search">
          <el-button type="text" @click="goToAdvSearch">高级搜索</el-button>
        </div>

        <!-- 中间搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="请输入搜索内容"
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
            <span @click="goToMyGateway">欢迎, {{ username }}</span>
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
export default {
  data() {
    return {
      searchQuery: "", // 搜索框内容
      loggedIn: true, // 登录状态
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
    goToMyGateway() {
      this.$router.push("/MyGateway"); // 跳转到注册页面
    },
    async logout() {
      this.loggedIn = false;
          this.username = "";
          alert("已注销！");
          this.$router.push("/home");
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
    goToAdvSearch() {
      this.$router.push("/advsearch"); // 跳转到高级搜索页面
    },
  },
  mounted() {
    this.checkLoginStatus(); // 组件加载时检查登录状态
  },
};
</script>

<style scoped>
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
}

.el-button:hover {
  background-color: #555; /* hover 时背景更亮 */
  border-color: #666; /* hover 时边框更亮 */
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
</style>


