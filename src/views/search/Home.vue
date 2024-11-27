<!-- 首页 -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentInstance } from 'vue';
const router = useRouter();

import { GetTopArticles, GetRecommendedArticles, GetStatistics } from '../../api/home.js'

import {
    Search,
} from '@element-plus/icons-vue'

const searchValue = ref("");
const topOrRec = ref("hot-gate-artiles");
const top_articles = ref([
  {
    authors: [
      {
        userId: "3323123",
        userName: "Sergei Belousov"
      },
      {
        userId: "3323123",
        userName: "Sergei Belousov"
      },
    ],
    paperId: "123456",
    paperTitle: "ABCDE",
    year: "2024-11-21",
    abstract: "ref(value: { authors: { userId: string; userName: string; }[];",
    collectNum: 25,
    citationNum: 35,
  }
]);
const recommended_articles = ref([
  {
    authors: [
      {
        userId: "3323123",
        userName: "Sergei Belousov"
      },
      {
        userId: "3323123",
        userName: "Sergei Belousov"
      },
    ],
    paperId: "123456",
    paperTitle: "ABCDE",
    year: "2024-11-21",
    abstract: "ref(value: { authors: { userId: string; userName: string; }[];",
    collectNum: 25,
    citationNum: 35,
  }
]);

const statistic = ref({
  authorCount: '280,050,502',
  organizationsCount: '16,479',
  fieldsCount: '714,856',
  journalCount: '49,063',
  paperCount: '269,451,039'
})

const internalInstance = getCurrentInstance();
const internalData = internalInstance.appContext.config.globalProperties;
const userId = ref(internalData.$cookies.get('userId') || '00000'); // 后面的为之前设置的cookies的名字

const goSearch = () => {
    router.push({
    path: '/???',
    query: {
      searchValue: searchValue.value
    }
  });
}

const FormatString = (value) => {
  if (!value) return "";
  if (value.length > 300) {
    return value.slice(0,300) + "...";
  }
  return value;
}

const initHome = (userId) => {
    // top_articles.value = [];
    // recommended_articles.value = [];
    var promise = GetTopArticles();
    promise.then((result)=>{
        result.articles.forEach(element => {
            top_articles.value.push(element);
        });
    });

    var promise = GetRecommendedArticles();
    promise.then((result)=>{
        result.articles.forEach(element => {
            recommended_articles.value.push(element);
        });
    });

    var promise = GetStatistics();
    promise.then((result)=>{
      statistic.value.authorCount = result.authorCount.toLocaleString();
      statistic.value.organizationsCount = result.organizationsCount.toLocaleString();
      statistic.value.fieldsCount = result.fieldsCount.toLocaleString();
      statistic.value.journalCount = result.journalCount.toLocaleString();
      statistic.value.paperCount = result.paperCount.toLocaleString();
    });
}

initHome(userId.value);

</script>

