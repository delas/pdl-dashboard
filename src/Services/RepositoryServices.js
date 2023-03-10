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

// axios.get('https://picsum.photos/300/300', )
// .then(response => {
//   let imageNode = document.getElementById('image');
//   let imgUrl = URL.createObjectURL(response.data)
//   imageNode.src = imgUrl
// })