<template >
    <div style="background-color:#EBEEF5" v-loading="isLoading" element-loading-background="rgba(244, 246, 247,0.8)">
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
                    <el-tabs v-model="activeTab" @tab-click="toComment">
                        <el-tab-pane label="关键字" name="second">
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
                        <el-tab-pane label="同级领域" name="third">
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
                        <el-statistic title="被引量" :value="field.citedCound" value-style="color:#E6A23C;"/>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</div>

</template>

<script>
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

export default{
    
    data(){
        return{
            id:0,
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
            activeTab:"second",
            router:useRouter(),
        }
    },
    methods: {

        toField(id){
            // 获取目标 URL
            const targetUrl = this.router.resolve({ path: '/field', query: { id: id } }).href;
            // 使用 window.open 打开新窗口
            window.open(targetUrl, '_blank');
        },

        changeFoldState(){
            this.isFold = !this.isFold
        },

        async copy(content){
            try {
                await navigator.clipboard.writeText(content);
                ElMessage({
                    message: '引用格式已复制到剪切板',
                    type: 'success',
                    plain: true,
                });
            } catch (err) {
                ElMessage({
                    message: '文本复制失败：',
                    type: 'error',
                    plain: true,
                });
            }
        }
    },

    mounted(){
        // this.id = this.$route.query.id;
        // this.isLoading = true;

    },
}

</script>

<style  scoped>

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