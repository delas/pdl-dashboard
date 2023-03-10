import axios from 'axios';

export async function PingRepository(hostname) {
    const urlExtension = "/Ping";
    return axios.get(`${hostname}${urlExtension}`);
}

export async function GetLogFilesMetadata(hostname){
    const urlExtension = "/resources/eventlogs";
    return axios.get(`${hostname}${urlExtension}`);
}

export async function GetVisFilesMetadata(hostname){
    const urlExtension = "/resources/visualizations";
    return axios.get(`${hostname}${urlExtension}`);
}

export async function GetFileImage(hostname, fileId){
    const urlExtension = `/resources/${fileId}`;
    return axios.get(`${hostname}${urlExtension}`, {responseType: 'blob'});
}

export async function GetFileText(hostname, fileId){
    const urlExtension = `/resources/${fileId}`;
    return axios.get(`${hostname}${urlExtension}`);
}

export async function GetRepositoryConfig(hostname) {
    const urlExtension = "/configurations";
    return axios.get(`${hostname}${urlExtension}`);
}


export const sendFileToRepository = async (hostname, file, fileType) => {
    const urlExtension = "/resources";
    const fileExtension = file.name.split('.')[file.name.split('.').length - 1];
    const formdata = new FormData();
    formdata.append('field', file);
    formdata.append('fileLabel', file.name);
    formdata.append('fileType', fileType);
    formdata.append('fileExtension', fileExtension);

    axios.post(`${hostname}${urlExtension}`, formdata);
};