<!-- 文章详情页面 -->
<template >
    <div style="background-color:#EBEEF5">
    <div class="article">
        <el-row class="title-block">
            <el-col :span="12">
                <div class="title">
                    {{ article.title }}
                </div>
                <div class="subtitle">
                    <span v-for="(author,index) in article.author">
                        <span class="hyperlink">{{ author }}</span>
                        <span v-if="index != article.author.length">&ensp;, </span>
                    </span>
                </div>
                <div class="subtitle">
                    <span v-if="article.institution">{{ article.institution }}</span>
                </div>
                <div class="subtitle">
                    <span v-if="article.year">{{ article.year }}</span>
                    <span v-if="article.journal.name">&ensp;{{ article.journal.name }}</span>
                    <span v-if="article.journal.volume"> | Volume：{{ article.journal.volume }}, </span>
                    <span v-if="article.journal.first_page">pp：{{ article.journal.first_page }}</span>
                    <span v-if="article.journal.last_page">-{{ article.journal.last_page }}</span>
                </div>
                <div class="subtitle">
                    <span v-if="article.DOI">DOI: <span class="hyperlink">{{ article.DOI }}</span></span>
                </div>
                <div class="button">
                    <el-tooltip class="item" effect="light" content="下载" placement="bottom">
                        <el-button type="primary" icon="Download" circle @click="download"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="收藏" placement="bottom">
                        <el-button type="warning" icon="Star" circle @click="star"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="分享" placement="bottom">
                        <el-button type="danger" icon="Share" circle @click="share"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="引用" placement="bottom">
                        <el-button type="info" icon="Promotion" circle @click="quote"></el-button>
                    </el-tooltip>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="16">
                <div class="articleDetail">
                    <span v-if="article.abstract">
                        <div class="abstract-title">摘要</div>
                        <span v-if="article.abstract.length > 780">
                            <span v-if="isFold">
                                <span class="abstract-text">{{ article.abstract.substring(0,780) }}... </span>
                                <span class="hyperlink" @click="changeFoldState">展开</span>
                            </span>
                            <span v-else>
                                <span class="abstract-text">{{ article.abstract }}</span>
                                <span class="hyperlink" @click="changeFoldState"> 折叠</span>
                            </span>
                        </span>
                        <span v-else class="abstract-text">
                            {{ article.abstract }}
                        </span>
                    </span>
                    <span v-else>
                        该文章无摘要信息.
                    </span>
                </div>
                <div class="articleDetail">
                    <el-tabs v-model="activeTab">
                        <el-tab-pane label="参考文献" name="first">
                            <div class="tab-tip">
                                共 {{ article.reference.length }} 条
                            </div>
                            <div class="tab-tip" v-if="article.reference.length>0">
                                由于版权限制，此处可能仅展示部分相关论文
                            </div>
                            <el-scrollbar height="350px">
                                <el-row v-for="(ref,index) in article.reference" class="reference-block" @click="toArticle(ref.articleId)">
                                    <el-col :span="1" style="text-align: left;">
                                        [{{ index + 1 }}] 
                                    </el-col>
                                    <el-col :span="22">
                                        {{ ref.articleTitle }}
                                        <div class="reference-author">
                                            <span v-for="(author,index2) in ref.authors">
                                                <span v-if="index2 < 5">
                                                    {{ author }}
                                                    <span v-if="index2 != ref.authors.length - 1 && (ref.authors.length < 5 || index2 != 4)">
                                                        , 
                                                    </span>
                                                </span>
                                                <span v-if="index2 == 4 && ref.authors.length >= 5 ">
                                                    .etc
                                                </span>
                                            </span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-scrollbar>
                        </el-tab-pane>
                        <el-tab-pane label="引证文献" name="second">
                            <div class="tab-tip">
                                共 {{ article.citation.length }} 条
                            </div>
                            <div class="tab-tip" v-if="article.reference.length>0">
                                由于版权限制，此处可能仅展示部分相关论文
                            </div>
                            <el-scrollbar height="350px">
                                <el-row v-for="(ref,index) in article.citation" class="reference-block" @click="toArticle(ref.articleId)">
                                    <el-col :span="1" style="text-align: left;">
                                        [{{ index + 1 }}] 
                                    </el-col>
                                    <el-col :span="22">
                                        {{ ref.articleTitle }}
                                        <div class="reference-author">
                                            <span v-for="(author,index2) in ref.authors">
                                                <span v-if="index2 < 5">
                                                    {{ author }}
                                                    <span v-if="index2 != ref.authors.length - 1 && (ref.authors.length < 5 || index2 != 4)">
                                                        , 
                                                    </span>
                                                </span>
                                                <span v-if="index2 == 4 && ref.authors.length >= 5 ">
                                                    .etc
                                                </span>
                                            </span>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-scrollbar>
                        </el-tab-pane>
                        <el-tab-pane label="文章评论" name="third" @click="toComment">
                            <div class="tab-tip">
                                请前往弹出网页
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
            
            <el-col :span="6" class="otherInfo">
                <el-row style="text-align: center;">
                    <el-col :span="6">
                        <el-statistic title="引用量" :value="article.quoteCnt" value-style="color:#409EFF"/>
                    </el-col>
                    <el-col :span="6">
                        <el-statistic title="被引量" :value="article.citedCnt" value-style="color:#67C23A"/>
                    </el-col>
                    <el-col :span="6">
                        <el-statistic title="收藏数" :value="article.starCnt" value-style="color:#E6A23C;"/>
                    </el-col>
                    <el-col :span="6">
                        <el-statistic title="评论数" :value="article.cmtCnt" value-style="color:#F56C6C;"/>
                    </el-col>
                </el-row>
                <el-divider />
                <div>
                    <div class="abstract-title">领域</div>
                    <div v-for="(field,index) in article.fields" @click="toField(field.fieldId)" class="field">
                        - <span class="hyperlink">{{ field.name }}</span>
                    </div>
                </div>
                <el-divider />
                <div>
                    <div class="abstract-title">相关文献</div>
                    <div v-for="(rela,index) in article.relation" @click="toArticle(rela.articleId)" class="field">
                        <span class="hyperlink">{{ rela.name }}</span>
                        <div class="relation-author">
                            <span v-for="(author,index2) in rela.authors">
                                <span v-if="index2 < 2">
                                    {{ author }}
                                    <span v-if="index2 != rela.authors.length - 1 && (rela.authors.length < 3 || index2 != 2)">
                                        , 
                                    </span>
                                </span>
                                <span v-if="index2 == 2 && rela.authors.length >= 3 ">
                                    .etc
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</div>
</template>

