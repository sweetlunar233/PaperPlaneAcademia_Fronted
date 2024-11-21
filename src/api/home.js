import { post,get } from "./api"

export function GetTopArticles(userId){
    let data = {};
    data.userid = userId;
    return get("/home/top/"+userId);
}

export function GetRecommendedArticles(userId){
    let data = {};
    data.userid = userId;
    return get("/home/recommended/"+userId);
}
