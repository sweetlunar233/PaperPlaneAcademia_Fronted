import { post,get } from "./api"

export function GetTopArticles(){
    let data = {};
    return get("/papers/top/");
}

export function GetRecommendedArticles(){
    let data = {};
    return get("/papers/recommended/");
}

export function GetStatistics(){
    let data = {};
    return get("/papers/statistics/");
}