<template>
<div class="home">
    <div class="background">
        <img src="" alt="" class="background-img">
    </div>
    <div class="main">
        <div class="title-and-input">
            <div class="title">Paper Wing Acdemia</div>
            <div class="input-box">
                <el-input placeholder="请输入内容"
                    v-model="searchValue"
                    class="input"
                    @keyup.enter.native="goSearch"
                    style="width: 750px; font-size: 17px"
                >
                <template #append>
                    <el-button :icon="Search" @click="goSearch"></el-button>
                </template>
                </el-input>
            </div>
        </div>

        <div class="logos">
            <!-- <el-row gutter="0" justify="center" type="flex">
                <el-col :span="4">
                    <div class="grid-content bg-purple test_a">
                        <el-row>
                            <el-col :span="5" style="padding:10px; margin-right:20px">
                            <img class="image" src="" style="width:70px">
                            </el-col>
                            <el-col :span="5" style="padding:10px; margin-left:20px">
                            <h3 class="sub-title">Authors</h3>
                            <h2 class="sub-number">{{ statistic.authorCount }}</h2>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple test_a">
                        <el-row>
                            <el-col :span="6" style="padding:10px; margin-right:20px">
                            <img class="image" src="" style="width:70px">
                            </el-col>
                            <el-col :span="5" style="padding:10px; margin-left:20px">
                            <h3 class="sub-title">Papers</h3>
                            <h2 class="sub-number">{{ statistic.paperCount }}</h2>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple test_a">
                        <el-row>
                            <el-col :span="6" style="padding:10px; margin-right:20px">
                            <img class="image" src="" style="width:70px">
                            </el-col>
                            <el-col :span="5" style="padding:10px; margin-left:20px">
                            <h3 class="sub-title">Journals</h3>
                            <h2 class="sub-number">{{ statistic.journalCount }}</h2>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple test_a">
                        <el-row>
                            <el-col :span="6" style="padding:10px; margin-right:20px">
                            <img class="image" src="" style="width:70px">
                            </el-col>
                            <el-col :span="5" style="padding:10px; margin-left:20px">
                            <h3 class="sub-title">Organizations</h3>
                            <h2 class="sub-number">{{ statistic.organizationsCount }}</h2>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple test_a">
                        <el-row>
                            <el-col :span="6" style="padding:10px; margin-right:20px">
                            <img class="image" src="" style="width:70px">
                            </el-col>
                            <el-col :span="5" style="padding:10px; margin-left:20px">
                            <h3 class="sub-title">Field</h3>
                            <h2 class="sub-number">{{ statistic.fieldsCount }}</h2>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row> -->
            <div style="display: flex; justify-content: center; gap: 20px;">
                <div class="grid-content bg-purple test_a" style="flex: 1; padding: 10px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                    <div style="display: flex; align-items: center;">
                        <div style="padding: 10px; margin-right: 20px;">
                            <img class="image" src="" style="width: 70px;">
                        </div>
                        <div style="padding: 10px;">
                            <h3 class="sub-title">Authors</h3>
                            <h2 class="sub-number">{{ statistic.authorCount }}</h2>
                        </div>
                    </div>
                </div>

                <div class="grid-content bg-purple test_a" style="flex: 1; padding: 10px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                    <div style="display: flex; align-items: center;">
                        <div style="padding: 10px; margin-right: 20px;">
                            <img class="image" src="" style="width: 70px;">
                        </div>
                        <div style="padding: 10px;">
                            <h3 class="sub-title">Papers</h3>
                            <h2 class="sub-number">{{ statistic.paperCount }}</h2>
                        </div>
                    </div>
                </div>

                <div class="grid-content bg-purple test_a" style="flex: 1; padding: 10px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                    <div style="display: flex; align-items: center;">
                        <div style="padding: 10px; margin-right: 20px;">
                            <img class="image" src="" style="width: 70px;">
                        </div>
                        <div style="padding: 10px;">
                            <h3 class="sub-title">Journals</h3>
                            <h2 class="sub-number">{{ statistic.journalCount }}</h2>
                        </div>
                    </div>
                </div>

                <div class="grid-content bg-purple test_a" style="flex: 1; padding: 10px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                    <div style="display: flex; align-items: center;">
                        <div style="padding: 10px; margin-right: 20px;">
                            <img class="image" src="" style="width: 70px;">
                        </div>
                        <div style="padding: 10px;">
                            <h3 class="sub-title">Organizations</h3>
                            <h2 class="sub-number">{{ statistic.organizationsCount }}</h2>
                        </div>
                    </div>
                </div>

                <div class="grid-content bg-purple test_a" style="flex: 1; padding: 10px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                    <div style="display: flex; align-items: center;">
                        <div style="padding: 10px; margin-right: 20px;">
                            <img class="image" src="" style="width: 70px;">
                        </div>
                        <div style="padding: 10px;">
                            <h3 class="sub-title">Field</h3>
                            <h2 class="sub-number">{{ statistic.fieldsCount }}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="recommend">
            <el-tabs v-model="topOrRec">
                <el-tab-pane label="热门文献" name="hot-gate-articles" style="text-align: left">
                    <div class="articles">
                        <div class="articles-body">
                            <div v-for="(article, index) in top_articles" v-bind:key="index">
                                <div style="text-align: left">
                                    <div style="margin-bottom: 10px">
                                        <span class="title" @click="gotoPaper(article.paperId)">{{ article.paperTitle }}</span>
                                    </div>
                                    <span v-for="(author, index1) in article.authors" :key="author" class="author-name">
                                        <span @click="gotoScholar(author.userId)">{{ author.userName }}</span>
                                        <span v-if="index1 < article.authors.length-1"></span>
                                    </span>
                                    <span class="publish-year"> · {{ article.year }}</span>
                                </div>

                                <div style="text-align:left;margin-top:10px;">
                                    <span class="abstract">{{ FormatString(article.abstract) }}</span>
                                </div>

                                <div class="citation-count">
                                    <span>{{ article.collectNum }}&nbsp;被收藏</span>
                                    <span>&nbsp;·&nbsp;{{ article.citationNum }}&nbsp;被引用</span>
                                </div>

                                <el-divider v-if="index < top_articles.length - 1"></el-divider>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="推荐文献" name="push-bitch-articles" style="text-align: left">
                  <div class="articles">
                        <div class="articles-body">
                            <div v-for="(article, index) in recommended_articles" v-bind:key="index">
                                <div style="text-align: left">
                                    <div style="margin-bottom: 10px">
                                        <span class="title" @click="gotoPaper(article.paperId)">{{ article.paperTitle }}</span>
                                    </div>
                                    <span v-for="(author, index1) in article.authors" :key="author" class="author-name">
                                        <span @click="gotoScholar(author.userId)">{{ author.userName }}</span>
                                        <span v-if="index1 < article.authors.length-1"></span>
                                    </span>
                                    <span class="publish-year"> · {{ article.year }}</span>
                                </div>

                                <div style="text-align:left;margin-top:10px;">
                                    <span class="abstract">{{ FormatString(article.abstract) }}</span>
                                </div>

                                <div class="citation-count">
                                    <span>{{ article.collectNum }}&nbsp;被收藏</span>
                                    <span>&nbsp;·&nbsp;{{ article.citationNum }}&nbsp;被引用</span>
                                </div>

                                <el-divider v-if="index < recommended_articles.length - 1"></el-divider>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</div>
