<!-- 首页 -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentInstance } from 'vue';
const router = useRouter();

import { GetTopArticles, GetRecommendedArticles, GetStatistics } from '../../api/home.js'

const topOrRec = ref("hot-gate-articles");
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
    users: [
      {
        userId: "123456",
        userName: "WAACJIJI"
      }
    ],
    paperId: "123456",
    paperTitle: "ABCDE",
    year: "2024-11-21",
    abstract: "ref(value: { authors: { userId: string; userName: string; }[];",
    collectNum: 25,
    citationNum: 35,
  },
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
    users: [
      {
        userId: "123456",
        userName: "WAACJIJI"
      }
    ],
    paperId: "123456",
    paperTitle: "ABCDE",
    year: "2024-11-21",
    abstract: "ref(value: { authors: { userId: string; userName: string; }[];",
    collectNum: 25,
    citationNum: 35,
  },
  {
    authors: [
      {
        userName: "Sergei Belousov"
      },
      {
        userName: "Sergei Belousov"
      },
    ],
    users: [
      {
        userId: "123456",
        userName: "WAACJIJI"
      }
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
        userId: "-1",
        userName: "Sergei Belousov"
      },
    ],
    users: [
      {
        userId: "123456",
        userName: "WAACJIJI"
      }
    ],
    paperId: "123456",
    paperTitle: "ABCDE",
    year: "2024-11-21",
    abstract: "ref(value: { authors: { userId: string; userName: string; }[];",
    collectNum: 25,
    citationNum: 35,
  },
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
    users: [
      {
        userId: "123456",
        userName: "WAACJIJI"
      }
    ],
    paperId: "123456",
    paperTitle: "ABCDE",
    year: "2024-11-21",
    abstract: "ref(value: { authors: { userId: string; userName: string; }[];",
    collectNum: 25,
    citationNum: 35,
  },
  {
    authors: [
      {
        userName: "Sergei Belousov"
      },
      {
        userName: "Sergei Belousov"
      },
    ],
    users: [
      {
        userId: "123456",
        userName: "WAACJIJI"
      }
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
  authorCount: 20502,
  organizationsCount: 16479,
  fieldsCount: 31486,
  journalCount: 29063,
  paperCount: 26039
})

const internalInstance = getCurrentInstance();
const internalData = internalInstance.appContext.config.globalProperties;
const userId = ref(internalData.$cookies.get('userId') || '00000'); // 后面的为之前设置的cookies的名字

const quotes = [
  "What's the difference between Harry Potter and Jewish? Harry Potter escaped the Chamber.",
  "Success doesn't come from what you do occasionally, it comes from what you do consistently. Focus on your goals, stay disciplined, and be patient—your efforts will pay off in the end.",
  "God is black. How do you know? Because everyone calls him Father but no one have seen him.",
  "The road to success and the road to failure are almost exactly the same. The difference is persistence. Keep pushing, keep learning, and never let fear or failure hold you back from reaching your dreams.",
  "Don’t be afraid of change. It’s hard at first, messy in the middle, and gorgeous at the end. Embrace the unknown, trust that everything happens for a reason, and know that new opportunities are waiting for you.",
  "Success is not about the destination, but about the journey. It’s about how much you’ve learned, how much you’ve grown, and how many people you’ve helped along the way. Always keep growing, keep evolving, and never stop striving for the best version of yourself.",
  "You are never too old to set another goal or to dream a new dream. No matter where you are in life, it's never too late to start anew. Keep your heart open to new possibilities, and don’t let age or past mistakes define you.",
  "Believe in the power of positive thinking. Your thoughts shape your reality, and if you think positive, you’ll attract positive things into your life. Surround yourself with good energy, and let go of negativity.",
  "The only limit to our realization of tomorrow is our doubts of today. Don’t let fear or uncertainty stop you from chasing your dreams. Every step forward, no matter how small, brings you closer to where you want to be.",
  "The biggest adventure you can take is to live the life of your dreams. Don’t wait for the perfect moment to start—create the moment. Life is too short to live in the shadows of your fears; step into the light and shine with everything you’ve got."
];

const randomQuote = ref(quotes[Math.floor(Math.random() * quotes.length)]);

