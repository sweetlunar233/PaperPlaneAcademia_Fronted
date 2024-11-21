<template>
  <div>
  <h1 style="color:var(--text-color);font-size:24px;padding-left:20vh">学者身份认证</h1>
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
                    <el-icon v-if="index < steps.length - 1" style="margin-left: 15vh;color:var(--gray-color) !important">
                        <ArrowRightBold />
                      </el-icon>
                  </div>
                </div>
              
        </el-row>
        <div style="position: absolute; width: 120vh; margin-right:20px; padding-top:6%">
            <el-divider style="padding: 10px;"/>
        </div>
  
        <el-form :model="formData" ref="form" label-width="100px" v-if="step === 1" style="position: absolute; width: 100%; margin: 15% 15% 100px 10%;">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="formData.gender" placeholder="选择性别">
              <el-option label="男" value="male"></el-option>
              <el-option label="女" value="female"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入电子邮箱"></el-input>
          </el-form-item>
          <el-form-item label="工作单位" prop="workPlace">
            <el-input v-model="formData.workPlace" placeholder="请输入工作单位"></el-input>
          </el-form-item>
          <el-form-item label="研究领域" prop="field">
            <el-input v-model="formData.field" placeholder="多个领域名称用“;”隔开"></el-input>
          </el-form-item>
        </el-form>
  
        <el-form :model="formData" ref="form" v-if="step === 2" style="position: absolute; width: 100%; margin: 100px 15% 100px 10%;">
            <div class="label">成果认领</div>
            <div class="dsc">
                已根据您的姓名搜索到了系统中如下
                <span class="paper-count"><i>{{ papersList.length }}</i></span>
                篇可认领论文
            </div>
            <el-form-item class="claimed-papers-container">
                <div 
                    v-for="(paper, index) in papersList" 
                    :key="index" 
                    class="paper-item" 
                    :class="{ selected: selectedPapers.includes(index) }"
                    @click="toggleSelection(index)"
                >
                    <div class="paper-checkbox">
                        <el-icon v-if="selectedPapers.includes(index)" class="selected-icon" size="20"><Select /></el-icon>
                    </div>
                    <div class="paper-info">
                        <div class="paper-title">{{ paper.title }}</div>
                        <div class="paper-other-info">
                          <span class="paper-date"><i>{{ paper.date }}</i></span>
                          <span >·</span>
                          <span class="paper-journal"><i>{{ paper.journal }}</i></span>
                          <span >·</span>
                          <span class="paper-authors" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"><i>{{ paper.authors }}</i></span>
                        </div>
                        
                    </div>
                </div>
            </el-form-item>

            <div  class="manual-upload-link">
                系统中没有录入我的作品？<span @click="dialogFormVisible = true" class="manual-upload">手动上传</span>
            </div>
            <div class="papers" v-if="formData.newPapers.length > 0">
                <p style="margin-bottom:-5px; padding-left:20px; color:var(--text-color);">已手动上传的作品：</p>
                <ul>
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
                            >
                                <Close />
                            </el-icon>
                                <div  class="paper-title">{{ paper.title }}</div>
                            
                        </div>
                    </div>
                </ul>
            </div>
        </el-form>

        <el-dialog v-model="dialogFormVisible" title="添加论文" class="manual-upload-popup" >
            <el-form :model="newPaperFormData" key="newPaperForm" l>
                <div class="popup-content">
                  <el-form-item label="论文标题" :label-width="100" >
                    <el-input v-model="newPaperFormData.paperTitle" placeholder="请输入论文标题" style="max-width: 80%;"></el-input>
                  </el-form-item>
                  <el-form-item label="发表日期" :label-width="100">
                    <el-date-picker v-model="newPaperFormData.publishDate" type="date" placeholder="选择日期" />
                  </el-form-item>
                  <el-form-item label="上传文件" :label-width="100">
                    <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :file-list="newPaperFormData.fileList"
                      :on-remove="handleRemove"
                      :before-upload="beforeUpload"
                      :limit="3"
                      :on-exceed="handleExceed"
                      :on-change="handleChange"
                    >
                      <el-button type="primary"><el-icon class="el-icon--right"><Upload /></el-icon>上传文件</el-button>
                    </el-upload>
                  </el-form-item>
                  <div class="popup-buttons">
                    <el-button @click="submitManualUpload" type="primary">提交</el-button>
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                  </div>
                </div>
              
            </el-form>
        </el-dialog>
        <!-- <el-form :model="formData" ref="form" label-width="100px" v-if="step === 2" style="position: absolute; width: 100%; margin: 15% 15% 100px 10%;">
          <el-form-item label="论文标题" prop="paperTitle">
            <el-input v-model="formData.paperTitle" placeholder="请输入论文标题"></el-input>
          </el-form-item>
          <el-form-item label="发表日期" prop="publishDate">
            <el-date-picker v-model="formData.publishDate" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="期刊名称" prop="journalName">
            <el-input v-model="formData.journalName" placeholder="请输入期刊名称"></el-input>
          </el-form-item>
          <el-form-item label="证明材料" prop="proof">
            <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :file-list="fileList"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                :limit="5"
                :on-exceed="handleExceed"
                :on-change="handleChange"
                >
                <el-button type="primary">上传文件<el-icon class="el-icon--right"><Upload /></el-icon></el-button>
                </el-upload>
          </el-form-item>
        </el-form> -->
  
        <!-- <el-row v-if="step === 3" justify="center" class="message">
            <el-col :span="12" class="centered-text">
              <p style="color: #333;">申请已提交，请等待审核!</p>
              <el-button @click="goHome" size="large">返回主页</el-button>
            </el-col>
        </el-row> -->

        <el-row v-if="step === 3" justify="center" style="position: absolute; padding-top:20%">
            <el-col :span="16" class="centered-text">
              <el-result
                icon="success"
                title="申请已提交!"
                sub-title="认证审核将在1-3个工作日内完成，并将结果发送至您的邮箱"
              >
                <template #extra>
                    <el-button @click="goHome">返回主页</el-button>
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
  export default {
    data() {
      return {
        step: 1,
        steps: ["个人信息", "学术成果", "等待审核"],
        formData: {
            name: '',
            gender: '',
            email: '',
            workPlace: '',
            field: '',
            claimedPapers: [],
            newPapers: [
                { title: '手动上传示例', publishDate: '', file: null },
            ]
        },
        papersList: [
            { title: "论文1标题", date: "2023-08-1",journal: "期刊名",authors: "张三, 李四" },
            { title: "论文2标题",date: "2023-08-1",journal: "期刊名", authors: "王五, 赵六" },
            { title: "长长长长长长长长长长长长长长长长超长长长长长长长长长长长长长长长长长长超长长长长长长长长长长长长长长长长长长超长长标题",date: "2023-08-1",journal: "期刊名", authors: "李七, 周八，长长长长长长长长长长长长长长长长超长长长长长长长长长长长长长长长长长长超长长长长长长长长长长长长长长长长长长超长长长长长长长长长长长长长长长长长长超长长作者" },
            { title: "论文2标题",date: "2023-08-1",journal: "期刊名",authors: "王五, 赵六" },
            { title: "论文2标题",date: "2023-08-1",journal: "期刊名", authors: "王五, 赵六" },
            { title: "论文2标题",date: "2023-08-1",journal: "期刊名", authors: "王五, 赵六" },
            { title: "论文2标题",date: "2023-08-1",journal: "期刊名", authors: "王五, 赵六" },
            { title: "论文2标题",date: "2023-08-1",journal: "期刊名", authors: "王五, 赵六" },
            { title: "论文2标题",date: "2023-08-1",journal: "期刊名", authors: "王五, 赵六" },
        ],
        selectedPapers: [],
        manualUploadedPapers: [],
        dialogFormVisible: false,
        hoverIconIndex: null,
        newPaperFormData: {
            paperTitle: '',
            publishDate: null,
            fileList: []
        }
      };
    },
    methods: {
            goToStep(index) {
            this.step = index;
        },
        nextStep() {
            if (this.step < 3) {
            this.step++;
            }
        },
        prevStep() {
            if (this.step > 1) {
            this.step--;
            }
        },
        submitForm() {
            this.step++;
            console.log(this.formData);
        },

        fetchPapersByAuthor() {
            const name = this.formData.name;
            console.log("搜索论文")
            // this.$axios.get(`/api/papers?author=${name}`).then(response => {
            //     this.papersList = response.data;
            // }).catch(error => {
            //     console.error("获取论文数据失败", error);
            // });
        },

        handleRemove(file, fileList) {
            console.log('remove', file, fileList);
        },
        
        handleChange(file, fileList) {
            console.log('file changed', file, fileList);
        },

        handleExceed(file, fileList) {
            this.$message.warning('上传文件超过限制');
        },
        
        toggleSelection(index) {
            if (this.selectedPapers.includes(index)) {
                this.selectedPapers = this.selectedPapers.filter(i => i !== index);
            } else {
                this.selectedPapers.push(index);
            }
        },

        submitManualUpload() {
            // 提交手动上传的论文
            const { paperTitle, publishDate, fileList } = this.newPaperFormData;
            if (paperTitle && publishDate) {
                // 提交手动上传的论文
                this.formData.newPapers.push({
                    title: paperTitle,
                    publishDate: publishDate,
                    fileList: fileList,
                });
                this.dialogFormVisible = false; // 关闭弹窗
                this.newPaperFormData = { paperTitle: '', publishDate: null, fileList: [] }; // 重置表单
            } else {
                this.$message.error('请填写完整的论文信息');
            }
        },
        removePaper(index) {
            this.formData.newPapers.splice(index, 1);
        }, 
    },
    goHome() {
        this.$router.push("/home");
    },

  created() {
    this.fetchPapersByAuthor();
  }

  };
  </script>
  
  <style>

  :root {
    --theme-color: #3f389d;
    --mid-color:#665fc7;
    --light-color: #e9e5fe;
    --button-color:#bfb5f0;
    --back-color: #fefaff;
    --shadow-color:rgba(121, 68, 183, 0.185);
    --deep-shadow:rgba(108, 65, 156, 0.311);
    --gray-color:#cbc7db;
    --dark-color: #8d86a8;
    --secondary-color: #1c81e0;
    --text-color: #251c57;
    --light-text-color: #4f4454;
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
    color: var(--dark-color);
  }
  
  .step-item.active {
    color: var(--theme-color);
    font-weight: bold;
  }
  
  .step-item.completed {
    color: var(--mid-color);
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
    box-shadow: 0 4px 20px var(--shadow-color);
    border: 1px solid var(--gray-color);
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

  .papers-list {
    display: flex;
    flex-wrap: wrap;
  }

  .label {
    display: flex;
    font-size: 18px;
    font-weight: bold ;
    color: var(--text-color);
    margin-left: 10px;
  }

  .claimed-papers-container {
    display: flex;
    border: 1px solid var(--gray-color);
    width: 95%;
    max-height: 27vh;
    overflow-y: auto;
  }
  
  .paper-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 0;
    border-bottom: 1px solid var(--gray-color);
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .paper-item:hover {
    background-color: var(--light-color);
  }
  
  .selected {
    background-color: var(--light-color);
  }
  
  .paper-checkbox {
    margin-right: 10px;
    margin-left:20px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .selected-icon {
    color: var(--theme-color);
  }
  
  .paper-info {
    position: flex;
    min-width: 0;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
  }
  
  .paper-title {
    font-size: 16px !important;
    font-weight: bold;
    color: var(--text-color);
    white-space: normal !important;
    word-break: break-all;
    word-wrap: break-word;
    line-height:1.25;
  }

  .paper-other-info{
    font-size: 14px;
    color: var(--light-text-color);
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    gap: 10px;
  }
  
  .paper-item:hover .paper-title {
    color: var(--theme-color);
  }

  .dsc {
    font-size: 14px;
    color: var(--light-text-color);
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-top: 10px;
  }
  
  .paper-count {
    font-size: 20px;
    font-weight: bold;
    color: var(--secondary-color);
    margin: 0 10px;
  }

  .manual-upload-link {
    font-size: 16px;
    color: var(--text-color);
    cursor: pointer;
    margin-top: 10px;
    margin-left: 20px;
  }
  
  .manual-upload {
    color: var(--secondary-color);
  }
  
  .popup-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .paper-title-container {
    display: flex;
    align-items: center;
    border: 1px solid var(--gray-color) ;
    border-radius: 8px;
    margin-bottom: 10px;
    transition: background-color 0.3s ease;
  }
  
  .close-icon {
    margin-right: 10px;
    cursor: pointer;
    transition: color 0.3s ease;
  }
  
  .paper-title-container {
    display: flex;
    align-items: center;
    width: 40%;
    max-width: 40%;
    padding: 5px 10px;
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
  }
  
  .paper-title {
    font-size: 14px;
    color: var(--text-color);
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
    background-color: var(--button-color);
    border-color: var(--gray-color);
    color: var(--text-color);
  }
  
  .el-button--primary:hover {
    background-color: var(--dark-color);
    border-color: var(--gray-color);
    color: var(--text-color);
  }
  
  .el-button--primary:focus,
  .el-button--primary:active {
    background-color: var(--button-color);
    border-color: var(--gray-color);
    color: var(--text-color);
  }
  </style>
  