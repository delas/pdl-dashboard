import axios from 'axios';

export async function PingRepository(hostname) {
    const urlExtension = "/Ping";
    return axios.get(`${hostname}${urlExtension}`);
}