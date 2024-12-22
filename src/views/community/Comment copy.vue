<template>
  <div style="background-color: #EBEEF5;height: 1000px;">
    <el-row>

      <!-- 发表评论 -->

      <el-col :span="16" class="postComment">
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 16px;">
          发表评论
        </div>
        <el-avatar :size="100" :src="availableAvatars[avatar]"></el-avatar>
        <el-form style="padding-top: 3%;">
          <el-form-item>
            <el-input
              type="textarea"
              rows="5"
              placeholder="输入评论内容"
              v-model="commentText"
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="submitComment">发表</el-button>
        </el-form>
      </el-col>
      
      <!-- 评论列表 -->
      <el-col class="postComment"  :span="16" v-loading="isLoading"
      element-loading-background="rgba(244, 246, 247,0.8)">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 16px;">
          评论
        </h2>
        <div style="height: 1px; background-color: #dcdfe6; margin-bottom: 16px;"></div>
        <div v-for="(comment, index) in comments" :key="index" style="margin-bottom: 16px;">
          <el-row gutter="20" type="flex" align="top">
            <el-col :span="1">
              <el-avatar size="50" :src="availableAvatars[comment.avatar]"></el-avatar>
            </el-col>
            <el-col :span="21">
              <p style="font-weight: bold; margin: 0;margin-left: 5px;">{{ comment.username }}</p>
              <p style="color: #606266; margin-top: 8px; margin-left: 5px;">{{ comment.content }}</p>
              <el-row type="flex" align="middle" style="margin-top: 8px;">
                <!-- <el-button
                  type="text"
                  size="small"
                  @click="startReply(comment.id)"
                >
                  回复
                </el-button> -->
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
              <!-- <div v-if="replyingTo === comment.id" style="margin-top: 8px;">
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
                  @click="submitReply(comment.id)"
                >
                  发表回复
                </el-button>
              </div> -->

              <!-- 展示回复 -->
              <!-- <div v-for="(reply, replyIndex) in comment.replies" :key="replyIndex" style="margin-left: 20px; margin-top: 12px;">
                <p style="font-size: 14px; font-weight: bold; margin: 0;">{{ reply.username }}</p>
                <p style="color: #606266; font-size: 12px; margin-top: 4px;">{{ reply.content }}</p>
              </div> -->
            </el-col>
          </el-row>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { GetComment, LikeComment, Publish } from '@/api/comment';
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      commentText: "", // 该用户的评论
      comments: [
        {
          id: 1,
          username: "用户1",
          content: "这是评论内容。",
          likes: 10,
          avatar:0,
        },
        {
          id: 2,
          username: "用户2",
          content: "这是另一条评论。",
          likes: 5,
          avatar:2,
        },
        
      ],
      // replyText: {}, // 用于存储每条评论的回复输入框内容
      // replyingTo: null, // 当前正在回复的评论ID
      availableAvatars: [ // 可供选择的头像
        'https://th.bing.com/th/id/OIP.Wm28iTeZUzxP_FOrlfqZWAHaHa?rs=1&pid=ImgDetMain',
        'https://th.bing.com/th/id/OIP.jHUH4s7TQ48X_B-1iozuJgHaHa?rs=1&pid=ImgDetMain',
        'https://img.zcool.cn/community/016a2e5f110b9fa801215aa097202c.png?x-oss-process=image/auto-orient,1/resize,m_lfit,w_1280,limit_1/sharpen,100',
        'https://img.zcool.cn/community/0143395f110b9fa801215aa060a140.png?x-oss-process=image/auto-orient,1/resize,m_lfit,w_1280,limit_1/sharpen,100',
        'https://th.bing.com/th/id/R.7376aae88d772c821c6925b91e2ca1aa?rik=8n%2bJq8ypQTiJHA&pid=ImgRaw&r=0',
        'https://img.zcool.cn/community/01972c5f110b9fa801206621eba569.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp',
      ],
      userId:0,
      username:"",
      avatar:0,
      paperId:0,
      isLoading:false,
    };
  },
  methods: {
    submitComment() {
      if (this.commentText.trim()) {
        this.isLoading = true;
        var tmp;
        var promise = Publish(this.paperId,this.userId,this.commentText);
        promise.then((result) => {
          tmp = {
            id:result.commentId,
            username:this.username,
            content:this.commentText,
            likes:0,
            avatar:this.avatar,
          }
          this.comments.push(tmp);
        })
        .finally(() => {
          this.isLoading = false;
        })
        this.commentText = "";
      } else {
        this.$message.warning("评论内容不能为空！");
      }
    },
    // viewReplies(id) {
    //   this.$message.info(`查看评论 ${id} 的回复`);
    // },
    likeComment(id) {
      const comment = this.comments.find((comment) => comment.id === id);
      if (comment) {
        comment.likes++;
      }

      var promise = LikeComment(id);
    },
    navigateToArticle(articleId) {
      // 跳转到文章页面逻辑
      console.log(`跳转到文章页面，文章 ID: ${articleId}`);
      this.$router.push('/article/${articleId}');
    },
    // startReply(commentId) {
    //   this.replyingTo = commentId; // 设置当前正在回复的评论ID
    //   if (!this.replyText[commentId]) {
    //     this.replyText[commentId] = ""; // 初始化输入框内容
    //   }
    // },
    // submitReply(commentId) {
    //   const replyContent = this.replyText[commentId]?.trim();
    //   if (replyContent) {
    //     const comment = this.comments.find((c) => c.id === commentId);
    //     if (comment) {
    //       comment.replies.push({
    //         username: "当前用户", // 替换为实际用户名
    //         content: replyContent,
    //       });
    //       this.replyText[commentId] = ""; // 清空输入框
    //       this.replyingTo = null; // 重置回复状态
    //     }
    //   } else {
    //     this.$message.warning("回复内容不能为空！");
    //   }
    // },
  },
  mounted(){
    this.userId = this.$cookies.get("userId");
    this.username = this.$cookies.get("username");
    this.avatar = this.$cookies.get("avatar");
    this.paperId = this.$route.query.paperId;

    var promise = GetComment(this.paperId);
    promise.then((result) =>{
      if(result.comments){
        this.comments = result.comments;
      }
      else{
        ElMessage({
            message: '获取评论失败',
            type: 'error',
            plain: true,
        });
      }
    })
    .finally(() =>{
      this.isLoading = false;
    })
  }
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

.postComment {
    background-color: white;
    padding-top: 2%;
    padding-left: 2%;
    padding-right: 2%;
    padding-bottom: 2%;
    margin-left: 17%;
    margin-top: 3%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .08), 0 0 6px rgba(0, 0, 0, .04);
}

</style>
