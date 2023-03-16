import axios from 'axios';

export async function PingMiner(hostname) {
    const urlExtension = "/Ping";
    return axios.get(`${hostname}${urlExtension}`);
}

export async function GetMinerConfig(hostname) {
    const urlExtension = "/configurations";
    return axios.get(`${hostname}${urlExtension}`);
}

export async function PostMineAction(hostname, data){
    const urlExtension = "/miner";
    return axios.post(`${hostname}${urlExtension}`, data);
}