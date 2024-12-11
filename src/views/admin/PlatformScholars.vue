<template>
  <div>
    <h2>入驻学者</h2>
    <!-- 显示平台共有多少名学者入驻 -->
    <p>当前共有 {{ totalScholars }} 位学者入驻平台</p>

    <!-- 学者列表 -->
    <el-table
      :data="scholars"
      style="width: 100%"
      stripe
      v-if="scholars.length > 0" 
    >
      <el-table-column label="用户名" prop="username" width="150" />
      <el-table-column label="邮箱" prop="email" width="200" />
      <el-table-column label="所在机构" prop="institution" width="200" />
      <el-table-column label="入驻时间" prop="joinDate" width="200" />
      <el-table-column label="发表文献数量" prop="papersCount" width="180" />
    </el-table>

    <!-- 没有学者时显示信息 -->
    <p v-else>目前没有学者入驻。</p>

    <!-- 分页器 -->
    <el-pagination
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next"
      v-if="pagination.total > 0" 
    />
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      scholars: [], // 学者列表
      totalScholars: 0, // 入驻学者总数
      pagination: {
        currentPage: 1, // 当前页
        pageSize: 10, // 每页显示条数
        total: 0, // 数据总数
      },
    };
  },
  methods: {
    // 获取平台入驻学者总数和分页数据
    async fetchScholars(page = 1) {
      try {
        const response = await axios.get("/user/scholars/", {
          params: {
            page: page, // 当前页
            size: this.pagination.pageSize, // 每页显示条数
          },
        });
        if (response.status === 200) {
          this.scholars = response.data.data; // 更新学者数据
          this.totalScholars = response.data.totalCount; // 更新总学者数
          this.pagination.total = response.data.totalCount; // 更新数据总数
          this.pagination.currentPage = page; // 更新当前页
        }
      } catch (error) {
        console.error("获取入驻学者数据失败:", error);
        this.scholars = []; // 出现错误时确保学者列表为空
        this.totalScholars = 0; // 错误时总学者数为0
        this.pagination.total = 0; // 错误时总数据为0
      }
    },
    // 处理页码改变时重新加载数据
    handleCurrentChange(page) {
      this.fetchScholars(page); // 重新加载数据
    },
  },
  // 页面加载时自动请求第一页学者数据
  created() {
    this.fetchScholars(this.pagination.currentPage);
  },
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
