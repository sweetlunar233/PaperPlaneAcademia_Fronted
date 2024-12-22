<!-- 首页 -->
<script setup>
import { ref, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentInstance } from 'vue';
const router = useRouter();

import { GetTopArticles, GetRecommendedArticles, GetStatistics, GetOrganizations, GetFields } from '../../api/home.js'

const topOrRec = ref("hot-gate-articles");
const top_articles = ref([
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

const organizations = ref([
  {
    organizationName: "ABC"
  },
  {
    organizationName: "ABC"
  }
])

const fields = ref([
  {
    fieldName: "ABC",
    topArticleName: "Article1",
    topArticleId: "1",
  },
  {
    fieldName: "ABC",
    topArticleName: "Article2",
    topArticleId: "1",
  }
])

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
// const userId = this.$root.OnlineUser;
console.log(userId.value);

const quotes = [
  "Success isn't something that happens just because of a few isolated efforts or random bursts of hard work. It’s the result of daily commitment, discipline, and persistence. It comes from choosing to focus on your goals consistently, even when things are tough or progress seems slow. It’s about showing up day after day, putting in the work even when no one is watching. Over time, these small, consistent efforts will build upon each other, and eventually, the fruits of your hard work will emerge, even if it takes longer than you expected.",
  "The path to success and the road to failure may appear remarkably similar at times. Both roads are filled with obstacles, setbacks, and moments when you question your ability to continue. The key difference, however, is persistence. Those who succeed are often those who refuse to give up, who keep pushing forward in the face of adversity. They don’t let fear or failure define them. Instead, they use each challenge as an opportunity to learn, grow, and become more resilient.",
  "Change can be one of the most daunting experiences in life, but it is also one of the most necessary. At the beginning, change feels overwhelming and challenging, as if you’re stepping into the unknown with no clear direction. In the middle, it may become messy and chaotic, as the old systems or habits begin to break down. But in the end, change often brings beauty, growth, and new opportunities that you could never have imagined at the start. Life is full of surprises.",
  "Success is not simply about achieving a goal or reaching a specific destination. It’s about the journey that gets you there—the lessons learned along the way, the obstacles overcome, and the people you meet who inspire you to grow. True success lies in how much you’ve grown as a person through the process, how much wisdom you’ve gained, and how many others you’ve helped or inspired along your path. The pursuit of success is a continuous evolution, not a static point.",
  "No matter how old you are or how far along you think you are in life, it’s never too late to set a new goal or pursue a new dream. Life is a journey with endless opportunities for reinvention and growth. Every new chapter offers a chance to discover something different about yourself, to pursue passions you’ve never had the time or courage to explore before. Don’t let age, past mistakes, or disappointments hold you back from the possibilities that lie ahead.Just do what you want.",
  "The power of positive thinking isn’t just about having a good attitude—it’s about truly believing in the possibility of good things happening in your life. Your thoughts are incredibly powerful; they shape your perceptions, your actions, and ultimately your reality. When you focus on positive thoughts and energy, you open yourself up to more opportunities, more success, and more joy. The people you surround yourself with and the energy you invite into your life can either lift you up or bring you down.",
  "The only real limit to our potential is the doubts and fears we carry with us today. If we allow our uncertainties to dictate our actions, we will never reach the heights we’re capable of. Fear of failure, fear of the unknown, and self-doubt are natural, but they should not control your path. Every step forward, even if it’s small or seems insignificant, is still progress. With each step you take, you move closer to your dreams.Believe in yourself and eventually you'll reach your goal.",
  "The greatest adventure you can ever embark on is living a life that truly fulfills your dreams and aspirations. It’s not about waiting for the perfect moment to start—it’s about creating the moments that will lead you to where you want to be. Life is far too short to live in fear or to hide from the things that excite and inspire you. The more you embrace who you are, pursue what excites you, and take risks toward what you truly want, the more vibrant and meaningful your life will become."
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

const gotoError = (userId) => {
    router.push({
    path: '/error',
  });
}

const initHome = (userId) => {
    top_articles.value = [];
    recommended_articles.value = [];
    // organizations.value = [];
    // fields.value = [];

    statistic.value = { // 重置 statistic
      authorCount: 0,
      organizationsCount: 0,
      fieldsCount: 0,
      journalCount: 0,
      paperCount: 0
    }; 
    
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
        statistic.value = {
          authorCount: result.authorCount,
          organizationsCount: result.organizationsCount,
          fieldsCount: result.fieldsCount,
          journalCount: result.journalCount,
          paperCount: result.paperCount
        }
    });

    var promise = GetOrganizations();
    promise.then((result)=>{
        result.organizations.forEach(element => {
            organizations.value.push(element);
        });
    });

    var promise = GetFields();
    promise.then((result)=>{
        result.fields.forEach(element => {
            fields.value.push(element);
        });
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
        <div class="uphalf">
          <div class="title-and-input">
              <div class="bigtitle">Paper Wing Academia</div>
              <div class="loader" @click="gotoError"></div>
              <div class="input-box">
                  <!-- <p @click="updateQuote">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ randomQuote }}</p> -->
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

                                <!-- <div style="text-align: left; margin-top: 10px;">
                                    <span v-for="(user, index2) in article.users" :key="user" class="author-name">
                                        <span style="cursor:auto; color: black;">去作者空间:&nbsp;&nbsp;</span>
                                        <span @click="gotoScholar(user.userId)"><u>{{ user.userName }}</u></span>
                                        <span v-if="index2 < article.authors.length-1">&nbsp;&nbsp;</span>
                                    </span>
                                </div> -->

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

                                <!-- <div style="text-align: left; margin-top: 10px;">
                                    <span v-for="(user, index2) in article.users" :key="user" class="author-name">
                                        <span style="cursor:auto; color: black;">去作者空间:&nbsp;&nbsp;</span>
                                        <span @click="gotoScholar(user.userId)"><u>{{ user.userName }}</u></span>
                                        <span v-if="index2 < article.authors.length-1">&nbsp;&nbsp;</span>
                                    </span>
                                </div> -->

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
                <el-tab-pane label="科研机构" name="organization" style="text-align: left">
                  <div class="articles">
                        <div class="articles-body">
                            <div v-for="(organization, index) in organizations" v-bind:key="index">
                                <div style="text-align: left">
                                    <div>
                                        <span class="title">{{ organization.organizationName }}</span>
                                    </div>
                                </div>

                                <el-divider v-if="index < organizations.length - 1"></el-divider>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="科研领域" name="field" style="text-align: left">
                  <div class="articles">
                        <div class="articles-body">
                            <div v-for="(field, index) in fields" v-bind:key="index">
                                <div style="text-align: left">
                                    <div>
                                        <span class="title">{{ field.fieldName }}</span>
                                    </div>
                                    <div style="margin-top: 10px;">
                                      <span>TOP引用量文章：</span>
                                      <span class="author-name" @click="gotoPaper(field.topArticleId)"><u>{{ field.topArticleName }}</u></span>
                                    </div>
                                </div>

                                <el-divider v-if="index < fields.length - 1"></el-divider>
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

.loader {
  width: 44.8px;
  height: 44.8px;
  color: #ffffff;
  position: relative;
  background: radial-gradient(11.2px,currentColor 94%,#0000);

  display: inline-block;
  margin-left: 20px;
  /* cursor: pointer; */
}

.loader:before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(10.08px at bottom right,#0000 94%,currentColor) top    left,
          radial-gradient(10.08px at bottom left ,#0000 94%,currentColor) top    right,
          radial-gradient(10.08px at top    right,#0000 94%,currentColor) bottom left,
          radial-gradient(10.08px at top    left ,#0000 94%,currentColor) bottom right;
  background-size: 22.4px 22.4px;
  background-repeat: no-repeat;
  animation: loader 1.5s infinite cubic-bezier(0.3,1,0,1);
}

@keyframes loader {
  33% {
    inset: -11.2px;
    transform: rotate(0deg);
  }

  66% {
    inset: -11.2px;
    transform: rotate(90deg);
  }

  100% {
    inset: 0;
    transform: rotate(90deg);
  }
}




.home {
  background-color: #f0f7ff;
  min-width: 100%;
  height: 100%;
}

.home .uphalf {
  padding-bottom: 60px;
  background: url("../../assets/images/bg2.png") no-repeat;
  background-size: cover;
}

.home .title-and-input {
  padding-left: 7%;
  padding-right: 7%;
  text-align: left;
}

.home .input-box {
  font-size: 22px;
  margin-top: 60px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.home .bigtitle {
  /* font-family: "Asap SemiBold",tahoma,arial,"Hiragino Sans GB",\5b8b\4f53, sans-serif; */
  font-size: 60px;
  padding-top: 100px;/*空白在这*/
  color: white;
  font-weight: 600;

  display: inline-block;
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
  margin-top: 160px;
  padding-top: 0px;
  padding-left: 5%;
  padding-right: 5%;
  /* background-color: rgba(0, 0, 0, 0.2); */
}

.home .recommend {
  min-width: 900px;
  margin: 50px 12%;
  margin-top: 20px;
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