<template>
  <div>
    <h2>审核认领门户申请</h2>
    <el-table :data="pagedClaims" border style="width: 100%">
      <el-table-column prop="name" label="姓名" min-width="120"></el-table-column>
      <el-table-column prop="otherName" label="其他名字" min-width="120"></el-table-column>
      <el-table-column prop="gender" label="性别" min-width="80"></el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="200"></el-table-column>
      <el-table-column prop="field" label="学科领域" min-width="150"></el-table-column>
      <el-table-column prop="selectedScholarId" label="选择的学者ID" min-width="180"></el-table-column>
      <el-table-column prop="userId" label="用户ID" min-width="100"></el-table-column>
      <el-table-column label="操作" align="center" min-width="150">
        <template #default="{ row }">
          <el-button type="success" @click="approveClaim(row.id)">通过</el-button>
          <el-button type="danger" @click="rejectClaim(row)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="totalClaims"
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
import { getClaims, approveClaims, rejectClaims } from "@/api/claim"; // 根据你的接口调整

export default {
  data() {
    return {
      claims: [], // 存储所有认领申请
      currentPage: 1,
      pageSize: 10,
      totalClaims: 0,
      rejectDialogVisible: false,
      rejectReason: "",
      selectedClaimId: null, // 当前选择的认领申请ID
    };
  },
  computed: {
    pagedClaims() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.claims.slice(start, end);
    },
  },
  methods: {
    // 获取认领申请列表
    fetchClaims() {
      var promise = getClaims();
      promise
        .then((response) => {
          if (response.status === "success") {
            this.claims = response.data.claims;
            this.totalClaims = response.data.total;
          } else {
            console.error("获取认领申请失败:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("获取认领申请失败:", error);
        });
    },

    // 页码变化时触发
    handlePageChange(page) {
      this.currentPage = page;
    },

    // 通过申请
    approveClaim(claimId) {
      var promise = approveClaims(claimId); // 调用后端接口
      promise
        .then((response) => {
          if (response.data.status === "success") {
            alert("认领申请已通过");
            this.fetchClaims();
          } else {
            alert("审批失败：" + response.data.message);
          }
        })
        .catch((error) => {
          console.error("审批失败:", error);
        });
    },

    // 驳回申请
    rejectClaim(row) {
      this.selectedClaimId = row.id; // 存储当前选中认领申请的ID
      this.rejectDialogVisible = true;
    },

    // 提交驳回理由
    submitRejection() {
      const reason = this.rejectReason;
      var promise = rejectClaims(this.selectedClaimId, reason); // 提交驳回理由
      promise
        .then((response) => {
          if (response.data.status === "success") {
            alert("认领申请已驳回");
            this.rejectDialogVisible = false;
            this.fetchClaims();
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
    this.fetchClaims();
  },
};
</script>

<style scoped>
/* 表格内容居中 */
.el-table .el-table__cell {
  text-align: center;
}
</style>
