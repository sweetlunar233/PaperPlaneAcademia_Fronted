import { post,get } from "./api"

export function Login(username,password){
    let data = {};
    data.username = username;
    data.password = password;
    return post("/user/login/",data);
}

export function Register(username,password,email,organization,userType){
    let data = {};
    data.username = username;
    data.password = password;
    data.email = email;
    data.organization = organization;
    data.userType = userType;
    return post("/user/register/",data);
}