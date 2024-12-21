import { post,get } from "./api"

export function Login(username,password){
    let data = {};
    data.username = username;
    data.password = password;
    return post("/user/login/",data);
}
export function GetOtherUserData(currentUserId,targetUserId){
    let data = {};
    data.currentUserId = currentUserId;
    data.userId = targetUserId;
    return post("/users/otherUserData/",data);
}

/**
 * 获取总页数
 */
export function getTotalPages(searchConditions) {
    return apiClient.post('/users/getpage', { searchConditions })
      .then(response => response.data.totalPages || 1)
      .catch(error => {
        console.error("Error getting total pages:", error);
        throw error;
      });
  }
  
  /**
   * 搜索学者结果
   */
  export async function fetchResults(searchConditions, sort, page, userId) {
    try {
      const response = await apiClient.post('/users/searchscholars', {
        searchConditions,
        sort,
        page,
        userId
      });
      return response.data.map(scholar => ({
        ...scholar,
        collaborators: scholar.collaborators.map(collaborator => ({ name: collaborator.name, id: collaborator.id }))
      }));
    } catch (error) {
      console.error("Error fetching results:", error);
      throw error;
    }
  }