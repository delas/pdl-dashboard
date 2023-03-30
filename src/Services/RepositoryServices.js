import axios from 'axios';

export async function PingRepository(hostname) {
    const urlExtension = "/Ping";
    return axios.get(`${hostname}${urlExtension}`);
}

export async function GetRepositoryFilterMetadata(hostname, filters) {
    const urlExtension = "/resources/metadata/filters/";
    return axios.post(`${hostname}${urlExtension}`, filters);
}

export async function GetSingleFileMetadata(hostname, fileId){
    const urlExtension = `/resources/metadata/${fileId}`;
    return axios.get(`${hostname}${urlExtension}`);
}

export async function getChildrenFromFile(hostname, fileId){
    const urlExtension = `metadata/${fileId}/children`;
    console.log(`${hostname}${urlExtension}`);
    return axios.get(`${hostname}${urlExtension}`);
}

export async function GetFileImage(hostname, fileId){ //if the visualization is an image the reponseType needs to be blob
    const urlExtension = `${fileId}`;
    return axios.get(`${hostname}${urlExtension}`, {responseType: 'blob'});
}

export async function GetFileText(hostname, fileId){ //If the visualization is text-formatted the responsetype can't be blolb
    const urlExtension = `${fileId}`;
    return axios.get(`${hostname}${urlExtension}`);
}

export async function GetHistogramOfLog(hostname, fileId){
    const urlExtension = `histograms/${fileId}`;
    return axios.get(`${hostname}${urlExtension}`);
}

export async function GetRepositoryConfig(hostname) {
    const urlExtension = "/configurations";
    return axios.get(`${hostname}${urlExtension}`);
}

export async function GetResourceGraph(hostname, fileId){
    const urlExtension = `graphs/${fileId}`;
    return axios.get(`${hostname}${urlExtension}`);
}

export const sendFileToRepository = async (hostname, file, fileType, description = "") => {
    // The file param is the html input type, not the metadata object used elsewhere.
    const urlExtension = "/resources/";
    const fileExtension = file.name.split('.')[file.name.split('.').length - 1];
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('ResourceLabel', file.name);
    formdata.append('ResourceType', fileType);
    formdata.append('FileExtension', fileExtension);
    formdata.append('Description', description);
    return axios.post(`${hostname}${urlExtension}`, formdata);
};