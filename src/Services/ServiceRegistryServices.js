import axios from 'axios';

export async function PingServiceRegistry(hostname) {
    const urlExtension = "/Ping";
    return axios.get(`${hostname}${urlExtension}`);
}

export async function GetMinersFromServiceRegistry(hostname) {
    const urlExtension = "/miners";
    return axios.get(`${hostname}${urlExtension}`);
}

export async function GetRepositoriesFromServiceRegistry(hostname) {
    const urlExtension = "/repositories";
    return axios.get(`${hostname}${urlExtension}`);
}

export async function PingConnectedFilters(hostname, filter) {
    const urlExtension = "/connections/filters";
    return axios.post(`${hostname}${urlExtension}`, filter);
}