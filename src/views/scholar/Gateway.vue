<template>
  <div class="profile-page">
    <!-- 顶部区域 -->
    <div class="header">
      <div class="profile-photo">
        <img :src="getRandomAvatar()" alt="用户头像" />
      </div>
      <div class="user-info">
        <h1 class="username">{{ userInfo?.name }}</h1>
          <p><strong>OrcId：</strong>{{ userInfo?.orcid }}
          </p>
          <p><strong>可能出现的其他名称：</strong>{{ userInfo?.alternative_names[0] }}
          </p>
        <p><strong>学术作品数量：</strong>{{ userInfo?.works_count }}</p>
        <p><strong>被引用次数：</strong>{{ userInfo?.cited_count }}</p>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="main-content">
      <div class="sidebar">
        <ul>
          <li @click="setTab('TA的专家网络')" :class="{ active: activeTab === 'TA的专家网络' }">TA的专家网络</li>
          <li @click="setTab('TA的贡献')" :class="{ active: activeTab === 'TA的贡献' }">TA的贡献</li>
          <li @click="setTab('TA的文章')" :class="{ active: activeTab === 'TA的文章' }">TA的文章</li>
        </ul>
      </div>
      <div class = "left">
      </div>
      <div class="content">
        <div v-if="activeTab === 'TA的专家网络'">
          <div class="expert-network">


            <!-- 中心专家头像 -->
            <div class="center-avatar">
              <img :src="centerExpert.avatar" alt="中心专家" />
              <p>{{ centerExpert.name }}</p>
            </div>

            <!-- 外围专家头像 -->
            <div>
              <div
                v-for="(expert, index) in experts"
                :key="'expert-' + index"
                class="expert-avatar"
                :style="getAvatarStyle(index)"
                @click="goToScholar(expert.id)"
              >
                <img :src="getRandomAvatar()" :alt="expert.name" />
                <p class="expert-name">{{ expert.name }}</p>
              </div>
            </div>
            <!-- SVG 连线 -->
            <svg class="connection-lines" xmlns="http://www.w3.org/2000/svg" :width="canvasSize" :height="canvasSize">
              <line
                  v-for="(expert, index) in experts"
                  :key="'line-' + index"
                  :x1="centerX"
                  :y1="centerY"
                  :x2="centerX + Math.cos((index / experts.length) * 2 * Math.PI) * radius"
                  :y2="centerY + Math.sin((index / experts.length) * 2 * Math.PI) * radius"
                  stroke="#ccc"
                  stroke-width="2"
                  stroke-dasharray="5,5"
              />
            </svg>
          </div>
        </div>
        <div v-if="activeTab === 'TA的贡献'">
          <h2 class="tab-title">TA的贡献</h2>
          <div v-for="(contribution, index) in contributions" :key="index" class="contribution-item">
    
    <!-- 单个贡献项的卡片 -->
    <el-card class="contribution-card">
      <h2 class="sub-title">领域</h2>
      <div class="fields">
        <!-- 当前领域 -->
        <div class="field current-field">
          <span class="field-name1">{{ contribution.display_name }}</span>
        </div>
        <div class="field" v-if="contribution.subfield">
          <span class="field-name2">to</span>
        </div>

        <!-- 上一个领域 -->
        <div class="field subfield" v-if="contribution.subfield">
          <span class="field-name2">{{ contribution.subfield.display_name }}</span>
        </div>
        
        <div class="field" v-if="contribution.field">
          <span class="field-name2">to</span>
        </div>

        <!-- 更广的领域 -->
        <div class="field broader-field" v-if="contribution.field">
          <span class="field-name3">{{ contribution.field.display_name }}</span>
        </div>
      </div>

      <!-- 下方的domain和value -->
      <div class="bottom-info">
        <!-- Domain部分使用card包裹 -->
        <el-card class="domain-card" style="display: inline-block; width: auto; max-width: 100%;">
          <div class="domain">
            <span>{{ contribution.domain }}</span>
          </div>
        </el-card>

        <!-- Value部分为环形进度条 -->
        <div class="value">
          <el-progress
            :percentage="contribution.value"
            type="circle"
            :stroke-width="10"
            
          />
        </div>
      </div>
    </el-card>
    
  </div>
        </div>
        <div v-if="activeTab === 'TA的文章'">
          <h2>TA的文章</h2>
          <div v-if="articles.length > 0">
            <div v-for="(article, index) in articles" :key="index" class="article-item">
              <div class="article-card">
                <div class="article-header">
                  <h3>{{ article.title }}</h3>
                </div>
                <div class="article-content">
                  <div class="article-info">
                    <p><strong>作者：</strong>{{ article.authors }}</p>
                    <p><strong>机构：</strong>{{ article.institutions }}</p>
                    <p><strong>发表期刊：</strong>{{ article.journal }}</p>
                  </div>
                  <div class="article-meta">
                    <p><strong>发表时间：</strong>{{ article.publishTime }}</p>
                    <p><strong>DOI：</strong><a :href="article.doi" target="_blank">{{ article.doi }}</a></p>
                    <p><strong>引用次数：</strong>{{ article.citationCount }}</p>
                    <p><strong>收藏数：</strong>{{ article.favoriteCount }}</p>
                  </div>
                </div>
                <div class="article-footer">
                  <button @click="viewDetails(article)" class="view-button">查看详情</button>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p>TA还没有发表任何文章。</p>
          </div>
        </div>
      </div>
      <div class="user-info-card">
        <div class="user-info-card-content">
          <div class="user-info-item">
            <span class="user-info-label">机构：</span>
            <span class="user-info-value">{{ userInfo?.institution }}</span>
            <span class="user-info-label">机构国籍：</span>
            <span class="user-info-value">{{ userInfo?.institution_country }}</span>
          </div>
        </div>
      </div>
      <div class = "right">

      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router/index.js";
