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
export function GetMyUserData(userId){
    let data = {};
    data.userId = userId;
    return post("/users/myUserData/",data);
}

export function Register(username,password,email,organization,userType){
    let data = {};
    data.username = username;
    data.password = password;
    data.email = email;
    data.organization = organization;
    data.userType = userType;
    console.log(data);
    return post("/user/register/",data);
}

export function UpdateAvatar(userId, avatarIndex){
    let data = {};
    data.userId = userId;
    data.avatarIndex = avatarIndex;
    console.log(data);
    return post("/user/updateAvatar/",data);
}