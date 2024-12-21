<template>
  <div class="profile-page">
    <!-- 顶部区域 -->
    <div class="header">
      <div class="profile-photo">
        <img :src="userInfo.photoUrl || 'https://img.ixintu.com/download/jpg/20200910/f9256155491e54bf5e99bf29eece0156_512_512.jpg!ys'" @click="showAvatarDialog = true" class="profile-photo-img"  />
      </div>
      <el-dialog
          title="选择头像"
          v-model="showAvatarDialog"
          width="60%"
          @close="resetSelectedAvatar"
      >
        <div class="avatar-carousel">
          <div class="avatar-wrapper">
            <img
                v-for="(avatar, index) in availableAvatars"
                :key="index"
                :src="avatar"
                alt="头像选项"
                class="avatar-option"
                :class="{ selected: selectedAvatar === avatar }"
                @click="selectAvatar(avatar)"
            />
          </div>
        </div>
        <template #footer>
          <el-button @click="showAvatarDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmAvatar">确定</el-button>
        </template>
      </el-dialog>
      <div class="user-info">
        <h1 class="username">{{ userInfo.name }}</h1>
        <p><strong>简介：</strong>{{ userInfo.description }}
          <button class="edit-btn" @click="editDescription">修改</button>
        </p>
        <p><strong>研究领域：</strong>{{ userInfo.researchFields }}
          <button class="edit-btn" @click="editResearchFields">修改</button>
        </p>
        <p><strong>发表论文数：</strong>{{ userInfo.papersCount }}</p>
        <p><strong>电子邮件：</strong>{{ userInfo.email }}</p>
        <p><strong>电话：</strong>{{ userInfo.phoneNumber }}</p>
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
                  <button @click="viewDetails(article.id)" class="view-button">查看详情</button>
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
import axios from 'axios';
import router from "@/router/index.js";
import {GetMyUserData} from "@/api/user.js";

export default {
  data() {
    return {
      activeTab: "我的文章", // 默认激活动态选项卡
      showAvatarDialog: false,
      selectedAvatar: null, // 当前选择的头像
      availableAvatars: [ // 可供选择的头像
        'https://th.bing.com/th/id/OIP.Wm28iTeZUzxP_FOrlfqZWAHaHa?rs=1&pid=ImgDetMain',
        'https://th.bing.com/th/id/OIP.jHUH4s7TQ48X_B-1iozuJgHaHa?rs=1&pid=ImgDetMain',
        'https://img.zcool.cn/community/016a2e5f110b9fa801215aa097202c.png?x-oss-process=image/auto-orient,1/resize,m_lfit,w_1280,limit_1/sharpen,100',
        'https://img.zcool.cn/community/0143395f110b9fa801215aa060a140.png?x-oss-process=image/auto-orient,1/resize,m_lfit,w_1280,limit_1/sharpen,100',
        'https://th.bing.com/th/id/R.7376aae88d772c821c6925b91e2ca1aa?rik=8n%2bJq8ypQTiJHA&pid=ImgRaw&r=0',
        'https://img.zcool.cn/community/01972c5f110b9fa801206621eba569.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp',
      ],
      userInfo: {
        name: '',
        photoUrl: '',
        description: '',
        researchFields: [],
        registerTime: '',
        institution: '',
        status: '',
        papersCount: 0,
        email: '',
        phoneNumber: '',
        followingCount: 0,
        followerCount: 0,
      },
      favoriteArticles: [],
      comments: [],
      articles: [],
    };
  },
  methods: {
    // 设置选项卡
    setTab(tab) {
      this.activeTab = tab;
    },
    selectAvatar(avatar) {
      this.selectedAvatar = avatar;
    },
    // 确定选择
    confirmAvatar() {
      if (this.selectedAvatar) {
        this.userInfo.photoUrl = this.selectedAvatar; // 更新用户头像
      }
      this.showAvatarDialog = false; // 关闭对话框
    },
    // 重置选择
    resetSelectedAvatar() {
      this.selectedAvatar = null; // 重置选择的头像
    },
    // 修改简介
    editDescription() {
      const newDescription = prompt('请输入新的简介', this.userInfo.description);
      if (newDescription !== null) {
        axios.put('/user/updateDescription', { userId: this.$root.OnlineUser, description: newDescription })
            .then(response => {
              this.userInfo.description = newDescription;
              console.log('简介更新成功', response.data);
            })
            .catch(error => {
              console.error('简介更新失败', error);
            });
      }
    },

    // 修改研究领域
    editResearchFields() {
      const newResearchFields = prompt('请输入新的研究领域，以逗号分隔', this.userInfo.researchFields.join(', '));
      if (newResearchFields !== null) {
        const updatedFields = newResearchFields.split(',').map(field => field.trim());
        axios.put('/user/updateResearchFields', { userId: this.$root.OnlineUser, researchFields: updatedFields })
            .then(response => {
              this.userInfo.researchFields = updatedFields;
              console.log('研究领域更新成功', response.data);
            })
            .catch(error => {
              console.error('研究领域更新失败', error);
            });
      }
    },

    // 集中处理所有数据获取请求
    fetchUserData() {
      const userId = this.$root.OnlineUser;
      var promise = GetMyUserData(userId);
      promise.then(response => {
            // 假设返回的数据结构包含 userInfo, favoriteArticles, comments, articles
            const { userInfo, favoriteArticles, comments, articles } = response;
            // 更新数据
            this.userInfo = userInfo;
            this.favoriteArticles = favoriteArticles;
            this.comments = comments;
            this.articles = articles;
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
    this.fetchUserData();
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
  /* background-color: #e6f7ff;  浅蓝色背景 */
  background-image: url('https://img.zcool.cn/community/015b315c73bb4ba801203d22796b80.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-bottom: 1px solid #b3cde0; /* 灰色边框 */
}

.profile-photo {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden; /* 确保超出部分被隐藏 */
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-photo:hover {
  transform: scale(1.05); /* 放大效果 */
}

.profile-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片按比例填充 */
  transition: opacity 0.3s ease;
}

.profile-photo:hover .profile-photo-img {
  opacity: 0.8; /* 悬停时图片透明度变化 */
}

.profile-photo:hover::after {
  content: '点击更换头像';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: rgba(0, 123, 255, 0.7); /* 半透明蓝色背景 */
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  line-height: 48px;
  pointer-events: none; /* 防止覆盖点击 */
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



.username {
  font-size: 24px;
  margin: 0;
  color: #ffffff; /* 深蓝色字体 */
}

.user-info p {
  margin: 5px 0;
  color: #ffffff; /* 灰色文字 */
}

.user-info strong {
  color: #ffffff; /* 深蓝色 */
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
.edit-btn {
  background-color: #007bff;
  color: white;
  border: 1px solid #007bff;
  border-radius: 3px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 10px;
}

.edit-btn:hover {
  background-color: #45a049;
}
/* 弹窗中的头像水平滚动布局 */
.avatar-carousel {
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px 0;
}

.avatar-wrapper {
  display: inline-flex;
  gap: 42px; /* 调整头像之间的间距 */
  justify-content: center; /* 水平居中对齐 */
}

.avatar-option {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.avatar-option:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.avatar-option.selected {
  border-color: #007bff; /* 蓝色边框颜色 */
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5); /* 蓝色阴影效果 */
}

/* 确保滚动条样式统一 */
.avatar-carousel::-webkit-scrollbar {
  height: 8px;
}

.avatar-carousel::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.avatar-carousel::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}




</style>
