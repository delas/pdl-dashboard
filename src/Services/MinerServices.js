import axios from 'axios';

export async function PingMiner(hostname) {
    const urlExtension = "/system/Ping";
    return axios.get(`${hostname}${urlExtension}`);
}

export async function GetMinerConfig(hostname) {
    const urlExtension = "/configurations";
    return axios.get(`${hostname}${urlExtension}`);
}