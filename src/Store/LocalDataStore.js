import { getFileExtension } from "../Utils/FileUnpackHelper";
// ---------------------- Default utils ----------------------
const setSavedItem = async (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const getSavedItem = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

const removeSavedResource = async (key) => {
    try{
        localStorage.removeItem(key);
    }
    catch(e) {
        console.log(e);
    }
}


// ---------------------- HOST STORAGE ----------------------
export function saveHostLocal(key, hostObject){
    setSavedItem(key, hostObject);
}

export function hostExitsLocal(url){
    const hostsWithSameUrl = Object.keys(localStorage).filter((key) => {
        if(key !== "debug"){ // because there is default a value not in json format
            const storageItem = JSON.parse(localStorage.getItem(key));
            if(storageItem && storageItem.name === url)
            return storageItem;
        }
    });
    return hostsWithSameUrl.length !== 0;
}

export function removeHostLocal(key){
    removeSavedResource(key);
}

export function getHostLocal(key) {
    return getSavedItem(key);
}

export function getMinersLocal(){
    return getAllTypeLocal("miner");
}

export function getRepositoriesLocal(){
    return getAllTypeLocal("repository");
}

export function getServiceRegistriesLocal(){
    return getAllTypeLocal("service registry");
}

export function getAllHostLocallyAdded() {
    return getMinersLocal().filter((miner) => miner.addedFrom === "locally")
    .concat(getRepositoriesLocal().filter((repository) => repository.addedFrom === "locally"))
    .concat(getServiceRegistriesLocal().filter((serviceRegistry) => serviceRegistry.addedFrom === "locally"));
}

export function getAllHostAddedFromServiceRegistry(serviceRegistryHostName) {
    return getMinersLocal().filter((miner) => miner.addedFrom === serviceRegistryHostName)
    .concat(getRepositoriesLocal().filter((repository) => repository.addedFrom === serviceRegistryHostName))
    .concat(getServiceRegistriesLocal().filter((serviceRegistry) => serviceRegistry.addedFrom === serviceRegistryHostName));
}

export function getAllHostStatusLocal() {
    const minerStatus = getMinersLocal().map((miner) => {
        return miner.status;
    });
    const repositoryStatus = getRepositoriesLocal().map((repository) => {
        return repository.status;
    });
    const SRstatus = getServiceRegistriesLocal().map((serviceRegistry) => {
        return serviceRegistry.status;
    });
    return [...minerStatus, ...repositoryStatus, ...SRstatus];
}

export function setHostStatusLocal(id, status) {
    const host = Object.keys(localStorage).filter((key) => key === id);
    if(host.length > 0){
        const storageItem = JSON.parse(localStorage.getItem(host[0]));
        storageItem.status = status;
        removeHostLocal(id);
        saveHostLocal(id, storageItem);
    }
}

function getAllTypeLocal(type) { //Types ["miner", "repository", "service registry"]
    return getAllKeysWithTypeLocal(type).map((key) => {
        return JSON.parse(localStorage.getItem(key));
    })
}

function getAllKeysWithTypeLocal(type) {
    return Object.keys(localStorage).filter((key) => {
        if(key !== "debug"){ // because there is default a value not in json format
            const storageItem = JSON.parse(localStorage.getItem(key));
            if(storageItem && storageItem?.type?.value === type)
            return storageItem;
        }
    })
}

export function removeItemLocal(key){
    try{
        localStorage.removeItem(key);
    }
    catch(e) {
        console.log(e);
    }
}

export function saveInputValuesLocal(minerHostId, minerId, inputValues){
    // create as object of type {minerId: inputValues} on the miner host object
    const minerHost = getHostLocal(minerHostId);
    minerHost["inputValues"] = {...minerHost.inputValues, [minerId]: inputValues};
    removeHostLocal(minerHostId);
    saveHostLocal(minerHostId, minerHost);
}

export function getSavedInputValuesLocal(minerHostId, minerId){
    const minerHost = getHostLocal(minerHostId);
    if(minerHost["inputValues"]) return minerHost["inputValues"][minerId];
    else return null;
}


// ---------------------- FILE STORAGE ----------------------

export function saveFileLocal(key, file) {
    // console.log(file.fileContent);
    setSavedItem(key, file);
}

export function removeFileLocal(key){
    removeSavedResource(key);
}

export function getFileLocal(key) {
    return getSavedItem(key);
}

export function getAllFilesLocal(){
    const fileKeys = Object.keys(localStorage).filter((key) => {
        if(key !== "debug"){ // because there is default a FileExtension not in json format
            const storageItem = JSON.parse(localStorage.getItem(key));
            if(storageItem && storageItem.ResourceId && getFileExtension(storageItem))
            return storageItem;
        }
    })
    return fileKeys.map((key) => {
        return JSON.parse(localStorage.getItem(key));
    })
}

export function getFilesOfTypeLocal(type) {
    return GetAllFileOfTypeLocal(type);
}

function GetAllFileOfTypeLocal(type) { //Types ["PNML", "PNG", "BPMN"...]
    return getAllFileKeysWithTypeLocal(type).map((key) => {
        return JSON.parse(localStorage.getItem(key));
    })
}

function getAllFileKeysWithTypeLocal(type) {
    return Object.keys(localStorage).filter((key) => {
        if(key !== "debug"){ // because there is default a FileExtension not in json format
            const storageItem = JSON.parse(localStorage.getItem(key));
            if(storageItem && storageItem.FileExtension === type)
            return storageItem;
        }
    })
}

// ---------------------- PROCESS STORAGE ----------------------
export function saveProcessLocal(process){
    setSavedItem(process.id, process);
}

export function removeProcessLocal(key){
    removeSavedResource(key);
}

export function getProcessLocal(key) {
    return getSavedItem(key);
}

export function getAllProcessesLocal(){
    return getAllProcessKeysLocal().map((key) => {
        return JSON.parse(localStorage.getItem(key));
    })
}

export function getAllRunningProcessesLocal(){
    return getAllProcessesLocal().filter((process) => process.status.toUpperCase() === "RUNNING"); // !process.resourceId);
}

export function getAllProcessKeysLocal() {
    return Object.keys(localStorage).filter((key) => {
        if(key !== "debug"){ // because there is default a value not in json format
            const storageItem = JSON.parse(localStorage.getItem(key));
            if(storageItem && storageItem.objectType === "process")
            return storageItem;
        }
    })
}

export async function setProcessKeyLocalAsync(id, key, value) {
    const process = Object.keys(localStorage).filter((key) => key === id);
    if(process.length > 0){
        try{
            const storageItem = JSON.parse(localStorage.getItem(process[0]));
            storageItem[key] = value;
            await removeHostLocal(id);
            await saveHostLocal(id, storageItem);
            return;
        } catch {
            console.log("Error while setting process key");
            return;
        }
    }
}