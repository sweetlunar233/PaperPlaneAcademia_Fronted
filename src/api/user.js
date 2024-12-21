import { post,get } from "./api"

export function Login(username,password){
    let data = {};
    data.username = username;
    data.password = password;
    return post("/user/login",data);
}
<<<<<<< HEAD
export function Register(username,password){
    let data = {};
    data.username = username;
    data.password = password;
    return post("/user/register/",data);
}
=======

>>>>>>> 4f860dbadffd9adb88a8d815c194bbe5cf70a27c
export function GetOtherUserData(currentUserId,targetUserId){
    let data = {};
    data.currentUserId = currentUserId;
    data.userId = targetUserId;
    return post("/users/otherUserData",data);
}

export function Register(username,password,email,organization,userType){
    let data = {};
    data.username = username;
    data.password = password;
    data.email = email;
    data.organization = organization;
    data.userType = userType;
    console.log(data);
    return post("/user/register",data);
}