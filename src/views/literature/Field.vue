<template >
    <div style="background-color:#EBEEF5" v-loading="isLoading" element-loading-background="rgb(244, 246, 247)" element-loading-text="正在为您全力加载中...">
    <div class="article">
        <el-row class="title-block">
            <el-col :span="12">
                <div class="title">
                    {{ field.name }}
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="16">
                <div class="articleDetail">
                    <span v-if="field.description">
                        <div class="abstract-title">描述</div>
                        <span v-if="field.description.length > 780">
                            <span v-if="isFold">
                                <span class="abstract-text">{{ field.description.substring(0,780) }}... </span>
                                <span class="hyperlink" @click="changeFoldState">展开</span>
                            </span>
                            <span v-else>
                                <span class="abstract-text">{{ field.description }}</span>
                                <span class="hyperlink" @click="changeFoldState"> 折叠</span>
                            </span>
                        </span>
                        <span v-else class="abstract-text">
                            <span v-if="field.description === 'null'">该领域暂无描述信息.</span>
                            <span v-else>{{ field.description }}</span>
                        </span>
                    </span>
                    <span v-else>
                        该领域暂无描述信息.
                    </span>
                </div>
                <div class="articleDetail">
                    <el-tabs v-model="activeTab">
                        <el-tab-pane label="关键字" name="first">
                            <div class="tab-tip">
                                共 {{ field.keywords.length }} 条
                            </div>
                            <div class="tab-tip" v-if="field.keywords.length==0">
                                暂无关键字.
                            </div>
                            <el-scrollbar height="350px">
                                <el-row v-for="(ref,index) in field.keywords" class="keyword-block">
                                    <el-col :span="22">
                                        {{ ref }}
                                        <el-button class="copy" link @click="copy(ref)">复制</el-button>
                                    </el-col>
                                </el-row>
                            </el-scrollbar>
                        </el-tab-pane>
                        <el-tab-pane label="同级领域" name="second">
                            <div class="tab-tip">
                                共 {{ field.siblings.length }} 条
                            </div>
                            <div class="tab-tip" v-if="field.siblings.length==0">
                                暂无同级领域.
                            </div>
                            <el-scrollbar height="350px">
                                <el-row v-for="(ref,index) in field.siblings" class="reference-block" @click="toField(ref.id)">
                                    <el-col :span="22">
                                        - <span class="hyperlink">{{ ref.display_name }}</span>
                                    </el-col>
                                </el-row>
                            </el-scrollbar>
                        </el-tab-pane>
                        <el-tab-pane label="相关文章" name="third">
                            <div v-if="field.article">
                                <div class="tab-tip">
                                共 {{ field.article.length }} 条
                                </div>
                                <div class="tab-tip" v-if="field.article.length==0">
                                    暂无相关文章.
                                </div>
                            </div>
                            <div class="tab-tip" v-else>
                                暂无相关文章.
                            </div>
                            <el-scrollbar height="350px">
                                <el-row v-if="field.article" v-for="(ref,index) in field.article" class="reference-block" @click="toField(ref.id)">
                                    <el-col :span="22">
                                        - <span class="hyperlink">{{ ref.title }}</span>
                                    </el-col>
                                </el-row>
                            </el-scrollbar>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
            
            <el-col :span="6" class="otherInfo">
                <el-row style="text-align: center;">
                    <el-col :span="11">
                        <el-statistic title="论文量" :value="field.worksCount" value-style="color:#67C23A"/>
                    </el-col>
                    <el-divider direction="vertical" style="height: 60px;"/>
                    <el-col :span="11">
                        <el-statistic title="被引量" :value="field.citedCount" value-style="color:#E6A23C;"/>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</div>

</template>

<script>
import { GetField } from '@/api/field';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';

