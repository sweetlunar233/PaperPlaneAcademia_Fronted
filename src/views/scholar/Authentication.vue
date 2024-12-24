<template>
  <div>
  <h1 style="color:#251c57;font-size:24px;padding-left:12vw;padding-top:2vh">学者身份认证</h1>
    <div class="authentication">
      <el-row class="info-div" style="padding: 30px 0px 30px 0px;">

        <el-row justify="center" style="width: 100vh; height: 60px; margin-right:10px; padding-top:20px">
          <div class="steps-header">
            <div 
              v-for="(stepTitle, index) in steps" 
              :key="index"
              :class="['step-item', { active: index === step - 1, completed: index < step - 1 }]"
              @click="goToStep(index + 1)"
            >
              <el-icon class="icon" v-if="index===0" :size="index === step - 1 ? 30 : 25"><Edit /></el-icon>
              <el-icon class="icon" v-if="index===1" :size="index === step - 1 ? 30 : 25"><Document /></el-icon>
              <el-icon class="icon" v-if="index===2" :size="index === step - 1 ? 30 : 25"><CircleCheck /></el-icon>
              <span class="step-title" :style="{ fontSize: index === step - 1 ? '20px' : '16px' }">{{ stepTitle }}</span>
              <el-icon v-if="index < steps.length - 1" style="margin-left: 15vh;color:#c7cfdb !important">
                  <ArrowRightBold />
                </el-icon>
            </div>
          </div>
        </el-row>

        <div style="position: absolute; width: 70vw; margin-right:20px; padding-top:6%">
            <el-divider style="padding: 10px;"/>
        </div>
  
        <el-form :rules="rules" :model="formData" ref="form" label-width="100px" v-if="step === 1" style="position: absolute; width: 100%; margin: 15% 15% 100px 10%;">
          <el-form-item label="姓名" prop="name" required>
            <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="曾用作者名" prop="otherName">
            <el-input v-model="formData.otherName" placeholder="请输入您曾在论文中署过的别名（若有），例如英文名，多个名字用;隔开"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender" required>
            <el-select v-model="formData.gender" placeholder="请选择性别">
              <el-option label="男" value="male"></el-option>
              <el-option label="女" value="female"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入电子邮箱"></el-input>
          </el-form-item>
          <el-form-item label="工作单位" prop="organization" required>
            <el-input v-model="formData.organization" placeholder="请输入工作单位全称"></el-input>
          </el-form-item>
          <!-- <el-form-item label="研究领域" prop="field">
            <el-input v-model="formData.field" placeholder="多个领域名称用“;”隔开"></el-input>
          </el-form-item> -->
        </el-form>
  
        <el-form :model="formData" ref="form" v-if="step === 2" style="position: absolute; width: 100%; margin: 100px 15% 100px 10%;" v-loading="isLoading">
          <div class="label">门户认领</div>
          <div class="dsc" v-if="scholarsList.length>0">
              已根据您的姓名搜索到了系统中如下
              <span class="scholar-count"><i>{{ scholarsList.length }}</i></span>
              个匹配的门户信息, 点击选择
          </div>
          <div v-if="scholarsList.length==0&&isLoading==false" style="width: 100%;margin-top:50px">
            <el-result
              icon="error"
              title="没有查找到与您的信息匹配的认证门户!"
              sub-title="您可以点击右下角按钮返回上一步，修改您的信息"
            ></el-result>
          </div>
          <el-form-item class="claimed-scholars-container" v-if="scholarsList.length>0">
            <div 
              v-for="(scholar, Id) in scholarsList" 
              :class="{ selected: formData.selectedScholarId == scholar.Id }"
              :key="Id" 
              class="scholar-item"
              @click="selectScholar(scholar)"
              
            >
              <div class="scholar-checkbox" >
                <el-icon v-if="formData.selectedScholarId == scholar.Id" class="selected-icon" size="20"><Select /></el-icon>
              </div>
              <div class="scholar-info">
                  <div class="scholar-name">{{ scholar.name }}</div>
                  <div class="scholar-other-info">
                    <span class="scholar-authorOrganization"><i>{{ scholar.authorOrganization }}</i></span>
                  </div>
                  <div class="scholar-other-info"><span>收录有 </span><span v-for="(paper,index) in scholar.papers" :key="index">{{paper}} </span><span> 等{{scholar.papers.length}}篇论文</span></div>
              </div>
            </div>
          </el-form-item>

          <!-- <div  class="manual-upload-link">
            系统中没有录入我的作品？<span @click="edit(null)" class="manual-upload">手动上传</span>
          </div>
          <div class="papers" v-if="formData.newPapers.length > 0" >
            <p style="margin-bottom:-5px; padding-left:20px; color:#251c57;">已手动上传的作品：</p>
            <ul style="max-height: 14vh; overflow-y: auto; width:25vw">
              <div class="paper" v-for="(paper, index) in formData.newPapers" :key="index">
                <div class="paper-title-container" >
                  <el-icon 
                    class="close-icon" 
                    size="18" 
                    @click="removePaper(index)" 
                    style="cursor: pointer;"
                    :style="{ color: hoverIconIndex === index ? 'red' : 'black' }"
                    @mouseover="hoverIconIndex = index"
                    @mouseleave="hoverIconIndex = null"
                  ><Close /></el-icon>
                  <div class="paper-title" @click="edit(paper)">{{ paper.title }}</div>
                </div>
              </div>
            </ul>
          </div> -->
        </el-form>

        <!-- <el-dialog 
          v-model="dialogFormVisible" 
          :title="editIdx == -1 ? '添加论文' : '编辑论文'" 
          class="manual-upload-popup"
          @close="handleClose"
        >
          <el-form :rules="paperRules" :model="newPaperFormData" ref="newPaperForm" >
            <div class="popup-content">
              <el-form-item label="论文标题" prop="title" :label-width="100" required>
                <el-input v-model="newPaperFormData.title" placeholder="请输入论文标题" style="max-width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="发表日期" prop="date" :label-width="100" required>
                <el-date-picker v-model="newPaperFormData.date" type="date" placeholder="选择日期" />
              </el-form-item>
              <el-form-item label="期刊名称" prop="journal" :label-width="100">
                <el-input v-model="newPaperFormData.journal" placeholder="请输入期刊名称" style="max-width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="合著作者" prop="coauthor" :label-width="100">
                <el-input v-model="newPaperFormData.coauthor" placeholder="除您以外的其他作者，多个作者名请用;隔开" style="max-width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="关键词" prop="key" :label-width="100" required>
                <el-input v-model="newPaperFormData.key" placeholder="多个关键词请用;隔开" style="max-width: 80%;"></el-input>
              </el-form-item>
              <el-form-item label="上传文件" :label-width="100" required>
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  ref="upload"
                  :file-list="newPaperFormData.fileList"
                  :on-remove="handleRemove"
                  :before-upload="beforeUpload"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :auto-upload="false"
                  :on-change="handleChange"
                >
                  <el-button type="primary"><el-icon class="el-icon--right"><Upload /></el-icon>上传文件</el-button>
                </el-upload>
              </el-form-item>
              <div class="popup-buttons">
                <el-button @click="submitManualUpload()" type="primary">提交</el-button>
                <el-button @click="handleClose">取消</el-button>
              </div>
            </div>
          </el-form>
        </el-dialog> -->

        <el-row v-if="step === 3" justify="center" style="position: absolute; padding-top:20%">
          <el-col :span="16" class="centered-text">
            <el-result
              icon="success"
              title="申请已提交!"
              sub-title="认证审核将在1-3个工作日内完成，并将结果发送至您的邮箱"
            >
              <template #extra>
                <el-button @click="goHome()">返回主页</el-button>
              </template>
              </el-result>
          </el-col>
        </el-row>
        

        <div class="button-container">
          <el-button v-if="step === 2" @click="prevStep" size="large">上一步</el-button>
          <el-button v-if="step < 2" type="primary" @click="nextStep" size="large">下一步</el-button>
          <el-button v-if="step === 2" type="primary" @click="submitForm" size="large">提交</el-button>
        </div>
      </el-row>
    </div>
  </div>
