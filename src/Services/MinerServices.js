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

export async function GetMinerProcessStatus(hostname, processId) {
    const urlExtension = `/status/${processId}`;
    return axios.get(`${hostname}${urlExtension}`);
}

export async function StopMinerProcess(hostname, processId) {
    const urlExtension = `/stop/${processId}`;
    return axios.delete(`${hostname}${urlExtension}`);
}

export async function ShadowMiner(hostname, body) {
    const urlExtension = "/shadow";
    return axios.post(`${hostname}${urlExtension}`, body);
}