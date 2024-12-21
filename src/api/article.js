import { post,get } from "./api"

export function GetArticle(id){
    let data = {};
    data.id = id;
    return get("/papers/getArticle/" + id);
}

export function GetStar(id,paperId){ //获取问卷设计
    let data = {};
    data.id = id;
    data.paperId = paperId;
    return get("/paper/getStar/"+id+"/" + paperId);
}

export function PostStar(id,paperId,isStar){ //获取问卷设计
    let data = {};
    data.id = id;
    data.paperId = paperId;
    data.isStar = isStar;
    return post("/paper/postStar/", data);
}

/**
 * 获取筛选条件数据
 */
export function fetchFilters(searchConditions, dateRange) {
    return apiClient.post('/papers/filterdata', {
      searchConditions,
      dateRange
    }).then(response => response.data)
      .catch(error => {
        console.error("Error fetching filters:", error);
        throw error;
      });
  }
  
  /**
   * 获取总页数
   */
  export function getTotalPages(searchConditions, dateRange, filter) {
    return apiClient.post('/papers/getpage', {
      searchConditions,
      dateRange,
      filter
    }).then(response => response.data)
      .catch(error => {
        console.error("Error getting total pages:", error);
        throw error;
      });
  }
  
  /**
   * 搜索结果
   */
  export function fetchResults(searchConditions, dateRange, filter, sort, page, userId) {
    return apiClient.post('/papers/search', {
      searchConditions,
      dateRange,
      filter,
      sort,
      page,
      userId
    }).then(response => response.data)
      .catch(error => {
        console.error("Error fetching results:", error);
        throw error;
      });
  }