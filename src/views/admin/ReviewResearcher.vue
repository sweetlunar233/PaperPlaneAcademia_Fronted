<template>
  <div>
    <h2>审核认领门户申请</h2>
    <el-table :data="pagedClaims" stripe  style="width: 100%">
      <el-table-column prop="name" label="姓名" min-width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="200"></el-table-column>
      <el-table-column prop="institution" label="机构" min-width="150"></el-table-column>
      <el-table-column prop="selecterScholarId" label="选择的学者ID" min-width="180"></el-table-column>
      <el-table-column prop="userId" label="用户ID" min-width="100"></el-table-column>
      <el-table-column label="操作" :align="center" min-width="150">
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
    <!-- <el-dialog title="驳回理由" width="400px">
      <el-input v-model="rejectReason" type="textarea" placeholder="请输入驳回理由" rows="4"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRejection">提交</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { getApplications, approveApplication, rejectApplication } from "@/api/claim"; // 根据你的接口调整
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      claims: [
        {
          id:55,
          name:"TieZhu",
          email:"dcx1378832571@163.com",
          institution:"北航",
          selecterScholarId:255,
          userId:13,
        },
      ], // 存储所有认领申请
      currentPage: 1,
      pageSize: 10,
      totalClaims: 0,
      // rejectDialogVisible: false,
      // rejectReason: "",
      selectedClaimId: null, // 当前选择的认领申请ID
      router:useRouter(),
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
      var promise = getApplications();
      promise
        .then((result) => {
          if (result.status === "success") {
            this.claims = result.claims;
            this.totalClaims = result.total;
          } else {
            ElMessage({
              message: "获取认领申请失败",
              type: 'error',
              plain: true,
            });
          }
        })
    },

    // 页码变化时触发
    handlePageChange(page) {
      this.currentPage = page;
    },

    // 通过申请
    approveClaim(claimId) {
      var promise = approveApplication(claimId); // 调用后端接口
      promise
        .then((result) => {
          if (result.data.status === "success") {
            ElMessage({
              message: "认领申请已通过",
              type: 'success',
              plain: true,
            });
            this.fetchClaims();
          } else {
            ElMessage({
              message: "审批失败,请重新操作！",
              type: 'error',
              plain: true,
            });
          }
        })
    },

    // 驳回申请
    rejectClaim(row) {
      this.selectedClaimId = row.id; // 存储当前选中认领申请的ID
      // this.rejectDialogVisible = true;
      this.submitRejection();
    },

    // 提交驳回理由
    submitRejection() {
      // const reason = this.rejectReason;
      console.log(this.selectedClaimId)
      var promise = rejectApplication(this.selectedClaimId); // 提交驳回理由
      promise
        .then((result) => {
          if (result.status === "success") {
            ElMessage({
              message: "认领申请已驳回",
              type: 'success',
              plain: true,
            });
            // this.rejectDialogVisible = false;
            this.fetchClaims();
          } else {
            ElMessage({
              message: "驳回失败,请重新操作！",
              type: 'error',
              plain: true,
            });
          }
        })
    },
  },
  created() {
    // this.fetchClaims();
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
  },
};
</script>

<style scoped>
/* 表格内容居中 */
.el-table .el-table__cell {
  text-align: center;
}
</style>
