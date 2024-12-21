import { post,get } from "./api"

export function GetArticle(id){
    let data = {};
    data.id = id;
    return get("/papers/getArticle/"+id);
}

export function GetStar(id,paperId){ //获取问卷设计
    let data = {};
    data.id = id;
    data.paperId = paperId;
    return get("/paper/getStar/"+id+"/"+paperId);
}

export function PostStar(id,paperId,isStar){ //获取问卷设计
    let data = {};
    data.id = id;
    data.paperId = paperId;
    data.isStar = isStar;
    return post("/paper/postStar/",data);
}