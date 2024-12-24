<template>
  <div style="background-color: #EBEEF5;height: 1000px;">
    <el-row>

      <!-- 发表评论 -->

      <el-col :span="16" class="postComment">
        <div class="title" >
          发表评论
        </div>
        <el-avatar :size="100" :src="availableAvatars[avatar]" @click="gotoUser" class="avatar"></el-avatar>
        <el-form style="padding-top: 3%;">
          <el-form-item>
            <el-input
              type="textarea"
              rows="5"
              placeholder="输入评论内容"
              v-model="commentText"
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="submitComment" style="background-color: #333; color: white; border-radius: 5px; border: 1px solid #555; padding: 8px 20px;" class="button">发表</el-button>
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
              <el-avatar size="50" :src="availableAvatars[comment.avator]"></el-avatar>
            </el-col>
            <el-col :span="21">
              <p style="font-weight: bold; margin: 0;margin-left: 5px;">{{ comment.username }}{{ comment.avator }}</p>
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
                <svg t="1734869597630" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1484" width="28" height="28"><path d="M64 928h192V453.1H64V928z m891.1-461.4c-5.5-8.4-14.9-13.5-24.9-13.5H625.5V181.8c0-47.3-38.4-85.8-85.6-85.8h-55.8c-47.2 0-85.6 38.5-85.6 85.8v161.7c0 0.7 0 1.4 0.1 2.1 0 0.4 1.9 40.2-26.3 70.5-12.9 13.9-30.4 23.9-52.3 30v482h442.9c11.9 0 22.8-7.1 27.4-18.1l167.3-415c3.9-9.4 3-20-2.5-28.4z" fill="#47444F" p-id="1485"></path></svg><div class="likeNum">{{ comment.likes }}</div>
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
        
        
      ],
      // replyText: {}, // 用于存储每条评论的回复输入框内容
      // replyingTo: null, // 当前正在回复的评论ID
      availableAvatars: [ // 可供选择的头像
        "src/assets/images/avatar/1.jpg",
        "src/assets/images/avatar/2.jpg",
        "src/assets/images/avatar/3.jpg",
        "src/assets/images/avatar/4.jpg",
        "src/assets/images/avatar/5.jpg",
        "src/assets/images/avatar/6.jpg",
      ],
      userId:0,
      username:"",
      avatar:1,
      paperId:0,
      isLoading:false,
    };
  },
  methods: {
    gotoUser(){
      this.$router.push(`/myGateway`);
    },
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
            avatar:this.avator,
          }
          this.comments.push(tmp);
          window.location.reload();
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
    console.log("currentUserInfo",this.username,this.avatar);
    const articleId=this.$route.query.paperId;
    var promise = GetComment(articleId);
    promise.then((result) =>{
      console.log("response",result);
      if(result.comments === null){

        ElMessage({
            message: '获取评论失败',
            type: 'error',
            plain: true,
        });
      }
      else{
        //console.log("data1:",result.data.comments);
        this.comments = result.comments;
        console.log("data2:",this.comments);
      }
    })
    .finally(() =>{
      this.isLoading = false;
    })
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap'); /* 引入 Montserrat 字体 */
.title{
  margin-bottom: 16px;
  font-size: 32px; /* 设置字体大小 */
  font-family: 'Montserrat', sans-serif; /* 使用 Montserrat 字体 */

  font-weight: bold; /* 设置为加粗 */
}
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
.likeNum{
  margin-left: 10px;
  font-size: 16px; /* 设置字体大小 */
  font-family: 'Montserrat', sans-serif; /* 使用 Montserrat 字体 */

  font-weight: bold; /* 设置为加粗 */
}
.avatar {
  transition: transform 0.3s ease;  /* 设置过渡效果，使变大动作平滑 */
}

.avatar:hover {
  transform: scale(1.1);  /* 鼠标悬停时，放大1.1倍 */
}
.avatar:active {
  transform: scale(0.95);  /* 点击时头像略微缩小 */
}
.button {
  transition: transform 0.2s ease;  /* 设置过渡效果，使变大动作平滑 */
}

.button:hover {
  transform: scale(1.05);  /* 鼠标悬停时，放大1.1倍 */
}
.button:active {
  transform: scale(0.95);  /* 点击时头像略微缩小 */
}
</style>