</template>
  
<script>
import { Authenticate,fetchScholars } from '@/api/claim';

export default {
  data() {
    return {
      step: 1,
      steps: ["个人信息", "门户认领", "等待审核"],
      formData: {
          name: '',
          otherName:'',
          gender: '',
          email: '',
          organization: '',
          //field: '',
          selectedScholarId: '-1',
          //newPapers: [],
          isLoading:true,
          userId: this.$cookies.get('userId')
      },
      
      scholarsList: [
        //{ Id:"42873", name: "作者1", authorOrganization: "buaa", papers: ["作者1的第一篇论文", "作者1的第二篇论文"] },
        //{ Id:"002", name: "作者2", authorOrganization: "北京航空航天大学", papers: ["作者1的第一篇论文", "作者1的第二篇论文"] },
      ],
      
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        organization: [{ required: true, message: '请输入工作单位', trigger: 'blur' }]
      },
      // paperRules: {
      //   title: [{ required: true, message: '请输入论文标题', trigger: 'blur' }],
      //   date: [{ required: true, message: '请选择发表日期', trigger: 'change' }],
      //   key: [{ required: true, message: '请输入关键词', trigger: 'blur' }],
      //   fileList: [
      //     { validator: (rule, value, callback) => {
      //     if (this.newPaperFormData.fileList.length === 0) {
      //       callback(new Error('请上传文件'));
      //     } else {
      //       callback();
      //     }
      //   }, trigger: 'change' }
      // ]},

      // selectedScholars: '',
      // manualUploadedPapers: [],
      // dialogFormVisible: false,
      // hoverIconIndex: null,
      // newPaperFormData: {
      //   idx:'',
      //   title: '',
      //   date: null,
      //   journal:'',
      //   coauthor:'',
      //   key:'',
      //   fileList: null,
      // },
      // editIdx: -1,
      isLoading:true,
    };
  },
  methods: {
    nextStep() {
      if(this.step==1){
        this.$refs.form.validate((valid) => {
        
        if (valid) {
          this.fetchScholarsByName();
          this.step++;
        } else {
          ElMessage({
            message: '请填写所有必填字段',
            type: 'warning',
          });
          return false;
        }
      });
      }
      if (this.step == 2) {
        this.step++;
      }
    },
    prevStep() {
      if (this.step > 1) {
        this.step--;
      }
    },
    submitForm() {
      console.log(this.formData)
      var response = Authenticate(this.formData);
      
      response
      .then(data => {
        console.log("Authenticate", data);
        if(data.status == "error"){
          console.error('Authenticate submit error');
        }else{
          console.log('Success:', data);
          this.step++;
        }
      })
    },

    fetchScholarsByName() {
      this.isLoading=true;
      const { name, otherName } = this.formData;
      let authorNames = [];
      if (name && name.trim()) {
        authorNames.push(name.trim());
      }
      if (otherName && otherName.trim()) {
        const namesArray = otherName.split(/[\u3002\uff1b\uff0c,;]/).map(n => n.trim()).filter(Boolean);
        authorNames = authorNames.concat(namesArray);
      }
      console.log("搜索认证门户", {
        organization:this.formData.organization,
        authorNames:authorNames
      });
      var response = fetchScholars({
        organization:this.formData.organization,
        authorNames:authorNames
      });

      response
      .then((data) => {
        console.log("fetchScholars res", data);
        if(data.status == "error"){
          console.error("Error fetchScholars");
        }else{
          this.scholarsList = data.matched_scholars;
          console.log(this.scholarsList)
        }
        this.isLoading=false;
      });
    },

    // handleRemove(file, fileList) {
    //   console.log('remove', file, fileList);
    //   this.newPaperFormData.fileList = fileList;
    // },
    
    // handleChange(file, fileList) {
    //   console.log('file changed', file, fileList);
    //   this.newPaperFormData.fileList = fileList.slice(-1);
    // },

    // handleExceed(files, fileList) {
    //   this.$refs.upload.clearFiles();
    //   this.$refs.upload.handleStart(files[0]);
    // },

    // toggleSelection(index) {
    //   if (this.selectedPapers.includes(index)) {
    //     this.selectedPapers = this.selectedPapers.filter(i => i !== index);
    //   } else {
    //     this.selectedPapers.push(index);
    //   }
    // },

    // submitManualUpload() {
    //   this.$refs.newPaperForm.validate((valid) => {
    //     console.log(this.newPaperFormData)
    //     if (valid) {
    //       if (this.editIdx != -1) {
    //         console.log('changing:idx='+this.editIdx)
    //         const editedPaper = JSON.parse(JSON.stringify(this.newPaperFormData));
    //         this.formData.newPapers.splice(this.editIdx, 1, editedPaper);
    //         this.editIdx = -1;
    //       } else {
    //         this.formData.newPapers.push(JSON.parse(JSON.stringify(this.newPaperFormData)));
    //         this.formData.newPapers.at(-1).idx = this.formData.newPapers.length - 1 ;0
    //       }
    //       this.dialogFormVisible = false;
    //       this.resetNewPaperFormData();
    //     } else {
    //       ElMessage({
    //         message: '请填写所有必填字段',
    //         type: 'warning',
    //       });
    //       return false;
    //     }
    //   });
    // },

    // handleClose() {
    //   this.dialogFormVisible = false;
    //   this.editIdx = -1;
    //   this.resetNewPaperFormData();
    // },

    // resetNewPaperFormData() {
    //   this.newPaperFormData = {
    //     title: '',
    //     date: null,
    //     journal: '',
    //     coauthor: '',
    //     key: '',
    //     fileList: [] // 确保这是一个空数组
    //   };
    // },

    // removePaper(index) {
    //   this.formData.newPapers.splice(index, 1);
    // },
    selectScholar(scholar) {
      if(this.formData.selectedScholarId == scholar.Id){
        this.formData.selectedScholarId = '-1';
      }else{
        this.formData.selectedScholarId = scholar.Id;
      }
      console.log("choose "+this.formData.selectedScholarId);
    },

    goHome() {
      this.$router.push("/home");
    },

  //   edit(paper) {
  //     if (paper == null) {
  //       console.log('creating new paper');
  //       this.editIdx = -1;
  //       this.resetNewPaperFormData();
  //     } else {
  //       console.log('editing idx='+paper.idx);
  //       this.editIdx = paper.idx;
  //       Object.assign(this.newPaperFormData, JSON.parse(JSON.stringify(paper)));
  //     }
  //     this.dialogFormVisible = true;
  //   }

  },

  created() {
  },
};