export default{
    
    data(){
        return{
            id:"",
            field:{
                name:"机器学习",
                worksCount:230,
                citedCound:5001,
                description:"机器学习是一门多领域交叉学科，涉及概率论、统计学、逼近论、凸分析、算法复杂度理论等多门学科。专门研究计算机怎样模拟或实现人类的学习行为，以获取新的知识或技能，重新组织已有的知识结构使之不断改善自身的性能。",
                keywords: ["Terpenoid Biosynthesis", "Isoprenoid Pathway", "Metabolic Engineering", "Plant Volatiles", "Sesquiterpene Synthases", "Artemisinin Production", "Triterpene Biosynthesis", "MEP Pathway", "Cyclization Enzymes", "Phytoalexin Biosynthesis"],
                siblings:[
                    {
                        id:0,
                        display_name:"Advances in Metabolomics Research",
                    },
                    {
                        id:1,
                        display_name:"Analysis of Gene Interaction Networks",
                    }
                ],
            
            },
            isLoading:false,
            isFold:false,
            activeTab:"first",
            router:useRouter(),
        }
    },
    methods: {

        toField(id){
            if(id != -1){
                // 获取目标 URL
                const targetUrl = this.router.resolve({ path: '/field', query: { id: id } }).href;
                // 使用 window.open 打开新窗口
                window.open(targetUrl, '_blank');
            }
            else{
                ElMessage({
                    message: '该领域在本网站无信息，已为您跳转到该领域的官方网站.',
                    type: 'error',
                    plain: true,
                });
                window.open(id, '_blank');
            }
        },

        changeFoldState(){
            this.isFold = !this.isFold
        },

        async copy(content){
            try {
                // await navigator.clipboard.writeText(content);
                // 创建一个临时的textarea元素，用于复制文本
                const textArea = document.createElement('textarea');
                textArea.value = content;  // 设置为你想要复制的内容
                document.body.appendChild(textArea);
                textArea.select();  // 选择文本
                document.execCommand('copy');  // 执行复制操作
                document.body.removeChild(textArea);  // 移除临时的textarea
                ElMessage({
                    message: '已复制到剪切板',
                    type: 'success',
                    plain: true,
                });
            } catch (err) {
                ElMessage({
                    message: '文本复制失败：'+err,
                    type: 'error',
                    plain: true,
                });
            }
        }
    },

    mounted(){
        this.id = this.$route.query.id;
        console.log(this.id)
        this.isLoading = true;

        var promise = GetField(this.id);
        promise.then((result) => {
            console.log(result)
            if(result.status === "error"){
                // ElMessage({
                //     message: '该领域在本网站无信息，已为您跳转到该领域的官方网站.',
                //     type: 'error',
                //     plain: true,
                // });
                // window.open(this.id, '_blank');
                ElMessageBox.confirm(
                    "该领域在本网站无信息，是否为您跳转到该领域的官方网站？",
                    "提示",
                    {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                    }
                )
                .then(() => {
                    // 点击确定，跳转到指定链接
                    window.history.back();
                    window.open(this.id, '_blank');
                })
                .catch(() => {
                    if (window.opener) {
                        window.close();  // 关闭当前标签页
                    } else {
                        // 如果有 window.opener，则说明是子页面，返回上一页
                        window.history.back();  // 返回上一页
                    }
                });
            }
            else{
                this.field = result.field;
                this.isLoading = false;
            }
        })
        .finally(() => {
        })
    },
}

</script>

<style scoped>

.article .title-block {
    width: 60%;
    padding-top: 9%;
    padding-left: 20px;
    margin-left: 12%;
    margin-right: 20%;
    padding-bottom: 2%;
}

.article .title {
    font-family: Tahoma,fantasy;
    text-align: left;
    font-weight: bold;
    font-size: 28px;
    line-height: 40px;
    color: #353535;
}

.article .hyperlink {
    color: #409EFF;
}

.article .hyperlink:hover {
    color: rgb(31, 124, 196);
    cursor: pointer;
}

.article .hyperlink-noCursor {
    color: #409EFF;
}

.article .hyperlink-noCursor:hover {
    color: rgb(31, 124, 196);
    cursor: default;
}

.article .subtitle {
    color: #909eb4;
    padding-top: 2%;
    font-size: 15px;
}

.article .button {
    text-align: left;
    padding-left: 1%;
    margin-top: 3%;
    margin-bottom: 2%;
}

.article .articleDetail {
    background-color: white;
    padding-top: 2%;
    padding-left: 2%;
    padding-right: 2%;
    padding-bottom: 2%;
    margin-left: 17%;
    margin-top: 3%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .08), 0 0 6px rgba(0, 0, 0, .04);
}

.article .abstract-title {
    text-align: left;
    font-weight: bold;
    margin-top: 5px;
    padding-bottom: 2%;
    font-size: 16px;
    color: #353535;
}

.article .abstract-text {
    text-align: justify;
    font-size: 15px;
    line-height: 24px;
    font-family: Georgia, fantasy;
}

.article .tab-tip {
    margin-bottom: 1%;
    color: #909eb4;
    font-size: 13px;
    font-family: 'Times New Roman', Times, serif;
}

.article .reference-block {
    padding-top: 20px;
    padding-bottom: 20px;
}

.article .reference-block:hover {
    background: #f4f9ff;
    cursor: pointer;
}

.article .keyword-block {
    padding-top: 20px;
    padding-bottom: 20px;
}

.article .keyword-block:hover {
    background: #f4f9ff;
    cursor: default;
}

.article .reference-title {
    font-size: 15px;
}

.article .reference-author {
    font-size: 14px;
    margin-top: 1%;
    margin-bottom: 1%;
    color: #909eb4;
    font-family: 'Times New Roman', Times, serif;
}

.article .otherInfo {
    background-color: white;
    margin-left: 5%;
    margin-top: 2%;
    padding-top: 2%;
    padding-left: 2%;
    padding-right: 2%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .08), 0 0 6px rgba(0, 0, 0, .04);
    height: 130px;
}

.article .field {
    margin-top: 2%;
    margin-bottom: 2%;
}

.article .relation-author {
    font-size: 14px;
    color: #909eb4;
    font-family: 'Times New Roman', Times, serif;
    margin-top: 1%;
    margin-bottom: 3%;
    padding-top: 1%;
    padding-left: 1%;
    padding-right: 1%;
    padding-bottom: 1%;
}

.article .field:hover {
    background: #f4f9ff;
}

.article .copy {
    color: #409EFF;
}

.article .copy:hover {
    color: rgb(31, 124, 196);
    cursor: pointer;
}
</style>