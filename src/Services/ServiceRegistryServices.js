import axios from 'axios';

export async function PingServiceRegistry(hostname) {
    const urlExtension = "/Ping";
    return axios.get(`${hostname}${urlExtension}`);
}