<template>
  <div class="admin-container">
    <el-container>
      <!-- 左侧导航 -->
      <el-aside width="200px" class="menu">
        <el-menu
          :default-active="activeMenu"
          @select="handleMenuSelect"
          router
          class="el-menu-vertical-demo"
        >
          <el-menu-item index="overview">平台概况</el-menu-item>
          <!-- <el-menu-item index="review">审核认领</el-menu-item> -->
          <el-menu-item index="scholars">平台学者</el-menu-item>
          <el-menu-item index="reviewResearcher">审核认领门户申请</el-menu-item> 
        </el-menu>
      </el-aside>
      <!-- 右侧内容展示 -->
      <el-main class="content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      activeMenu: "overview", // 默认激活的平台概况页面
      router:useRouter(),
    };
  },
  methods: {
    handleMenuSelect(index) {
      this.activeMenu = index;
      this.$router.push({ name: index }); // 根据选项切换路由
    },
  },

  mounted(){
    var isAdmin = this.$cookies.get("username") === 'admin';
    if(!isAdmin){
      this.router.push({path:'/login'});
      ElMessage({
        message: '请登陆管理员账号！',
        type: 'error',
        plain: true,
      });
    }
    else{
      this.activeMenu = this.$route.name;
    }
  },
};
</script>

<style scoped>
.admin-container {
  height: 100vh;
}
.content {
  padding: 20px;
}
</style>
