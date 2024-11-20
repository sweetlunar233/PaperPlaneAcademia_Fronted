<template>
  <div class="profile-page">
    <!-- 顶部区域 -->
    <div class="header">
      <div class="profile-photo">
        <img :src="userInfo.photoUrl || 'default-avatar.jpg'" alt="用户头像" />
      </div>
      <div class="user-info">
        <h1 class="username">{{ userInfo.name }}</h1>
        <p><strong>简介：</strong>{{ userInfo.description }}</p>
        <p><strong>研究领域：</strong>{{ userInfo.researchFields.join(', ') }}</p>
        <p><strong>发表论文数：</strong>{{ userInfo.papersCount }}</p>
        <p><strong>电子邮件：</strong>{{ userInfo.email }}</p>
        <p><strong>电话：</strong>{{ userInfo.phoneNumber }}</p>
      </div>
      <div class="button-container">
        <button @click="sendMessage" class="message-button">发私信</button>
        <button @click="toggleFollow" class="follow-button">
          {{ isFollowed ? '✔ 已关注' : '+ 关注' }}
        </button>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="main-content">
      <div class="sidebar">
        <ul>
          <li @click="setTab('我的文章')" :class="{ active: activeTab === '我的文章' }">我的文章</li>
          <li @click="setTab('我的收藏')" :class="{ active: activeTab === '我的收藏' }">收藏</li>
          <li @click="setTab('我的评论')" :class="{ active: activeTab === '我的评论' }">评论</li>
        </ul>
      </div>
      <div class = "left">
      </div>
      <div class="content">
        <div v-if="activeTab === '我的文章'">
          <h2>我的文章</h2>
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
            <p>您还没有发表任何文章。</p>
          </div>
        </div>
        <div v-if="activeTab === '我的收藏'">
          <h2>我的收藏</h2>
          <div v-if="favoriteArticles.length > 0">
            <div v-for="(article, index) in favoriteArticles" :key="index" class="article-item">
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
            <p>您还没有收藏任何文章。</p>
          </div>
        </div>
        <div v-if="activeTab === '我的评论'">
          <h2 class="tab-title">我的评论</h2>
          <div v-if="comments.length > 0" class="comments-list">
            <div v-for="(comment, index) in comments" :key="index" class="comment-item">
              <div class="comment-card">
                <div class="comment-header">
                  <h3>{{ comment.commenter }}</h3>
                  <p class="paper-id">所属论文：<span>{{ comment.paperId }}</span></p>
                  <p class="comment-time">{{ comment.time }}</p>
                </div>
                <div class="comment-content">
                  <p>{{ comment.content }}</p>
                </div>
                <div class="comment-footer">
                  <p><strong>点赞数：</strong>{{ comment.likeCount }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p>您还没有发布任何评论。</p>
          </div>
        </div>
      </div>
      <div class="follow-card">
        <div class="follow-card-content">
          <div class="follow-item">
            <span class="follow-label">关注人数：</span>
            <span class="follow-number">{{ userInfo.followingCount }}</span>
          </div>
          <div class="follow-item">
            <span class="follow-label">粉丝人数：</span>
            <span class="follow-number">{{ userInfo.followerCount }}</span>
          </div>
        </div>
      </div>
      <div class="user-info-card">
        <div class="user-info-card-content">
          <div class="user-info-item">
            <span class="user-info-label">加入时间：</span>
            <span class="user-info-value">{{ userInfo.registerTime }}</span>
          </div>
          <div class="user-info-item">
            <span class="user-info-label">账户状态：</span>
            <span class="user-info-value">{{ userInfo.status }}</span>
          </div>
          <div class="user-info-item">
            <span class="user-info-label">机构：</span>
            <span class="user-info-value">{{ userInfo.institution }}</span>
          </div>
          <div class="user-info-item">
            <span class="user-info-label">邮箱：</span>
            <span class="user-info-value">{{ userInfo.email }}</span>
          </div>
        </div>
      </div>
      <div class = "right">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: "我的文章", // 默认激活动态选项卡
      isFollowed: false, // 是否关注用户
      userInfo: {
        name: '张伟',
        photoUrl: 'https://pic3.zhimg.com/v2-85e74dd29d9bed4c991774f2c3822152_b.jpg', // 用户头像链接
        description: ' Hello World ',
        researchFields: ['人工智能', '机器学习', '自然语言处理'],
        registerTime: '2019-02-01',
        institution: "BUyAA",
        status: "正常",
        papersCount: 5,
        email: '111@111.com',
        phoneNumber: '123-456-7890',
        followingCount: 14, // 假设的关注人数
        followerCount: 20000, // 假设的粉丝人数
      },
      favoriteArticles: [
        {
          title: 'Vue.js 实战指南',
          authors: '张三',
          institutions: '技术学院',
          journal: '前端开发期刊',
          publishTime: '2024-10-10',
          doi: 'https://doi.org/10.12345/vue-guide',
          citationCount: 120,
          favoriteCount: 150,
        },
        {
          title: 'JavaScript 深入理解',
          authors: '李四',
          institutions: '计算机学院',
          journal: '编程语言期刊',
          publishTime: '2024-09-15',
          doi: 'https://doi.org/10.67890/js-deep-dive',
          citationCount: 200,
          favoriteCount: 180,
        },
        // 更多收藏的文章
      ],
      comments: [
        {
          commenter: '张伟',
          paperId: '论文123',
          time: '2024-11-20 10:30',
          content: '这篇论文非常有意义，提供了很多新的视角。',
          likeCount: 10
        },
        {
          commenter: '张伟',
          paperId: '论文456',
          time: '2024-11-21 12:45',
          content: '这篇论文的研究方法很好，值得借鉴。',
          likeCount: 5
        }
      ],
      articles: [
        {
          title: "人工智能在医疗诊断中的应用与挑战",
          authors: "张伟, 李明, 王芳",
          institutions: "清华大学, 北京协和医院",
          journal: "中国医学工程杂志",
          publishTime: "2022-03-15",
          doi: "https://doi.org/10.12345/ai.med.2022.001",
          citationCount: 85,
          favoriteCount: 50,
        },
        {
          title: "区块链技术对金融安全的影响",
          authors: "张伟, 刘洋, 陈强",
          institutions: "北京大学, 中国人民银行",
          journal: "国际区块链研究",
          publishTime: "2021-11-20",
          doi: "https://doi.org/10.98765/blockchain.fin.2021.005",
          citationCount: 120,
          favoriteCount: 80,
        },
        {
          title: "机器学习在自然语言处理中的应用",
          authors: "张伟, 王小明, 李小红",
          institutions: "上海交通大学",
          journal: "自然语言计算",
          publishTime: "2023-05-10",
          doi: "https://doi.org/10.54321/ml.nlp.2023.002",
          citationCount: 45,
          favoriteCount: 25,
        },
        {
          title: "新能源材料的最新研究进展",
          authors: "张伟, 孙丽, 赵伟",
          institutions: "中科院物理所, 华中科技大学",
          journal: "能源与环境材料",
          publishTime: "2020-07-18",
          doi: "https://doi.org/10.67890/energy.mat.2020.003",
          citationCount: 300,
          favoriteCount: 150,
        },
        {
          title: "自动驾驶汽车的伦理与技术挑战",
          authors: "张伟, 张强, 王刚",
          institutions: "浙江大学, 中国科技大学",
          journal: "人工智能与社会",
          publishTime: "2022-01-12",
          doi: "https://doi.org/10.13579/ai.auto.2022.006",
          citationCount: 200,
          favoriteCount: 110,
        },
        {
          title: "边缘计算在智能物联网中的应用",
          authors: "张伟, 陈敏, 黄涛",
          institutions: "武汉大学",
          journal: "物联网技术",
          publishTime: "2023-02-05",
          doi: "https://doi.org/10.11223/edge.iot.2023.004",
          citationCount: 60,
          favoriteCount: 35,
        },
        {
          title: "深度学习与生物信息学的结合研究",
          authors: "张伟, 李佳, 王珊珊",
          institutions: "复旦大学",
          journal: "生物信息学前沿",
          publishTime: "2021-09-15",
          doi: "https://doi.org/10.14234/dl.bio.2021.007",
          citationCount: 75,
          favoriteCount: 40,
        },
        {
          title: "量子计算的未来发展趋势",
          authors: "张伟, 赵明, 张莉",
          institutions: "南京大学",
          journal: "量子物理与计算",
          publishTime: "2020-06-10",
          doi: "https://doi.org/10.98734/quantum.future.2020.009",
          citationCount: 90,
          favoriteCount: 60,
        },
      ],

    };
  },
  methods: {
    setTab(tab) {
      this.activeTab = tab; // 切换选项卡
    },
    toggleFollow() {
      this.isFollowed = !this.isFollowed;
    },
  },
};
</script>

<style>
/* 页面整体样式 */
html, body {
  height: 100%;
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f0f7ff; /* 浅蓝色背景 */
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
  background-color: #e6f7ff; /* 浅蓝色背景 */
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

.message-button,
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

.message-button:hover,
.follow-button:hover {
  background: linear-gradient(90deg, #2575fc 0%, #6a11cb 100%);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.message-button:active,
.follow-button:active {
  transform: scale(0.98);
}

.username {
  font-size: 24px;
  margin: 0;
  color: #003366; /* 深蓝色字体 */
}

.user-info p {
  margin: 5px 0;
  color: #666; /* 灰色文字 */
}

.user-info strong {
  color: #003366; /* 深蓝色 */
}

/* 主体内容样式 */
.main-content {
  display: flex;
  flex: 1; /* 填充剩余空间 */
  overflow: hidden;
}

.sidebar {
  position: fixed;
  top: 300px; /* 定位在页面上方 */
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
  height: 100%; /* 占满父容器的高度 */
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
  top: 400px; /* 定位在页面上方 */
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
  top: 300px; /* 定位在页面上方 */
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
</style>