const updateQuote = () => {
  randomQuote.value = quotes[Math.floor(Math.random() * quotes.length)];
};

const FormatString = (value) => {
  if (!value) return "";
  if (value.length > 300) {
    return value.slice(0,300) + "...";
  }
  return value;
}

const gotoPaper = (paperId) => {
    router.push({
    path: '/article',
    query: {
        paperId: paperId
    }
  });
}

const gotoScholar = (userId) => {
    router.push({
    path: '/gateway',
    query: {
        userId: userId
    }
  });
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



//动画
// 目标数字数组
const targetNumbers = [202233, 45322, 781120, 123456, 67890];
targetNumbers.length = 0; // 清空原数组
Object.values(statistic.value).forEach((value, index) => {
  targetNumbers[index] = value;
});
const numbers = ref(targetNumbers.map(() => 0)); // 初始化所有数字为0

// 动画设置
const intervalTime = 50; // 每50毫秒更新一次
const increment = Math.ceil(1234); // 每次增加的数字，调整增量大小可以控制速度

// 动画函数
const startCounting = () => {
  const intervals = targetNumbers.map((target, index) => {
    return setInterval(() => {
        // if(index == 0 || index == 4){
        //     if (numbers.value[index] < target) {
        //         numbers.value[index] += increment * 8;
        //     } else {
        //         numbers.value[index] = target;
        //         clearInterval(intervals[index]); // 达到目标时停止
        //     }
        // }
        // else{
        //     if (numbers.value[index] < target) {
        //         numbers.value[index] += increment;
        //     } else {
        //         numbers.value[index] = target;
        //         clearInterval(intervals[index]); // 达到目标时停止
        //     }
        // }
        if (numbers.value[index] < target) {
            numbers.value[index] += increment;
        } else {
            numbers.value[index] = target;
            clearInterval(intervals[index]); // 达到目标时停止
        }
    }, intervalTime);
  });
};

// 页面加载完成后开始动画
onMounted(() => {
  startCounting();
});

</script>

<template>
<div class="home">
    <!-- <div class="background">
        <img src="../../assets/images/home/bg.jpg" alt="" class="background-img">
    </div> -->
    <div class="main">
        <div class="title-and-input">
            <div class="bigtitle">Paper Wing Academia</div>
            <div class="input-box">
                <p @click="updateQuote">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ randomQuote }}</p>
            </div>
        </div>

        <div class="logos">
            <div style="display: flex; justify-content: center; gap: 20px;">
                <div class="grid-content bg-purple test_a" style="flex: 1; padding: 10px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                    <div style="display: flex; align-items: center;">
                        <div style="padding: 10px; margin-right: 20px;">
                            <img class="image" src="../../assets/images/home/author.png" style="width: 70px;">
                        </div>
                        <div style="padding: 10px;">
                            <h3 class="sub-title">Authors</h3>
                            <!-- <h2 class="sub-number">{{ statistic.authorCount }}</h2> -->
                            <h2 class="sub-number">{{ numbers[0] }}</h2>
                        </div>
                    </div>
                </div>

                <div class="grid-content bg-purple test_a" style="flex: 1; padding: 10px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                    <div style="display: flex; align-items: center;">
                        <div style="padding: 10px; margin-right: 20px;">
                            <img class="image" src="../../assets/images/home/paper.png" style="width: 70px;">
                        </div>
                        <div style="padding: 10px;">
                            <h3 class="sub-title">Papers</h3>
                            <h2 class="sub-number">{{ numbers[1] }}</h2>
                        </div>
                    </div>
                </div>

                <div class="grid-content bg-purple test_a" style="flex: 1; padding: 10px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                    <div style="display: flex; align-items: center;">
                        <div style="padding: 10px; margin-right: 20px;">
                            <img class="image" src="../../assets/images/home/journal.png" style="width: 70px;">
                        </div>
                        <div style="padding: 10px;">
                            <h3 class="sub-title">Journals</h3>
                            <h2 class="sub-number">{{ numbers[2] }}</h2>
                        </div>
                    </div>
                </div>

                <div class="grid-content bg-purple test_a" style="flex: 1; padding: 10px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                    <div style="display: flex; align-items: center;">
                        <div style="padding: 10px; margin-right: 20px;">
                            <img class="image" src="../../assets/images/home/organization.png" style="width: 70px;">
                        </div>
                        <div style="padding: 10px;">
                            <h3 class="sub-title">Groups</h3>
                            <h2 class="sub-number">{{ numbers[3] }}</h2>
                        </div>
                    </div>
                </div>

                <div class="grid-content bg-purple test_a" style="flex: 1; padding: 10px; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                    <div style="display: flex; align-items: center;">
                        <div style="padding: 10px; margin-right: 20px;">
                            <img class="image" src="../../assets/images/home/field.png" style="width: 70px;">
                        </div>
                        <div style="padding: 10px;">
                            <h3 class="sub-title">Field</h3>
                            <h2 class="sub-number">{{ numbers[4] }}</h2>
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
                                        <span style="color: gray; cursor: default;"><u>{{ author.userName }}</u></span>
                                        <span v-if="index1 < article.authors.length-1">&nbsp;&nbsp;</span>
                                    </span>
                                    <span class="publish-year">&nbsp;&nbsp;·&nbsp;&nbsp;{{ article.year }}</span>
                                </div>

                                <div style="text-align: left; margin-top: 10px;">
                                    <span v-for="(user, index2) in article.users" :key="user" class="author-name">
                                        <span style="cursor:auto; color: black;">去作者空间:&nbsp;&nbsp;</span>
                                        <span @click="gotoScholar(user.userId)"><u>{{ user.userName }}</u></span>
                                        <span v-if="index2 < article.authors.length-1">&nbsp;&nbsp;</span>
                                    </span>
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
                                      <span style="color: gray; cursor: default;"><u>{{ author.userName }}</u></span>
                                      <span v-if="index1 < article.authors.length-1">&nbsp;&nbsp;</span>
                                    </span>
                                    <span class="publish-year">&nbsp;&nbsp;·&nbsp;&nbsp;{{ article.year }}</span>
                                </div>

                                <div style="text-align: left; margin-top: 10px;">
                                    <span v-for="(user, index2) in article.users" :key="user" class="author-name">
                                        <span style="cursor:auto; color: black;">去作者空间:&nbsp;&nbsp;</span>
                                        <span @click="gotoScholar(user.userId)"><u>{{ user.userName }}</u></span>
                                        <span v-if="index2 < article.authors.length-1">&nbsp;&nbsp;</span>
                                    </span>
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
  background-color: #f0f7ff;
  min-width: 100%;
  height: 100%;
}