import {GetScholarData} from "@/api/user.js";

export default {
  data() {
    return {
      contributions:[
      
    ],
      centerX: 300,
      centerY: 275,
      radius: 200,
      canvasSize: 600,
      centerExpert: {
        id: 0,
        name: "专家中心",
        avatar: 'https://th.bing.com/th/id/OIP.Wm28iTeZUzxP_FOrlfqZWAHaHa?rs=1&pid=ImgDetMain',
      },
      experts: [
        {
            "id": "13",
            "name": "熊大"
        },
        {
            "id": "14",
            "name": "熊二"
        },
        {
            "id": "15",
            "name": "张三"
        },
        {
            "id": "16",
            "name": "李四"
        },
        {
            "id": "17",
            "name": "王五"
        },
        {
            "id": "1",
            "name": "赵六"
        }
    ],
      activeTab: "TA的贡献", // 默认激活动态选项卡
      availableAvatars: [ // 可供选择的头像
        'https://th.bing.com/th/id/OIP.Wm28iTeZUzxP_FOrlfqZWAHaHa?rs=1&pid=ImgDetMain',
        'https://th.bing.com/th/id/OIP.jHUH4s7TQ48X_B-1iozuJgHaHa?rs=1&pid=ImgDetMain',
        'https://img.zcool.cn/community/016a2e5f110b9fa801215aa097202c.png?x-oss-process=image/auto-orient,1/resize,m_lfit,w_1280,limit_1/sharpen,100',
        'https://img.zcool.cn/community/0143395f110b9fa801215aa060a140.png?x-oss-process=image/auto-orient,1/resize,m_lfit,w_1280,limit_1/sharpen,100',
        'https://th.bing.com/th/id/R.7376aae88d772c821c6925b91e2ca1aa?rik=8n%2bJq8ypQTiJHA&pid=ImgRaw&r=0',
        'https://img.zcool.cn/community/01972c5f110b9fa801206621eba569.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp',
      ],
      userInfo: {
        name: 'a',
        institution: 'a',
        orcid: '1',
        alternative_names: ['a'],
        works_count: 0,
        cited_count: 0,
        institution_country: 'CN',
      },
      articles: [],
    };
  },
  methods: {
    goToScholar(expertId) {
      // 使用 Vue Router 跳转到学者详情页
      this.$router.push({ path: '/gateway', query: { userId: expertId } });

      // 或者如果是通过原生方式跳转
      // window.location.href = `/scholar/${expertId}`;
    },
    getRandomAvatar() {
    const randomIndex = Math.floor(Math.random() * this.availableAvatars.length);
    return this.availableAvatars[randomIndex];
  },
    getAvatarStyle(index) {
      const angle = (index / this.experts.length) * 2 * Math.PI;
      const x = this.centerX + Math.cos(angle) * this.radius;
      const y = this.centerY + Math.sin(angle) * this.radius - 5;
      return {
        position: "absolute",
        top: `${y}px`,
        left: `${x}px`,
        width: "60px",
        height: "60px",
        textAlign: "center",
        transform: "translate(-50%, -50%)",
      };
    },
    // 设置选项卡
    setTab(tab) {
      this.activeTab = tab;
    },

    // 集中处理所有数据获取请求
    fetchScholarData() {
      const currentUserId = this.$cookies.get('userId');
      const targetUserId = this.$route.query.userId;
      var promise = GetScholarData(currentUserId, targetUserId);
      promise.then(response => {
          // 假设返回的数据结构包含 userInfo, favoriteArticles, comments, articles
          const { userInfo, articles, experts, contributions} = response;
          // 更新数据
          console.log(response)
          this.userInfo = userInfo;
          this.centerExpert.name = userInfo.name;
          
          this.centerExpert.id = userInfo.orcid;
          this.articles = articles;
          this.experts = experts;
          this.contributions=contributions;
          console.log("data:",contributions);
        })
        .catch(error => {
          console.error('获取数据失败', error);
        });

    },
    viewDetails(id){
      router.push({
        path: '/article',
        query:{
          paperId: id
        }
      })
    }
  },
  mounted() {
    // 页面加载时获取所有数据
    this.fetchScholarData();
  },
};
</script>



