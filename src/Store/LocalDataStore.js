import { getFileExtension } from "../Utils/FileUnpackHelper";
// ---------------------- Default utils ----------------------
const setSavedItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const getSavedItem = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

const removeSavedResource = (key) => {
    try{
        localStorage.removeItem(key);
    }
    catch(e) {
        console.log(e);
    }
}


// ---------------------- HOST STORAGE ----------------------
export function saveHost(key, hostObject){
    setSavedItem(key, hostObject);
}

export function hostExits(url){
    const hostsWithSameUrl = Object.keys(localStorage).filter((key) => {
        if(key !== "debug"){ // because there is default a value not in json format
            const storageItem = JSON.parse(localStorage.getItem(key));
            if(storageItem && storageItem.name === url)
            return storageItem;
        }
    });
    return hostsWithSameUrl.length !== 0;
}

export function removeHost(key){
    removeSavedResource(key);
}

export function getMiner(key) {
    return getSavedItem(key);
}

export function getMiners(){
    return getAllType("miner");
}

export function getRepositories(){
    return getAllType("repository");
}

export function getServiceRegistries(){
    return getAllType("service registry");
}

export function getAllStatus() {
    const minerStatus = getMiners().map((miner) => {
        return miner.status;
    });
    const repositoryStatus = getRepositories().map((repository) => {
        return repository.status;
    });
    const SRstatus = getServiceRegistries().map((serviceRegistry) => {
        return serviceRegistry.status;
    });
    return [...minerStatus, ...repositoryStatus, ...SRstatus];
}

export function setStatus(id, status) {
    const host = Object.keys(localStorage).filter((key) => key === id);
    if(host.length > 0){
        const storageItem = JSON.parse(localStorage.getItem(host[0]));
        storageItem.status = status;
        removeHost(id);
        saveHost(id, storageItem);
    }
}

function getAllType(type) { //Types ["miner", "repository", "service registry"]
    return getAllKeysWithType(type).map((key) => {
        return JSON.parse(localStorage.getItem(key));
    })
}

function getAllKeysWithType(type) {
    return Object.keys(localStorage).filter((key) => {
        if(key !== "debug"){ // because there is default a value not in json format
            const storageItem = JSON.parse(localStorage.getItem(key));
            if(storageItem && storageItem?.type?.value === type)
            return storageItem;
        }
    })
}

export function removeItem(key){
    try{
        localStorage.removeItem(key);
    }
    catch(e) {
        console.log(e);
    }
}

// ---------------------- FILE STORAGE ----------------------

export function saveFile(key, file) {
    setSavedItem(key, file);
}

export function removeFile(key){
    removeSavedResource(key);
}

export function getFile(key) {
    return getSavedItem(key);
}

export function getAllFiles(){
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

export function getFilesOfType(type) {
    return GetAllFileOfType(type);
}

function GetAllFileOfType(type) { //Types ["PNML", "PNG", "BPMN"...]
    return getAllFileKeysWithType(type).map((key) => {
        return JSON.parse(localStorage.getItem(key));
    })
}

function getAllFileKeysWithType(type) {
    return Object.keys(localStorage).filter((key) => {
        if(key !== "debug"){ // because there is default a FileExtension not in json format
            const storageItem = JSON.parse(localStorage.getItem(key));
            if(storageItem && storageItem.FileExtension === type)
            return storageItem;
        }
    })
}

// ---------------------- PROCESS STORAGE ----------------------
export function saveProcess(process){
    setSavedItem(process.id, process);
}

export function removeProcess(key){
    removeSavedResource(key);
}

export function getProcess(key) {
    return getSavedItem(key);
}

export function getAllProcesses(){
    return getAllProcessKeys().map((key) => {
        return JSON.parse(localStorage.getItem(key));
    })
}

export function getAllRunningProcesses(){
    return getAllProcesses().filter((process) => process.status.toUpperCase() === "RUNNING");
}

export function getAllProcessKeys() {
    return Object.keys(localStorage).filter((key) => {
        if(key !== "debug"){ // because there is default a value not in json format
            const storageItem = JSON.parse(localStorage.getItem(key));
            if(storageItem && storageItem.objectType === "process")
            return storageItem;
        }
    })
}

export function setProcessKey(id, key, value) {
    const process = Object.keys(localStorage).filter((key) => key === id);
    if(process.length > 0){
        try{
            const storageItem = JSON.parse(localStorage.getItem(process[0]));
            storageItem[key] = value;
            removeHost(id);
            saveHost(id, storageItem);
        } catch {
            console.log("Error while setting process key");
        }
    }
}