<script>
export default{
    
    data(){
        return{
            id:0,
            article:{
                title:"Scalable Defect Detection via Traversal on Code Graph",
                author:["Zhengyao Liu","Xitong Zhong","Xingjing Deng","Shuo Hong","Xiang Gao","Hailong Sun"],
                institution:"Beihang University",
                year:"2021",
                DOI:"10.1007/978-3-030-87358-5_40",
                abstract:"Detecting defects and vulnerabilities in the early stage has long been a challenge in software engineering. Static analysis, a technique that inspects code without execution, has emerged as a key strategy to address this challenge. Among recent advancements,the use of graph-based representations, particularly Code Property Graph (CPG), has gained traction due to its comprehensive depiction of code structure and semantics. Despite the progress,existing graph-based analysis tools still face performance and scalability issues. The main bottleneck lies in the size and complexity of CPG, which makes analyzing large codebases inefficient and memory-consuming. Also, query rules used by the current tools can be over-specific. Hence, we introduce QVoG, a graph-based static analysis platform for detecting defects and vulnerabilities. It employs a compressed CPG representation to maintain a reasonable graph size, thereby enhancing the overall query efficiency. Based on the CPG, it also offers a declarative query language to simplify the queries. Furthermore, it takes a step forward to integrate machine learning to enhance the generality of vulnerability detection. For projects consisting of 1,000,000+ lines of code, QVoG can complete analysis in approximately 15 minutes, as opposed to 19 minutes with CodeQL.",
                journal:{
                    name:"Nature",
                    volume:"5",
                    first_page:"5784",
                    last_page:"5784",
                },
                reference: [
                                {
                                    authors: ["Sepp Hochreiter","Jürgen Schmidhuber"],
                                    articleId: 1,
                                    articleTitle: "Securing and sharing Elasticsearch resources with Read-onlyREST",
                                },
                                {
                                    authors: ["Sepp Hochreiter","Jürgen Schmidhuber","TieZhu Ding","ChenXi Ding","TieZhu Ding","TieZhu Ding"],
                                    articleId: 1,
                                    articleTitle: "BUAA VS TsingHua Xue YeYe Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo",
                                },
                                {
                                    authors: ["Sepp Hochreiter","Jürgen Schmidhuber","TieZhu Ding","ChenXi Ding","TieZhu Ding","TieZhu Ding"],
                                    articleId: 1,
                                    articleTitle: "BUAA VS TsingHua Xue YeYe Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo",
                                },
                                {
                                    authors: ["Sepp Hochreiter","Jürgen Schmidhuber","TieZhu Ding","ChenXi Ding","TieZhu Ding","TieZhu Ding"],
                                    articleId: 1,
                                    articleTitle: "BUAA VS TsingHua Xue YeYe Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo",
                                },
                                {
                                    authors: ["Sepp Hochreiter","Jürgen Schmidhuber","TieZhu Ding","ChenXi Ding","TieZhu Ding","TieZhu Ding"],
                                    articleId: 1,
                                    articleTitle: "BUAA VS TsingHua Xue YeYe Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo",
                                },
                                {
                                    authors: ["Sepp Hochreiter","Jürgen Schmidhuber","TieZhu Ding","ChenXi Ding","TieZhu Ding","TieZhu Ding"],
                                    articleId: 1,
                                    articleTitle: "BUAA VS TsingHua Xue YeYe Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo",
                                },
                                {
                                    authors: ["Sepp Hochreiter","Jürgen Schmidhuber","TieZhu Ding","ChenXi Ding","TieZhu Ding","TieZhu Ding"],
                                    articleId: 1,
                                    articleTitle: "BUAA VS TsingHua Xue YeYe Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo",
                                },
                                {
                                    authors: ["Sepp Hochreiter","Jürgen Schmidhuber","TieZhu Ding","ChenXi Ding","TieZhu Ding","TieZhu Ding"],
                                    articleId: 1,
                                    articleTitle: "BUAA VS TsingHua Xue YeYe Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo",
                                },
                                {
                                    authors: ["Sepp Hochreiter","Jürgen Schmidhuber","TieZhu Ding","ChenXi Ding","TieZhu Ding","TieZhu Ding"],
                                    articleId: 1,
                                    articleTitle: "BUAA VS TsingHua Xue YeYe Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo",
                                },
                ],
                citation: [
                                {
                                    authors: ["Sepp Hochreiter","Jürgen Schmidhuber"],
                                    articleId: 1,
                                    articleTitle: "Securing and sharing Elasticsearch resources with Read-onlyREST",
                                },
                                {
                                    authors: ["Edmund K. Burke","Patrick De Causmaecker","Geert De Maere"],
                                    articleId: 2,
                                    articleTitle: "A multi-objective approach for robust airline scheduling",
                                },
                                {
                                    authors: ["Sepp Hochreiter","Jürgen Schmidhuber","TieZhu Ding","ChenXi Ding","TieZhu Ding","TieZhu Ding"],
                                    articleId: 1,
                                    articleTitle: "BUAA VS TsingHua Xue YeYe Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo",
                                },
                                {
                                    authors: ["Sepp Hochreiter","Jürgen Schmidhuber","TieZhu Ding","ChenXi Ding","TieZhu Ding","TieZhu Ding"],
                                    articleId: 1,
                                    articleTitle: "BUAA VS TsingHua Xue YeYe Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo",
                                },
                                {
                                    authors: ["Sepp Hochreiter","Jürgen Schmidhuber","TieZhu Ding","ChenXi Ding","TieZhu Ding","TieZhu Ding"],
                                    articleId: 1,
                                    articleTitle: "BUAA VS TsingHua Xue YeYe Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo",
                                },
                                {
                                    authors: ["Sepp Hochreiter","Jürgen Schmidhuber","TieZhu Ding","ChenXi Ding","TieZhu Ding","TieZhu Ding"],
                                    articleId: 1,
                                    articleTitle: "BUAA VS TsingHua Xue YeYe Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo Bie Da Wo",
                                },
                ],
                quoteCnt:36,
                citedCnt:5112,
                starCnt:2,
                cmtCnt:1,
                fields:[
                    {
                        name:"Computer",
                        fieldId:5,
                    },
                    {
                        name:"Arithmetic",
                        fieldId:6,
                    },
                    {
                        name:"Software",
                        fieldId:7,
                    },
                    {
                        name:"Auto",
                        fieldId:8,
                    },
                    {
                        name:"CPG",
                        fieldId:10,
                    },
                ],
                relation:[
                    {
                        name:"A comprehensive survey: artificial bee colony (ABC) algorithm and applications",
                        articleId:5,
                        authors: ["Sepp Hochreiter","Jürgen Schmidhuber"],
                    },
                    {
                        name:"Variants of Artificial Bee Colony algorithm and its applications in medical image processing",
                        articleId:9,
                        authors: ["Sepp Hochreiter","Jürgen Schmidhuber","TieZhu Ding","ChenXi Ding","TieZhu Ding","TieZhu Ding"],
                    },
                ],
            },
            isFold:true,
            activeTab:"first",
        }
    },

    methods: {
        download(){

        },

        star(){

        },

        share(){

        },

        quote(){

        },

        changeFoldState(){
            this.isFold = !this.isFold
        },

        toArticle(id){

        },

        toComment(){

        },

        toField(id){

        },
    },

    mounted(){
        
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
    padding-top: 10px;
}

.article .reference-block:hover {
    background: #f4f9ff;
    cursor: pointer;
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
    cursor: pointer;
}
</style>