<style scoped>
/* 页面整体样式 */
html, body {
  height: 100%;
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f0f7ff; /* 浅蓝色背景 */
}

.expert-network {
  position: relative;
  width: 600px;
  height: 600px;
  margin: 0 auto;
  background: linear-gradient(145deg, #f0f0f0, #e6e6e6); /* 背景渐变 */
  border-radius: 50%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

/* 连线样式 */
.connection-lines {
  position: absolute;
  z-index: 0;
}

/* 中心专家样式 */
.center-avatar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
}

.center-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #007bff;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.5);
}

.center-avatar p {
  margin-top: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* 外围专家样式 */
.expert-avatar {
  position: absolute;
  text-align: center;
  z-index: 1;
}

.expert-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #ddd;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.expert-avatar img:hover {
  transform: scale(1.1);
  border-color: #007bff;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.5);
}

.expert-name {
  margin-top: 5px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.profile-page {
  display: flex;
  flex-direction: column;
  height: 100%; /* 占满整个屏幕 */
}

.header {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background-image: url('https://img.zcool.cn/community/015b315c73bb4ba801203d22796b80.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-bottom: 1px solid #b3cde0; /* 灰色边框 */
}

.profile-photo img {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  margin-right: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
}
.left{
  width: 20%;
}
.right{
  width: 20%;
}
.button-container {
  display: flex;
  margin-top: 20px; /* 使按钮与其它信息之间有间距 */
  align-self: flex-end; /* 将按钮放到右侧 */
  margin-left: 45%;
  gap: 30px;
}

.follow-button {
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  color: #ffffff;
  font-size: 18px; /* 增加字体大小 */
  font-weight: bold;
  padding: 15px 30px; /* 增大按钮的内边距 */
  border: none;
  border-radius: 30px; /* 增加圆角 */
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.follow-button:hover {
  background: linear-gradient(90deg, #2575fc 0%, #6a11cb 100%);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.follow-button:active {
  transform: scale(0.98);
}

.username {
  font-size: 24px;
  margin: 0;
  color: #ffffff; /* 白色字体 */
}

.user-info p {
  margin: 5px 0;
  color: #ffffff; /* 白色文字 */
}

.user-info strong {
  color: #ffffff; /* 白色 */
}

/* 主体内容样式 */
.main-content {
  display: flex;
  flex: 1; /* 填充剩余空间 */
  overflow: hidden;
}

.sidebar {
  position: fixed;
  top: 350px; /* 定位在页面上方 */
  width: 200px;
  background-color: #ffffff; /* 白色背景 */
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-right: 30px;
  border-radius: 10px;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  padding: 15px;
  cursor: pointer;
  font-size: 18px;
  color: #333;
  border-radius: 5px;
  margin-bottom: 10px;
}

.sidebar li:hover {
  background-color: #e0f7fa; /* 淡蓝色背景 */
}

.sidebar .active {
  background-color: #3d6797; /* 高亮显示选项 */
  color: white;
}

/* 右侧内容样式 */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
  background-color: #fff; /* 白色背景 */
  border-left: 1px solid #ddd;
  height: 480px; /* 占满父容器的高度 */
  min-height: 0; /* 防止内容溢出 */
}

.article-item {
  margin-bottom: 20px;
}

.article-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 卡片阴影 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 600px;
  margin: 10px auto;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.article-header {
  text-align: center;
  margin-bottom: 10px;
}

.article-header h3 {
  font-size: 22px;
  color: #333;
}

.article-content {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 两列布局 */
  gap: 20px;
  margin-bottom: 20px;
}

.article-info p,
.article-meta p {
  margin: 5px 0;
  color: #555;
}

.article-info {
  border-right: 1px solid #ddd; /* 添加列分割线 */
  padding-right: 10px;
}

.article-meta {
  padding-left: 10px;
}

.article-meta a {
  color: #007bff;
  text-decoration: none;
}

.article-meta a:hover {
  text-decoration: underline;
}

.article-footer {
  text-align: center;
}

.view-button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-button:hover {
  background-color: #0056b3;
}

/* 用户信息卡片样式 */
.user-info-card {
  position: fixed;
  top: 450px; /* 定位在页面上方 */
  right: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 200px; /* 固定卡片宽度 */
}

.user-info-card-content {
  display: flex;
  flex-direction: column;
}

.user-info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
}

.user-info-label {
  font-weight: 500;
  color: #555;
}

.user-info-value {
  color: #007bff;
  font-weight: bold;
}

.follow-card {
  position: fixed;
  top: 350px; /* 定位在页面上方 */
  right: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 200px; /* 固定卡片宽度 */
}

.follow-card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.follow-item {
  display: flex;
  justify-content: space-between;
}

.follow-label {
  font-size: 18px;
  color: #555;
}

.follow-number {
  font-size: 20px;
  color: #0066cc;
  font-weight: bold;
}

.tab-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}
.sub-title {
  font-size: 16px;
  font-weight: bold;
  color: grey;
  margin-left:10px;
  margin-top: 10px;
}

/* 评论列表容器样式 */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 每个评论的卡片样式 */
.comment-item {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 20px;
  transition: transform 0.3s;
}

.comment-item:hover {
  transform: translateY(-5px); /* 鼠标悬停时的浮动效果 */
}

/* 评论卡片的头部样式 */
.comment-header {
  margin-bottom: 15px;
}

.comment-header h3 {
  font-size: 18px;
  color: #007bff; /* 评论者名字使用蓝色 */
  margin: 0;
}

.comment-header .paper-id {
  font-size: 14px;
  color: #555;
}

.comment-header .comment-time {
  font-size: 12px;
  color: #999;
}

/* 评论内容样式 */
.comment-content {
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
}

/* 评论底部的点赞数 */
.comment-footer {
  font-size: 14px;
  color: #888;
}

/* 如果没有评论，显示的文字 */
.comment-footer p {
  font-weight: bold;
}

/*贡献样式*/
.tab-title {
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
}

.contribution-item {
  margin-bottom: 20px;
}

.contribution-card {
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.fields {
  
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field {
  
  text-align: center;
  flex: 1;
}

.field-name1 {
  font-size: 24px;
  font-weight: bold;
}
.field-name2 {
  font-size: 28px;
  font-weight: bold;
}
.field-name3 {
  font-size: 32px;
  font-weight: bold;
}

.arrow {
  font-size: 24px;
  font-weight: bold;
  margin-left: 10%;
}

.bottom-info {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  flex-wrap: wrap;
}

.domain {
  display: flex; 
  justify-content: center; 
  align-items: center;
  font-size: 32px;
  font-weight: bolder;
  color: #0056b3;
}
.domain-card {
  margin-top: 40px;
  height: 30%;
  display: inline-block; 
  width: auto; 
  max-width: 50%;
  white-space: nowrap; 
  padding: 10px; 

}

.value {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.value-badge {
  font-size: 20px;
  border-radius: 50%;
  padding: 5px 10px;
  background-color: #1890ff;
  color: white;
}


</style>
