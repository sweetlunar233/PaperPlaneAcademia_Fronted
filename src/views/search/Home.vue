<!-- 首页 -->
<script setup>
import PageHeader from "../../components/PageHeader.vue";
import Articles from "../../components/Articles.vue";
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

import { GetTopArticles, GetRecommendedArticles } from '../../api/home.js'

const searchValue = ref("");
const topOrRec = ref("hot-gate-artiles");
const top_articles = ref([
    {

    }
]);
const recommended_articles = ref([
    {

    }
]);

const userId = ref("");
const internalInstance = getCurrentInstance()
const internalData = internalInstance.appContext.config.globalProperties
userId.value = internalData.$cookies.get('userId') // 后面的为之前设置的cookies的名字

const goSearch = () => {
    router.push({
    path: '/???',
    query: {
      searchValue: searchValue.value
    }
  });
}

const initHome = (userId) => {
    top_articles.value = [];
    recommended_articles.value = [];
    var promise = GetTopArticles(userId);
    promise.then((result)=>{
        result.data.forEach(element => {
            top_articles.value.push(element);
        });
    });

    var promise = GetRecommendedArticles(userId);
    promise.then((result)=>{
        result.data.forEach(element => {
            recommended_articles.value.push(element);
        });
    });
}

initHome(userId.value);

</script>

<template>
<div class="home">
    <!-- 背景图 -->
    <div class="background">
        <img src="" alt="" class="background-img">
    </div>
    <!-- 导航栏 -->
    <PageHeader></PageHeader>
    <!-- 搜索框 -->
    <div class="main">
        <div class="title-and-input">
            <div class="title">Paper Wing Acdemia ( 放洋屁 )</div>
            <div class="input-box">
                <el-input placeholder="请输入内容"
                    v-model="searchValue"
                    class="input"
                    @keyup.enter.native="goSearch"
                    style="width: 750px; font-size: 17px"
                >
                <el-button slot="append" icon="el-icon-search" @click="goSearch"></el-button>
                </el-input>
            </div>
        </div>

        <div class="logos">
            <el-row gutter="0" justify="center" type="flex">
                <el-col :span="5">
                    <div class="grid-content bg-purple test_a">
                        <el-row>
                            <el-col :span="5" style="padding:10px; margin-right:20px">
                            <img class="image" src="" style="width:70px">
                            </el-col>
                            <el-col :span="5" style="padding:10px; margin-left:20px">
                            <h3 class="sub-title">Authors</h3>
                            <h2 class="sub-number">{{  }}</h2>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="grid-content bg-purple test_a">
                        <el-row>
                            <el-col :span="6" style="padding:10px; margin-right:20px">
                            <img class="image" src="" style="width:70px">
                            </el-col>
                            <el-col :span="5" style="padding:10px; margin-left:20px">
                            <h3 class="sub-title">Papers</h3>
                            <h2 class="sub-number">{{  }}</h2>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="grid-content bg-purple test_a">
                        <el-row>
                            <el-col :span="6" style="padding:10px; margin-right:20px">
                            <img class="image" src="" style="width:70px">
                            </el-col>
                            <el-col :span="5" style="padding:10px; margin-left:20px">
                            <h3 class="sub-title">Journals</h3>
                            <h2 class="sub-number">{{  }}</h2>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="grid-content bg-purple test_a">
                        <el-row>
                            <el-col :span="6" style="padding:10px; margin-right:20px">
                            <img class="image" src="" style="width:70px">
                            </el-col>
                            <el-col :span="5" style="padding:10px; margin-left:20px">
                            <h3 class="sub-title">Organizations</h3>
                            <h2 class="sub-number">{{  }}</h2>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="grid-content bg-purple test_a">
                        <el-row>
                            <el-col :span="6" style="padding:10px; margin-right:20px">
                            <img class="image" src="" style="width:70px">
                            </el-col>
                            <el-col :span="5" style="padding:10px; margin-left:20px">
                            <h3 class="sub-title">Field</h3>
                            <h2 class="sub-number">{{  }}</h2>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="recommend">
            <el-tabs v-model="topOrRec">
                <el-tab-pane label="热门文献" name="hot-gate-articles" style="text-align: left">
                <Articles :articles="top_articles"></Articles>
                </el-tab-pane>
                <el-tab-pane label="推荐文献" name="push-bitch-articles" style="text-align: left">
                <Articles :articles="recommended_articles"></Articles>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</div>
</template>

<style scoped>
.home {
  min-width: 1100px;
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

.home .input-box >>> .el-input.is-active .el-input__inner, .el-input__inner:focus {
  border: 5px solid #409EFF;
}

.home .input-box >>> .el-input__inner {
  height: 50px;
}

.home .input-box >>> .el-input-group__append {
  background-color: #409EFF;
  color: white;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  border: none;
  border-radius: 0 6px 6px 0;
  padding: 0 20px;
  width: 1px;
  white-space: nowrap;
}

.home .input-box >>> .el-input-group__append:hover {
  background-color: #52a9ff;
}

.home .input-box >>> .el-input-group--prepend {
  border-radius: 6px 0 0 6px;
}

.home .title-and-input .input-box button {
  color: white;
}

.home .title {
  font-family: "Asap SemiBold",tahoma,arial,"Hiragino Sans GB",\5b8b\4f53, sans-serif;
  font-size: 60px;
  margin-top: 160px;
  color: white;
  font-weight: 600;
}
</style>