</template>

<style scoped>
.home {
  background-color: #aaa;
  min-width: 100%;
  height: 100%;
}

.home .title-and-input {
  padding-left: 7%;
  padding-right: 10%;
  text-align: left;
}

.home .background {
  position:absolute;
  width:100%;
  height:100%;
  left:0;
  z-index:-1;
  object-fit: cover;
}

.home .input-box {
  margin-top: 60px;
}

.home .title-and-input .input-box button {
  color: white;
}

.home .title {
  /* font-family: "Asap SemiBold",tahoma,arial,"Hiragino Sans GB",\5b8b\4f53, sans-serif; */
  font-size: 60px;
  margin-top: 160px;
  color: white;
  font-weight: 600;
}

.home .sub-title {
  display:block;
  /* font-family: 'Courier New',serif; */
  font-weight:bold;
  margin-bottom:0 !important;
  color:white;
}

.home .sub-number {
  display:block;
  /* font-family:'Courier New',serif; */
  margin-top:10px;
  color:white;
}

.home .logos {
  margin-top: 230px;
  padding-top: 0px;
  padding-left: 5%;
  /* background-color: rgba(0, 0, 0, 0.2); */
}

.home .recommend {
  min-width: 900px;
  margin: 50px 12%;
  padding: 20px 40px 60px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .08), 0 0 6px rgba(0, 0, 0, .04)
}

.bg-purple {
  background: #f5f5f5;
  /* #efeefd */
  padding:20px;
  border-radius: 14px ;
  border: gainsboro solid 1px;
}

.home .grid-content {
  border-radius: 4px;
  min-height: 36px;
  width: 25%;
}

/* .home .test_a {
  display: block;
  margin: 0 auto;
  width:100%;
  overflow: hidden;
}

.home .test_a img {
  width: 100%;
  transform: scale(1);
  transition: all 1s ease 0s;
}

.home .test_a:hover img {
  transform: scale(1.2);
  transition: all 1s ease 0s;
} */


.author-name {
    color: #2d94d4;
    cursor: pointer;
    font-size: 14px;
}

.title {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.4;
    cursor: pointer;
    /* font-family: Tahoma,fantasy; */
}

.abstract {
    cursor: pointer;
    /* font-family: Georgia, Lato-Regular,Lato,sans-serif; */
    font-size: 15px;
    line-height: 22px;
    color: #262625;
}

.citation-count {
    margin-top: 10px;
    /* font-family: "Trebuchet MS", fantasy; */
    font-size: 13px;
    font-weight: 400;
    color: #73716f;
    line-height: 22px;
}

.publish-year {
    color:grey;
    font-size: 14px;
}
</style>

