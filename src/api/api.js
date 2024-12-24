import axios from "axios";

const serveAddress = "http://113.44.138.144:8000";
//const serveAddress = "http://127.0.0.1:8000";

export function post(url,data){
    return new Promise((resolve,reject) => {
        axios
            .post(serveAddress+url,data)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                resolve({error:error,status:"error"});
            })
    });
}

// param 请求类型的 api
export function get(url,param){
    return new Promise((resolve,reject) => {
        axios
            .get(serveAddress+url,{
                params:param
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                resolve({error:error,status:"error"});
            })
    });
}