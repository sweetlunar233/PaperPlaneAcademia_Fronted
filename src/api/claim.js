import { post,get } from "./api"

export function Authenticate(data){
    return post("/claims/authentication/",data);
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
