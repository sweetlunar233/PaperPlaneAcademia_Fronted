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
import { platformOverview } from "@/api/user";
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
    var promise = platformOverview();
    promise.then((result)=>{
      if (result.status === 200 && result.data) {
        this.statistics[0].value = result.data.totalUsers || 0;
        this.statistics[1].value = result.data.totalPapers || 0;
        this.statistics[2].value = result.data.totalAuthors || 0;
        this.statistics[3].value = result.data.totalScholars || 0;
      }
    });
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
