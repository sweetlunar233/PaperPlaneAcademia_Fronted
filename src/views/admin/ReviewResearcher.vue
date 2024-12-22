<template>
  <div>
    <h2>审核科研人员申请</h2>
    <el-table :data="pagedApplications" border style="width: 100%">
      <el-table-column prop="username" label="用户名" min-width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="200"></el-table-column>
      <el-table-column prop="organization" label="所在机构" min-width="200"></el-table-column>
      <el-table-column prop="reason" label="申请理由" min-width="300"></el-table-column>
      <el-table-column label="操作" align="center" min-width="150">
        <template #default="{ row }">
          <el-button type="success" @click="approveApplication(row.applicationId)">通过</el-button>
          <el-button type="danger" @click="rejectApplication(row)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="totalApplications"
      @current-change="handlePageChange"
      style="margin-top: 20px"
    ></el-pagination>

    <!-- 驳回理由对话框 -->
    <el-dialog title="驳回理由" :visible.sync="rejectDialogVisible" width="400px">
      <el-input v-model="rejectReason" type="textarea" placeholder="请输入驳回理由" rows="4"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRejection">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getApplications, approveApplication, rejectApplication } from "@/api/claim"; // 根据你的接口调整

export default {
  data() {
    return {
      applications: [], // 存储所有科研人员申请
      currentPage: 1,
      pageSize: 10,
      totalApplications: 0,
      rejectDialogVisible: false,
      rejectReason: "",
      selectedApplicationId: null, // 当前选择的申请ID
    };
  },
  computed: {
    pagedApplications() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.applications.slice(start, end);
    },
  },
  methods: {
    // 获取科研人员申请列表
    fetchApplications() {
      // 通过调用 API 获取数据
      var promise = getApplications();
      promise
        .then((response) => {
          if (response.status === "success") {
            this.applications = response.data.data;
            this.totalApplications = this.applications.length;
          } else {
            console.error("获取科研人员申请失败:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("获取科研人员申请失败:", error);
        });
    },

    // 页码变化时触发
    handlePageChange(page) {
      this.currentPage = page;
    },

    // 通过申请
    approveApplication(applicationId) {
      var promise = approveApplication(applicationId); // 调用后端接口
      promise
        .then((response) => {
          if (response.data.status === "success") {
            alert("科研人员申请已通过");
            this.fetchApplications();
          } else {
            alert("审批失败：" + response.data.message);
          }
        })
        .catch((error) => {
          console.error("审批失败:", error);
        });
    },

    // 驳回申请
    rejectApplication(row) {
      this.selectedApplicationId = row.applicationId; // 存储当前选中申请的applicationId
      this.rejectDialogVisible = true;
    },

    // 提交驳回理由
    submitRejection() {
      const reason = this.rejectReason;
      var promise = rejectApplication(this.selectedApplicationId, reason); // 提交驳回理由
      promise
        .then((response) => {
          if (response.data.status === "success") {
            alert("科研人员申请已驳回");
            this.rejectDialogVisible = false;
            this.fetchApplications();
          } else {
            alert("驳回失败：" + response.data.message);
          }
        })
        .catch((error) => {
          console.error("驳回失败:", error);
        });
    },
  },
  created() {
    this.fetchApplications();
  },
};
</script>

<style scoped>
/* 表格内容居中 */
.el-table .el-table__cell {
  text-align: center;
}
</style>
