import { post,get } from "./api"

export function Login(username,password){
    let data = {};
    data.username = username;
    data.password = password;
    return post("/user/login/",data);
}

export function GetOtherUserData(username,password){
    let data = {};
    data.username = username;
    data.password = password;
    return get("/user/otherUserData/",data);
}