<template>
  <el-container class="min-h-screen">
    <!-- 导航栏 -->


    <el-main>
      <!-- 文章详情 -->
      <el-card style="margin-bottom: 16px; background-color: #f0f8ff;">
        <el-row gutter="0" type="flex" align="middle">
          <el-col :span="3" >
            <el-image
              style=" width: 100%;display: flex; justify-content: center;"
              :src="article.image"
              fit="cover"
            ></el-image>
          </el-col>

          <el-col :span="20">
            <h2
              style="font-size: 30px; font-weight: bold; margin: 0; cursor: pointer; color: inherit;"
              @click="navigateToArticle(article.id)"
            >
              {{ article.title }}
            </h2>

            <p style="color: #a0a0a0; font-size: 10px; margin-top: 8px;">
              {{ article.time }}
            </p>
            <p style="color: #000; font-size: 12px; margin-top: 8px;font:bold;">
              {{ article.author }}
            </p>
            
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <p style="color: #000; font-size: 12px; margin-top: 8px; font-style: italic;">
              {{ article.description }}
            </p>
          </el-col>
        </el-row>
      </el-card>

      <!-- 发表评论 -->

      <el-card style="margin-bottom: 16px; width: 80%; background-color: #f5f5f5;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 16px;">
          发表评论
        </h2>
        
        <el-form>
          <el-form-item>
            <el-input
              type="textarea"
              rows="3"
              placeholder="输入评论内容"
              v-model="commentText"
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="submitComment" style="background-color: #333; color: white; border-radius: 5px; border: 1px solid #555; padding: 8px 20px;">发表</el-button>
        </el-form>
      </el-card>
      
      <!-- 评论列表 -->
      <el-card style="width: 80%; margin-top: 20px; background-color: #f5f5f5;">
  <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 16px;">
    评论
  </h2>
  <div style="height: 1px; background-color: #dcdfe6; margin-bottom: 16px;"></div>
  <div v-for="(comment, index) in comments" :key="index" style="margin-bottom: 16px;">
    <el-row gutter="20" type="flex" align="top">
      <el-col :span="1">
        <el-avatar
          size="50"
          src="https://via.placeholder.com/50"
        ></el-avatar>
      </el-col>
      <el-col :span="21">
        <p style="font-weight: bold; margin: 0;margin-left: 5px;">{{ comment.username }}</p>
        <p style="color: #606266; margin-top: 8px; margin-left: 5px;">{{ comment.content }}</p>
        <el-row type="flex" align="middle" style="margin-top: 8px;">
          <el-button
            type="text"
            size="small"
            @click="startReply(comment.id)"
            style="color: #333"
          >
            回复
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="likeComment(comment.id)"
            style="margin-left: 5px;"
          >
          <svg t="1732007549904" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1623" width="16" height="16"><path d="M734.426667 981.333333H320a149.333333 149.333333 0 0 1-149.333333-149.333333V546.46c0-100.666667 73.28-179.106667 126.786666-236.4l6-6.446667c68.52-73.56 74-133.906667 74-205.153333 0-25.746667 12.04-39.333333 22.14-46.186667C411.26 44.333333 424.326667 42.666667 433.233333 42.666667c20.993333 0 52.946667 9.473333 79.66 36.066666 20.553333 20.453333 45.053333 58.42 45.053334 123.113334 0 29.566667-7.18 62.666667-13.206667 85.2-7.8 29.213333-18.56 59.253333-30.28 84.573333a10.666667 10.666667 0 0 0 0.666667 10.373333 10.28 10.28 0 0 0 8.873333 4.833334h0.1l275.153333-2.22h0.666667a85.333333 85.333333 0 0 1 84.333333 98.306666l-65.546666 426.06A85.333333 85.333333 0 0 1 734.426667 981.333333zM433.233333 85.333333c-12.186667 0-13.133333 5.44-13.133333 13.126667 0 42.133333-2.26 77.706667-13.286667 114.373333C394.133333 255 370.54 294.206667 334.666667 332.666667l-6 6.513333C277.266667 394.186667 213.333333 462.666667 213.333333 546.46V832c0 58.813333 47.853333 106.666667 106.666667 106.666667h414.426667a42.433333 42.433333 0 0 0 42.173333-36.18l65.546667-426.06 21.086666 3.24-21.086666-3.24a42.666667 42.666667 0 0 0-42.146667-49.153334h-0.346667l-275.153333 2.22a53.333333 53.333333 0 0 1-48.74-75.8c22.913333-49.486667 39.54-113.333333 39.54-151.846666C515.28 113.813333 460 85.333333 433.233333 85.333333z" fill="#5C5C66" p-id="1624"></path></svg>{{ comment.likes }}
          </el-button>
        </el-row>

        <!-- 回复输入框 -->
        <div v-if="replyingTo === comment.id" style="margin-top: 8px;">
          <el-input
            type="textarea"
            rows="2"
            v-model="replyText[comment.id]"
            placeholder="输入回复内容"
            style="margin-bottom: 8px;"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            @click="submitReply(comment.id)" style="background-color: #333; color: white; border-radius: 5px; border: 1px solid #555; padding: 8px 20px;"
          >
            发表回复
          </el-button>
        </div>

        <!-- 展示回复 -->
        <div v-for="(reply, replyIndex) in comment.replies" :key="replyIndex" style="margin-left: 20px; margin-top: 12px;">
          <p style="font-size: 14px; font-weight: bold; margin: 0;">{{ reply.username }}</p>
          <p style="color: #606266; font-size: 12px; margin-top: 4px;">{{ reply.content }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</el-card>

    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      commentText: "",
      comments: [
        {
          id: 1,
          username: "用户1",
          content: "这是评论内容。",
          likes: 10,
          replies: [], // 新增字段，用于存储回复
        },
        {
          id: 2,
          username: "用户2",
          content: "这是另一条评论。",
          likes: 5,
          replies: [], // 新增字段，用于存储回复
        },
        
      ],
      replyText: {}, // 用于存储每条评论的回复输入框内容
      replyingTo: null, // 当前正在回复的评论ID
      article: {
        id: 101,
        image: "src/assets/images/plane.png", // 文章图片链接
        title: "AI Security Continuum: Concept and Challenges", // 文章标题
        time: "2024-4-14", // 文章时间
        author: "Hironori Washizaki; Nobukazu Yoshioka", //作者
        description: "\"We propose a conceptual framework, named \"AI Security Continuum,\" consisting of dimensions to deal with challenges of the breadth of the AI security risk sustainably and systematically under the emerging context of the computing continuum as well as continuous engineering. The dimensions identified are the continuum in the AI computing environment, the continuum in technical activities for AI, the continuum in layers in the overall architecture, including AI, the level of AI automation, and the level of AI security measures. We also prospect an engineering foundation that can efficiently and effectively raise each dimension.\"", // 文章描述
      },
    };
  },
  created() {
    // 从 URL 查询参数中获取文章 ID
    this.articleId = this.$route.query.paperId;

    // 获取文章详情和评论
    this.fetchArticleDetails();
  },
  methods: {
    fetchArticleDetails() {
      fetch(`/api/articles/${this.articleId}`)
        .then(response => response.json())
        .then(data => {
          this.article = data;

          // 文章详情获取成功后再获取评论
          this.fetchComments();
        })
        .catch(error => {
          console.error("获取文章详情失败", error);
        });
    },

    // 获取评论
    fetchComments() {
      fetch(`/api/comments/${this.articleId}`)
        .then(response => response.json())
        .then(data => {
          this.comments = data;
        })
        .catch(error => {
          console.error("获取评论失败", error);
        });
    },
    submitComment() {
          if (this.commentText.trim()) {
        // 构造评论数据
        const commentData = {
          articleId: this.articleId,  // 当前文章的 ID
          content: this.commentText,   // 评论的内容
          username: "新用户",          // 用户名，这里可以根据实际情况传递
          likes: 0,                    // 初始点赞数
          replies: [],                 // 评论初始没有回复
        };

        // 向后端发送请求，保存评论
        fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commentData),  // 将评论数据转换为 JSON 格式
        })
        .then(response => response.json())
        .then(data => {
          // 评论提交成功后，更新本地评论列表
          this.comments.push(data);  // 假设后端返回了保存后的评论对象
          this.commentText = "";  // 清空评论框
        })
        .catch(error => {
          console.error("提交评论失败", error);
          this.$message.error("提交评论失败，请重试！");
        });
      } else {
        this.$message.warning("评论内容不能为空！");
      }
    },
    viewReplies(id) {
      this.$message.info(`查看评论 ${id} 的回复`);
    },
    likeComment(id) {
      const comment = this.comments.find((comment) => comment.id === id);
      if (comment) {
        comment.likes++;
      }
    },
    navigateToArticle(articleId) {
    // 跳转到文章页面逻辑
    console.log(`跳转到文章页面，文章 ID: ${articleId}`);
    this.$router.push('/article/${articleId}');
  },
    startReply(commentId) {
      this.replyingTo = commentId; // 设置当前正在回复的评论ID
      if (!this.replyText[commentId]) {
        this.replyText[commentId] = ""; // 初始化输入框内容
      }
    },
    submitReply(commentId) {
      const replyContent = this.replyText[commentId]?.trim();
  if (replyContent) {
    const replyData = {
      content: replyContent,  // 回复内容
      username: "当前用户",   // 当前用户的用户名，可以根据实际情况修改
    };

    // 构建动态 URL，使用 commentId
    const url = `/api/comments/${commentId}/reply`;

    // 向后端发送请求，保存回复
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(replyData),  // 将回复数据转换为 JSON 格式
    })
    .then(response => response.json())
    .then(data => {
      // 回复提交成功后，更新本地评论的回复列表
      const comment = this.comments.find(c => c.id === commentId);
      if (comment) {
        comment.replies.push(data);  // 假设后端返回了保存后的回复对象
        this.replyText[commentId] = "";  // 清空回复框
        this.replyingTo = null;  // 重置回复状态
      }
    })
    .catch(error => {
      console.error("提交回复失败", error);
      this.$message.error("提交回复失败，请重试！");
    });
  } else {
    this.$message.warning("回复内容不能为空！");
  }
    },
},
}
</script>

<style scoped>
/* 为每个组件的样式定制 */
.bg-white {
  background-color: #ffffff;
}
.shadow-md {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.min-h-screen {
  min-height: 100vh;
}
</style>
