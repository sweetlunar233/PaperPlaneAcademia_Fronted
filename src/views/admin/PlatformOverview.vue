<template>
  <div>
    <h2>平台概况</h2>
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in statistics" :key="index">
        <el-card class="stat-card">
          <div class="stat-card-content">
            <h3>{{ item.label }}</h3>
            <p>{{ item.value }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      statistics: [
        { label: "注册用户数", value: 0 },
        { label: "文献数量", value: 0 },
        { label: "作者数量", value: 0 },
        { label: "入驻学者数量", value: 0 },
      ],
    };
  },
  async created() {
    try {
      const response = await axios.get("/user/platform-overview/");
      if (response.status === 200 && response.data) {
        this.statistics[0].value = response.data.totalUsers || 0;
        this.statistics[1].value = response.data.totalPapers || 0;
        this.statistics[2].value = response.data.totalAuthors || 0;
        this.statistics[3].value = response.data.totalScholars || 0;
      }
    } catch (error) {
      console.error("获取平台概况数据失败:", error);
    }
  },
};
</script>

<style scoped>
.el-card {
  height: 120px; /* 设置卡片固定高度 */
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.stat-card-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 内容垂直居中 */
  align-items: center; /* 内容水平居中 */
  height: 100%; /* 占满整个卡片高度 */
}

.stat-card-content h3 {
  margin: 0;
  font-size: 16px;
  font-weight: normal;
  padding-bottom: 10px; /* 让文字和数字之间有间距 */
}

.stat-card-content p {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}
</style>
