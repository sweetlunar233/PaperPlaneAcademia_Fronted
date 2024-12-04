import { post,get } from "./api"

export function GetTopArticles(){
    let data = {};
    return get("/home/top/");
}

export function GetRecommendedArticles(){
    let data = {};
    return get("/home/recommended/");
}

export function GetStatistics(){
    let data = {};
    return get("/home/statistics/");
}