</script>

<style scoped>

.app{
  background-color: #ffffffaa;
}
.steps-header {
  width: 90vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-item {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-item {
  color: #8694a8;
}

.step-item.active {
  color: #385b9d;
  font-weight: bold;
}

.step-item.completed {
  color: #5f96c7;
}

.icon {
  margin-right: 10px;
  transition: all 0.3s ease;
}

.step-title {
  font-size: 14px;
}

.divider {
  position: flex;
  height: 30px;
  width: 100%;
}

.authentication {
  display: flex;
  justify-content: center;
  margin: 20px 0 0 0;
  box-shadow: 0 4px 20px rgba(85, 68, 183, 0.185);
  border: 1px solid #c7cfdb;
  border-radius: 10px;
  width: 80%;
  min-height: 75vh;
  flex-grow: 1;
  margin-left: auto;
  margin-right: auto;
}

.info-div {
  max-width: 1200px;
  margin: 10px auto;
  justify-content: center;
}

.el-form-item {
  margin-bottom: 25px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.button-container {
  position: absolute;
  bottom: 40px;
  right: -150px;
}

.message {
  text-align: center;
  justify-content: center;
  height: 60px;
  width: 800px;
}

.centered-text {
  text-align: center;
}

.scholars-list {
  display: flex;
  flex-wrap: wrap;
}

.label {
  display: flex;
  font-size: 18px;
  font-weight: bold ;
  color: #251c57;
  margin-left: 10px;
}

.claimed-scholars-container {
  display: flex;
  border: 1px solid #c7cfdb;
  width: 95%;
  max-height: 27vh;
  overflow-y: auto;
}

.scholar-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid #c7cfdb;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.scholar-item:hover {
  background-color: #e5f1fe;
}

.selected {
  background-color: #e5f1fe;
}

.scholar-checkbox {
  margin-right: 10px;
  margin-left:20px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.selected-icon {
  color: #385b9d;
}

.scholar-info {
  position: flex;
  min-width: 0;
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
}

.scholar-title {
  font-size: 16px !important;
  font-weight: bold;
  color: #251c57;
  white-space: normal !important;
  word-break: break-all;
  word-wrap: break-word;
  line-height:1.25;
  width: 90%;
}

.scholar-other-info{
  font-size: 14px;
  color: #4f4454;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  gap: 10px;
}

.scholar-item:hover .scholar-name {
  color: #385b9d;
}

.dsc {
  font-size: 14px;
  color: #4f4454;
  display: flex;
  align-items: center;
  margin-left: 20px;
  margin-top: 10px;
}

.scholar-count {
  font-size: 20px;
  font-weight: bold;
  color: #6095df;
  margin: 0 10px;
}

.manual-upload-link {
  font-size: 16px;
  color: #251c57;
  cursor: pointer;
  margin-top: 10px;
  margin-left: 20px;
}

.manual-upload {
  color: #6095df;
}

.popup-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.scholar-name-container {
  display: flex;
  align-items: center;
  border: 1px solid #c7cfdb ;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
}

.close-icon {
  margin-right: 10px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.scholar-name-container {
  display: flex;
  align-items: center;
  width: 80%;
  padding: 5px 10px;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
}

.scholar-name {
  font-size: 14px;
  color: #251c57;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 90%;
}

.popup-content{
  margin-top: 30px;
  min-height: 30vh;
}

.el-button--primary {
  background-color: #a6c0ed;
  border-color: #c7cfdb;
  color: #251c57;
}

.el-button--primary:hover {
  background-color: #8694a8;
  border-color: #c7cfdb;
  color: #251c57;
}

.el-button--primary:focus,
.el-button--primary:active {
  background-color: #a6c0ed;
  border-color: #c7cfdb;
  color: #251c57;
}
</style>
