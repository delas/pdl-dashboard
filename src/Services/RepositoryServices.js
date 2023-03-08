import axios from 'axios';

export async function PingRepository(hostname) {
    const urlExtension = "/Ping";
    return axios.get(`${hostname}${urlExtension}`);
}

export async function UploadFileToRepository(hostname) {
    const urlExtension = "/resources";
    return axios.post(`${hostname}${urlExtension}`);
}

export async function DownloadFileFromRepository(hostname, fileId) {
    const urlExtension = `/resources/${fileId}`;
    return axios.get(`${hostname}${urlExtension}`);
}

export async function GetResourcesFromRepository(hostname) { //only the metadata of the content. Not full files
    const urlExtension = "/resources";
    return axios.post(`${hostname}${urlExtension}`);
}