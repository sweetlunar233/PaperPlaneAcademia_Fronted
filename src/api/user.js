import { post,get } from "./api"

export function Login(username,password){
    let data = {};
    data.username = username;
    data.password = password;
    return post("/user/login/",data);
}
export function GetScholarData(currentUserId,targetUserId){
    let data = {};
    data.currentUserId = currentUserId;
    data.authorId = targetUserId;
    return post("/authors/scholarData/",data);
}
export function GetMyUserData(userId){
    let data = {};
    data.userId = userId;
    return post("/users/myUserData/",data);
}

export function Register(username,password,email,organization, avatar){
    let data = {};
    data.username = username;
    data.password = password;
    data.email = email;
    data.organization = organization;
    if(!avatar) avatar = 0;
    data.avatar = avatar;
    console.log(data);
    return post("/users/register/",data);
}

export function UpdateAvatar(userId, avatarIndex){
    let data = {};
    data.userId = userId;
    data.avatarIndex = avatarIndex;
    console.log(data);
    return post("/users/updateAvatar/",data);
}

export function fetchResults(data) {
    return post("/authors/searchscholars/", data);
}


export function updateDescription(userId, description){
    let data = {};
    data.userId = userId;
    data.description = description;
    console.log(data);
    return post("/users/updateDescription/",data);
}

export function platformOverview(){
    return get("/user/platform-overview/");
}

export function fatchScholars_api() {
    return get('/users/scholars/')  // 你可以根据自己的实际后端接口调整路径
  }