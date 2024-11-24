import { post,get } from "./api"

export function GetTopArticles(userid){
    let data = {};
    data.userid = userid;
    return get("/home/top/"+userid);
}

export function GetRecommendedArticles(userid){
    let data = {};
    data.userid = userid;
    return get("/home/recommended/"+userid);
}
