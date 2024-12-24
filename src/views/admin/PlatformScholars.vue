<template>
  <div>
    <h2>入驻学者</h2>
    <!-- 显示平台共有多少名学者入驻 -->
    <p>当前共有 {{ totalScholars }} 位学者入驻平台</p>

    <!-- 学者列表 -->
    <el-table
      :data="pagedScholars"
      style="width: 100%"
      stripe
      v-if="scholars.length > 0"
    >
      <el-table-column label="用户名" prop="username" width="250" />
      <el-table-column label="邮箱" prop="email" width="500" />
      <el-table-column label="所在机构" prop="organization" width="200" />
      <el-table-column label="入驻时间" prop="joinedAt" width="200" />
      <el-table-column label="发表文献数量" prop="publications" width="180" />
    </el-table>

    <!-- 没有学者时显示信息 -->
    <p v-else>目前没有学者入驻。</p>

    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="totalScholars"
      @current-change="handlePageChange"
      style="margin-top: 20px"
    />
  </div>
</template>

<script>
import { fatchScholars_api } from "@/api/user.js";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      scholars: [], // 学者列表
      totalScholars: 0, // 入驻学者总数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示条数
      router:useRouter(),
    };
  },
  computed: {
    // 计算分页后的学者列表
    pagedScholars() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.scholars.slice(start, end);
    },
  },
  methods: {
    // 获取平台入驻学者数据
    fetchScholars() {
      var promise = fatchScholars_api(); // 获取所有学者数据
      promise
        .then((response) => {
          console.log(response)
          if(response.status === "success"){
            this.scholars = response.data.scholars; // 更新学者数据
            this.totalScholars = response.data.total; // 更新学者总数
          }
          else{
            ElMessage({
              message: '获取信息失败，请稍后重试！',
              type: 'error',
              plain: true,
            });
          }
        })
    },

    // 处理页码改变时重新加载数据
    handlePageChange(page) {
      this.currentPage = page; // 更新当前页
    },
  },
  created() {
    this.fetchScholars(); // 页面加载时自动请求数据
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
  }
};
</script>

<style scoped>
/* 设置表格和分页的样式 */
.el-table {
  margin-bottom: 20px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
