import { post,get } from "./api"

export function GetComment(articleId){
    let data = {
    };
    data.articleId = articleId;
    console.log("articleId",articleId);
    return post("/comment/getComment/",data);
}

export function LikeComment(commentId){
    let data = {};
    data.commentId = commentId;
    return post("/comment/like/",JSON.stringify(data));
}

export function Reply(commentId,content,userId){
    let data = {};
    data.commentId = commentId;
    data.content = content;
    data.userId = userId;
    return post("/comments/reply/",data);
}

export function Publish(paperId,userId,content){
    let data = {};
    data.paperId = paperId;
    data.userId = userId;
    data.content = content;
    console.log("sending data",data);
    return post("/comment/publish/",JSON.stringify(data));
}
