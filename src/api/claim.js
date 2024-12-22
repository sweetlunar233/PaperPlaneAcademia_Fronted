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

export function submitRejections(claimId, reason){
    return post(`/claims/${claimId}/reject`, reason);
}


// 获取科研人员申请
export function getApplications() {
    return get('/claims/applications/');
  }
  
  // 通过科研人员申请
  export function approveApplication(applicationId) {
    return post(`/claims/applications/${applicationId}/approve/`);
  }
  
  // 驳回科研人员申请
  export function rejectApplication(applicationId, reason) {
    return post(`/claims/applications/${applicationId}/reject/`, { reason });
  }