.home .title-and-input {
  padding-left: 7%;
  padding-right: 7%;
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
  font-size: 22px;
  margin-top: 60px;
  color: black;
  font-weight: 600;
}

.home .bigtitle {
  /* font-family: "Asap SemiBold",tahoma,arial,"Hiragino Sans GB",\5b8b\4f53, sans-serif; */
  font-size: 60px;
  padding-top: 60px;/*空白在这*/
  color: black;
  font-weight: 600;
}

.home .sub-title {
  display:block;
  /* font-family: 'Courier New',serif; */
  font-weight:bold;
  margin-bottom:0 !important;
  color:black;
}

.home .sub-number {
  display:block;
  /* font-family:'Courier New',serif; */
  margin-top:10px;
  color:black;
}

.home .logos {
  margin-top: 80px;
  padding-top: 0px;
  padding-left: 5%;
  padding-right: 5%;
  /* background-color: rgba(0, 0, 0, 0.2); */
}

.home .recommend {
  min-width: 900px;
  margin: 50px 12%;
  margin-top: 80px;
  padding: 20px 40px 40px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .08), 0 0 6px rgba(0, 0, 0, .04)
}

.bg-purple {
  background: white;
  /* #efeefd */
  padding:20px;
  border-radius: 14px ;
  border: gainsboro solid 1px;
}

.home .grid-content {
  border-radius: 4px;
  min-height: 36px;
  width: 25%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.grid-content:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1); /* 鼠标悬停时加上阴影效果 */
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

.articles .title {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.4;
    cursor: pointer;
    color: #262625;
    /* font-family: Tahoma,fantasy; */
}

.abstract {
    /* cursor: pointer; */
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

