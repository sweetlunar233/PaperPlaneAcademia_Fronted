<template>
  <div>
    <h2>审核认领</h2>
    <el-table :data="pagedClaims" stripe style="width: 100%">
      <el-table-column prop="name" label="用户名" min-width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="200"></el-table-column>
      <el-table-column prop="insititution" label="所在机构" min-width="200"></el-table-column>
      <el-table-column prop="content" label="认领内容" min-width="300"></el-table-column>
      <el-table-column label="操作" align="center" min-width="150">
        <template #default="{ row }">
          <el-button type="success" @click="approveClaim(row.claimId)">通过</el-button>
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
import { getClaims } from "@/api/claim";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      claims: [], // 存储所有认领申请
      currentPage: 1,
      pageSize: 10,
      totalClaims: 0,
      rejectDialogVisible: false,
      rejectReason: "",
      selectedClaimId: null, // 当前选择的申请ID
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
    async fetchClaims() {
      var promise = getClaims();
        // 调用后端接口
        promise.then(response => {
          if (response.status === 'success') {
            this.claims = response.data.claims;
          } else {
            console.error("获取认领申请失败");
         }
        })
        .catch(error => {
          console.error("获取认领申请失败"); 
        });
    },
    
    // 页码变化时触发
    handlePageChange(page) {
      this.currentPage = page;
    },
    // 通过申请
    async approveClaim(claimId) {
      var promise = approveClaims(claimId);
        // 调用后端接口
        promise.then(response => {
          alert("认领申请已通过");
        this.fetchClaims();
        })
        .catch(error => {
          console.error("审批失败");
        });
    },
    // 驳回申请
    rejectClaim(row) {
      this.selectedClaimId = row.claimId;  // 存储当前选中申请的claimId
      this.rejectDialogVisible = true;
    },
    // 提交驳回理由
    async submitRejection() {
      reason = this.rejectReason;
      var promise = submitRejections(this.selectedClaimId, reason);
        // 调用后端接口
        promise.then(response => {
          alert("认领申请已驳回");
          this.fetchClaims();
        })
        .catch(error => {
          console.error("驳回失败");
        });
    },
  },
  created() {
    this.fetchClaims();
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
/* 表格内容铺满 */
.el-table .el-table__cell {
  text-align: center;
}
</style>
