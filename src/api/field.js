import { post,get } from "./api"

export function GetField(id){
    let data = {};
    data.id = id;
    return get("/field/getField/",data);
}