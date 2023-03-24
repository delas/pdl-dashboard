// ---------------------- HOST STORAGE ----------------------

import { getFileExtension } from "../Utils/FileUnpackHelper";

export function saveHost(key, hostObject){
    
    localStorage.setItem(key, JSON.stringify(hostObject));
}

export function hostExits(url){
    const hostsWithSameUrl = Object.keys(localStorage).filter((key) => {
        if(key !== "debug"){ // because there is default a value not in json format
            const storageItem = JSON.parse(localStorage.getItem(key));
            if(storageItem !== null 
                && storageItem !== undefined
                && storageItem.name === url)
            return storageItem;
        }
    });
    return hostsWithSameUrl.length !== 0;
}

export function removeHost(key){
    removeItem(key);
}

export function getMiner(key) {
    return JSON.parse(localStorage.getItem(key));
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
            if(storageItem !== null 
                && storageItem !== undefined
                && storageItem?.type?.value === type)
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
    localStorage.setItem(key, JSON.stringify(file));
}

export function removeFile(key){
    removeItem(key);
}

export function getFile(key) {
    return JSON.parse(localStorage.getItem(key));
}

export function getAllFiles(){
    const fileKeys = Object.keys(localStorage).filter((key) => {
        if(key !== "debug"){ // because there is default a FileExtension not in json format
            const storageItem = JSON.parse(localStorage.getItem(key));
            if(storageItem !== null 
                && storageItem !== undefined
                && storageItem.ResourceId
                && getFileExtension(storageItem))
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
            if(storageItem !== null 
                && storageItem !== undefined
                && storageItem.FileExtension === type)
            return storageItem;
        }
    })
}