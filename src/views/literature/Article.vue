<!-- 文章详情页面 -->
<template >
    <div style="background-color:#EBEEF5" v-loading="isLoading"
    element-loading-background="rgb(244, 246, 247)"
    element-loading-text="正在为您全力加载中..."
    >
    <div class="article">
        <el-row class="title-block">
            <el-col :span="12">
                <div class="title">
                    {{ article.title }}
                </div>
                <div class="subtitle">
                    <span v-for="(author,index) in article.author">
                        <span class="hyperlink" @click="toGateway(author.id)">{{ author.authorName }}</span>
                        <sup v-if="institutionNoRepeat.length > 1">{{ authorToInstitution[index] }}</sup>
                        <span v-if="index != article.author.length - 1">&ensp;, </span>
                    </span>
                </div>
                <div class="subtitle" style="padding-right: 0%">
                    <span v-for="(tmp,index) in institutionNoRepeat">
                        <span v-if="institutionNoRepeat.length > 1">{{ index + 1 }}.&ensp;</span>{{ tmp }}
                        <span v-if="index != institutionNoRepeat.length - 1">&ensp;, </span>
                    </span>
                </div>
                <div class="subtitle">
                    <span v-if="article.year">{{ article.year }}</span>
                    <span v-if="article.journal.name">&ensp;{{ article.journal.name }}</span>
                    <span v-if="article.journal.volume"> | Volume：{{ article.journal.volume }}</span>
                    <span v-if="article.journal.first_page">, pp：{{ article.journal.first_page }}</span>
                    <span v-if="article.journal.last_page">-{{ article.journal.last_page }}</span>
                </div>
                <div class="subtitle">
                    <span v-if="article.DOI">DOI: <span class="hyperlink" @click="toDOI()">{{ article.DOI }}</span></span>
                </div>
                <div class="button">
                    <el-tooltip class="item" effect="light" content="下载" placement="bottom">
                        <el-button type="primary" icon="Download" circle @click="download"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="收藏" placement="bottom" v-if="!isStar">
                        <el-button type="warning" icon="Star" circle @click="star"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="收藏" placement="bottom" v-else>
                        <el-button type="warning" icon="Star-Filled" circle @click="undoStar"></el-button>
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
                    <div class="abstract-title">摘要</div>
                    <span v-if="article.abstract">
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
                            <span v-if="article.abstract === 'null'">暂无摘要信息.</span>
                            <span v-else>{{ article.abstract }}</span>
                        </span>
                    </span>
                    <span v-else class="tab-tip">
                        该文章无摘要信息.
                    </span>
                </div>
                <div class="articleDetail">
                    <el-tabs v-model="activeTab" @tab-click="toComment">
                        <el-tab-pane label="参考文献" name="first">
                            <div class="tab-tip" v-if="article.refCnt">
                                共 {{ article.refCnt }} 条
                            </div>
                            <div class="tab-tip" v-else>
                                暂无该文章参考文献.
                            </div>
                            <div class="tab-tip" v-if="article.reference && article.refCnt > 0">
                                由于版权限制，此处可能仅展示部分相关论文
                            </div>
                            <el-scrollbar height="350px">
                                <el-row v-if="article.reference" v-for="(ref,index) in article.reference" class="reference-block" @click="toOpenAlex(ref.articleId)">
                                    <el-col :span="1" style="text-align: left;">
                                        [{{ index + 1 }}] 
                                    </el-col>
                                    <el-col :span="22" class="hyperlink">
                                        {{ ref.articleId }}
                                        <!-- <div class="reference-author">
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
                                        </div> -->
                                    </el-col>
                                </el-row>
                            </el-scrollbar>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="引证文献" name="second">
                            <div class="tab-tip">
                                共 {{ article.citation.length }} 条
                            </div>
                            <div class="tab-tip" v-if="article.citation.length>0">
                                由于版权限制，此处可能仅展示部分相关论文
                            </div>
                            <div class="tab-tip" v-else>
                                暂无引证文献.
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
                        </el-tab-pane> -->
                        <el-tab-pane label="文章评论" name="third">
                            <div class="tab-tip">
                                请前往弹出网页
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
            
            <el-col :span="6" class="otherInfo">
                <el-row style="text-align: center;">
                    <!-- <el-col :span="6">
                        <el-statistic title="引用量" :value="article.quoteCnt" value-style="color:#409EFF"/>
                    </el-col> -->
                    <el-col :span="8">
                        <el-statistic title="被引量" :value="article.citedCnt" value-style="color:#67C23A"/>
                    </el-col>
                    <el-col :span="8">
                        <el-statistic title="收藏数" :value="starCnt" value-style="color:#E6A23C;"/>
                    </el-col>
                    <el-col :span="8">
                        <el-statistic title="评论数" :value="article.cmtCnt" value-style="color:#F56C6C;"/>
                    </el-col>
                </el-row>
                <el-divider />
                <div>
                    <div class="abstract-title">领域</div>
                    <div v-if="article.fields.length > 1" v-for="(field,index) in article.fields" class="field">
                        - <span class="hyperlink" @click="toField(field.id)">{{ field.name }}</span>
                    </div>
                    <div v-else class="field tab-tip">暂无领域信息.</div>
                </div>
                <el-divider />
                <div>
                    <div class="abstract-title">相关文献</div>
                    <div v-if="article.relation.length > 0" v-for="(rela,index) in article.relation" @click="toOpenAlex(rela.articleId)" class="field">
                        <span class="hyperlink">{{ rela.articleId }}</span>
                        <!-- <div class="relation-author">
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
                        </div> -->
                    </div>
                    <div v-else class="tab-tip" style="padding-top: 2%;">
                        暂无相关文献.
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</div>

