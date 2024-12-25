<template>
  <div style="background-color: #EBEEF5;min-height: 1000px;">
    <el-row >

      <!-- 发表评论 -->

      <el-col :span="16" class="postComment">
        <div class="title" >
          发表评论
        </div>
        <el-avatar :size="100" :src="availableAvatars[avatar]" @click="gotoUser"></el-avatar>
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
      element-loading-background="rgba(244, 246, 247,0.8)"
      style="min-height: 220px;"
      >
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 16px;">
          评论
        </h2>
        <div style="height: 1px; background-color: #dcdfe6; margin-bottom: 16px;"></div>
        <div v-if="comments.length > 0" v-for="(comment, index) in comments" :key="index" style="margin-bottom: 16px;">
          <el-card  type="flex" align="top">
            <div>
              <el-avatar size="200" :src="availableAvatars[comment.avator]"></el-avatar>
              <span style="font-weight: bold; margin: 0;margin-left: 15px;color:rgb(51.2, 126.4, 204);font-size: 20px;">{{ comment.username }}</span>
            </div>
            <el-divider/>
            <div>
              <p style="color: #606266; margin-top: 1px; margin-left: 5px;">{{ comment.content }}</p>
              <el-row type="flex" justify="end" style="padding-top: 1%;">
                <el-button
                  type="text"
                  size="small"
                  @click="likeComment(comment.id)"
                >
                <svg t="1734869597630" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1484" width="28" height="28"><path d="M64 928h192V453.1H64V928z m891.1-461.4c-5.5-8.4-14.9-13.5-24.9-13.5H625.5V181.8c0-47.3-38.4-85.8-85.6-85.8h-55.8c-47.2 0-85.6 38.5-85.6 85.8v161.7c0 0.7 0 1.4 0.1 2.1 0 0.4 1.9 40.2-26.3 70.5-12.9 13.9-30.4 23.9-52.3 30v482h442.9c11.9 0 22.8-7.1 27.4-18.1l167.3-415c3.9-9.4 3-20-2.5-28.4z" fill="#47444F" p-id="1485"></path></svg><div class="likeNum">{{ comment.likes }}</div>
                </el-button>
              </el-row>
            </div>
          </el-card>
        </div>
        <div v-else>
          该文章暂无评论，快来评论吧！
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
      "https://img.zcool.cn/community/016a2e5f110b9fa801215aa097202c.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp",
        "https://img.zcool.cn/community/01a6095f110b9fa8012066219b67d4.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp",
        "https://img.zcool.cn/community/01972c5f110b9fa801206621eba569.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp",
        "https://img.zcool.cn/community/0143395f110b9fa801215aa060a140.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp",
        "https://img.zcool.cn/community/014f685f110b9fa801215aa096689e.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp",
        "https://img.zcool.cn/community/015ac85f110b9fa801206621387957.png?imageMogr2/auto-orient/thumbnail/1280x%3e/sharpen/0.5/quality/100/format/webp",
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
        console.log(result);
        this.comments = result.comments;
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
