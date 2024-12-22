import { post,get } from "./api"

export function Authenticate(data){
    return post("/claims/authentication/",data);
}

export function fetchScholars(data){
    return post("/claims/fetchscholars/",data);
}