<!-- <el-dialog v-model="quoteDialog" width="800" align-center title="引用" style="font-weight: bold;">
    <div style="color:black;padding-top: 1%;font-size: 15px;font-weight: normal">
        <div class="">GB/T 7714-2015 格式引文</div>
        <div>{{ quotation }}</div>
    </div>
</el-dialog> -->

</template>

<script>
import { GetArticle, GetStar, GetStarCnt, PostStar } from '@/api/article';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

export default{
    
    data(){
        return{
            id:0,
            article:{
                title:"Scalable Defect Detection via Traversal on Code Graph",
                author:[{authorName:"Zhengyao Liu",id:1},{authorName:"Xitong Zhong",id:2},{authorName:"Xingjing Deng",id:3},{authorName:"Shuo Hong",id:4},{authorName:"Xiang Gao",id:5},{authorName:"Hailong Sun",id:5}],
                institution:["Beihang University"],
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
                // quoteCnt:36,
                citedCnt:5112,
                starCnt:2,
                cmtCnt:1,
                fields:[
                    {
                        name:"Computer",
                        id:"10",
                    },
                    {
                        name:"Arithmetic",
                        id:"10",
                    },
                    {
                        name:"Software",
                        id:"10",
                    },
                    {
                        name:"Auto",
                        id:"10",
                    },
                    {
                        name:"CPG",
                        id:"10",
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
                download:"https://www.baidu.com/",
            },
            starCnt:0,
            quotation:"",// 论文的引用
            isFold:true,
            activeTab:"first",
            router:useRouter(),
            // quoteDialog:false,
            isStar:false,
            isLoading:false,
            userId:0,
            institutionNoRepeat:[], 
            authorToInstitution:[],// 作者和机构的对应关系
        }
    },
    methods: {
        download(){
            if(this.article.download != null){
                window.open(this.article.download, '_blank');
            }
            else{
                ElMessage({
                    message: '暂无下载链接.',
                    type: 'warning',
                    plain: true,
                });
            }
        },

        star(){
            this.isStar = true;
            var promise = PostStar(this.userId,this.id,this.isStar);
            this.starCnt++;
        },

        undoStar(){
            this.isStar = false;
            var promise = PostStar(this.userId,this.id,this.isStar);
            this.starCnt--;
        },

        async share() {
            try {
                // 创建一个临时的textarea元素，用于复制文本
                const textArea = document.createElement('textarea');
                textArea.value = window.location.href;  // 设置为你想要复制的内容
                document.body.appendChild(textArea);
                textArea.select();  // 选择文本
                document.execCommand('copy');  // 执行复制操作
                document.body.removeChild(textArea);  // 移除临时的textarea

                ElMessage({
                    message: '分享链接已复制到剪切板',
                    type: 'success',
                    plain: true,
                });
            } catch (err) {
                ElMessage({
                    message: '文本复制失败：' + err,
                    type: 'error',
                    plain: true,
                });
            }
        },


        async quote(){
            try {
                // 创建一个临时的textarea元素，用于复制文本
                const textArea = document.createElement('textarea');
                textArea.value = this.quotation;  // 设置为你想要复制的内容
                document.body.appendChild(textArea);
                textArea.select();  // 选择文本
                document.execCommand('copy');  // 执行复制操作
                document.body.removeChild(textArea);  // 移除临时的textarea
                // await navigator.clipboard.writeText(this.quotation);
                ElMessage({
                    message: '引用格式已复制到剪切板',
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
        },

        changeFoldState(){
            this.isFold = !this.isFold
        },

        toArticle(id){
            // 获取目标 URL
            const targetUrl = this.router.resolve({ path: '/article', query: { paperId: this.id } }).href;
            // 使用 window.open 打开新窗口
            window.open(targetUrl, '_blank');
        },

        toComment(tab){
            if(tab.props.name === "third"){
                // 获取目标 URL
                const targetUrl = this.router.resolve({ path: '/comment', query: { paperId: this.id } }).href;
                // 使用 window.open 打开新窗口
                window.open(targetUrl, '_blank');
            }
        },

        toField(id){
            // 获取目标 URL
            const targetUrl = this.router.resolve({ path: '/field', query:{id:id} }).href;
            // 使用 window.open 打开新窗口
            window.open(targetUrl, '_blank');
        },

        toGateway(id){
            // 获取目标 URL
            const targetUrl = this.router.resolve({ path: '/gateway', query:{userId:id} }).href;
            // 使用 window.open 打开新窗口
            window.open(targetUrl, '_blank');
        },

        toDOI(){
            window.open(this.article.DOI, '_blank');
        },

        formatGB7714() {
            let tmp = "[1] ";

            // 拼接作者信息
            let authors = this.formatAuthors();
            tmp += authors ? authors + '. ' : '';  // 如果没有作者信息，直接不显示。

            // 拼接文章标题
            tmp += this.article.title ? `"${this.article.title}"[J]. ` : '[无标题][J]. ';  // 如果没有标题，使用[无标题]

            // 拼接期刊信息
            if (this.article.journal) {
                const journalName = this.article.journal.name || '';  // 如果期刊名缺失，则省略
                const year = this.article.year || '';  // 如果年份缺失，则省略
                const volume = this.article.journal.volume ? `${this.article.journal.volume}` : '';  // 卷号缺失则省略
                const issue = this.article.journal.issue ? `(${this.article.journal.issue})` : '';  // 期号缺失则省略
                const firstPage = this.article.journal.first_page || '';  // 起始页缺失则省略
                const lastPage = this.article.journal.last_page || '';  // 终止页缺失则省略

                // 期刊信息拼接
                if (journalName) {
                    tmp += `${journalName}, `;
                }
                if (year) {
                    tmp += `${year}, `;
                }
                if (volume || issue) {
                    tmp += `${volume}${issue}`;
                }
                if (firstPage && lastPage) {
                    tmp += `: ${firstPage}-${lastPage}. `;
                } else if (firstPage) {
                    tmp += `: ${firstPage}. `;
                }
            }

            // 拼接DOI信息
            if (this.article.DOI) {
                tmp += `DOI: ${this.article.DOI}.`;
            }

            return tmp;
        },
        // 格式化作者信息
        formatAuthors() {
            if (this.article.author.length === 1) {
                return this.article.author[0].authorName;
            } else if (this.article.author.length === 2) {
                return this.article.author[0].authorName + ' 和 ' + this.article.author[1].authorName;
            } else if(this.article.author.length > 2){
                // 超过两个作者，取前三个，并在末尾加上“等”
                return this.article.author[0].authorName + '、' + this.article.author[1].authorName + '、' + this.article.author[2].authorName + ' 等';
            }
            return "";
        },
        toOpenAlex(id){
            window.open(id, '_blank');
        }
    },

    mounted(){
        this.id = this.$route.query.paperId;
        this.isLoading = true;
        this.userId = this.$cookies.get('userId');
        var isStar = false,isArticle = false,isCnt = false;

        var promise = GetArticle(this.id);
        promise
        .then((result) => {

            if(result.status === "error"){
                // ElMessage({
                //     message: '该论文不存在',
                //     type: 'error',
                //     plain: true,
                // });
                ElMessageBox.confirm(
                    "该论文不存在。",
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
                })
                .catch(() => {
                    // 点击取消，返回上一页
                    window.history.back();
                });
            }
            else{
                console.log("TTTTTT")
                console.log(result.article);
                this.article = result.article;
                // 去除无参考文献的数据
                this.article.refCnt = this.article.reference.length;
                // this.article.reference = this.article.reference.filter(ele => ele.articleTitle !== 'title_ex');
                // 去除无相关文献的数据
                this.article.relaCnt = this.article.relation.length;
                // this.article.relation = this.article.relation.filter(ele => ele.articleTitle !== 'title_ex');

                this.quotation = this.formatGB7714();
                this.institutionNoRepeat = [...new Set(this.article.institution)];
                isArticle = true;

                if(isArticle && isStar && isCnt){
                    this.isLoading = false;
                }

                if(this.institutionNoRepeat.length > 0){
                    var i = 0;
                    for(;i < this.article.author.length;i++){
                        var j = 0;
                        var isTurn = false;
                        for(;j < this.institutionNoRepeat.length;j++){
                            if(this.article.institution[i] === this.institutionNoRepeat[j]){
                                this.authorToInstitution.push(j + 1);
                                isTurn = true;
                                break;
                            }
                        }
                        if(!isTurn){
                            this.authorToInstitution.push(Math.floor(Math.random() * this.institutionNoRepeat.length) + 1)
                        }
                    }
                }
            }
        })
        .finally(() => {
            console.log(this.article)
        })

        var promise2 = GetStar(this.userId,this.id);
        promise2
        .then((result) => {
            this.isStar = result.isStar;

            isStar = true;
            if(isArticle && isStar && isCnt){
                this.isLoading = false;
            }
        })

        var promise3 = GetStarCnt(this.id);
        promise3
        .then((result) => {
            this.starCnt = result.count;

            isCnt = true;
            if(isArticle && isStar && isCnt){
                this.isLoading = false;
            }
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
}
</style>