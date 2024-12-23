import { post,get } from "./api"

export function Authenticate(data){
    return post("/claims/authentication/",data);
}

export function fetchScholars(data){
    return post("/claims/fetchscholars/",data);
}
export function getClaims(){
    return get("/claims/");
}

export function approveClaims(claimId){
    return post(`/claims/${claimId}/approve`);
}

export function rejectClaims(claimId, reason){
    return post(`/claims/${claimId}/reject`, reason);
}


// 获取科研人员申请
export function getApplications() {
    return get('/claims/applications/');
  }
  
  // 通过科研人员申请
  export function approveApplication(applicationId) {
    let data = {};
    data.applicationId = applicationId;
    return post('/claims/applications/approve/',data);
  }
  
  // 驳回科研人员申请
  export function rejectApplication(applicationId) {
    let data = {};
    data.applicationId = applicationId;
    return post(`/claims/applications/reject/`, data);
  }
