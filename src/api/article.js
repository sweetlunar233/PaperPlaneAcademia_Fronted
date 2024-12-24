import { post,get } from "./api"

export function GetArticle(id){
    let data = {};
    data.id = id;
    return get("/papers/getArticle/",data);
}

export function GetStar(id,paperId){
    let data = {};
    data.id = id;
    data.paperId = paperId;
    return get("/paper/getStar/",data);
}

export function PostStar(id,paperId,isStar){
    let data = {};
    data.id = id;
    data.paperId = paperId;
    data.isStar = isStar;
    return post("/paper/postStar/",data);
}

export function GetStarCnt(paperId){
    let data = {};
    data.paperId = paperId;
    return get("/papers/starCnt/",data);
}

export function fetchFilters(data){
    return post("/papers/filterdata/",data);
}

export function getTotalPages(data) {
    return post("/papers/getpage/", data);
}

export function fetchResults(data) {
    return post("/papers/search/", data);
}

export function searchByName(data){
    return post("/papers/searchbyname/",data);
}