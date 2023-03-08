export function saveHost(key, hostObject){
    localStorage.setItem(key, JSON.stringify(hostObject));
}

export function removeHost(key){
    try{
        localStorage.removeItem(key);
    }
    catch(e) {
        console.log(e);
    }
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
                && storageItem.type === type)
            return storageItem;
        }
    })
}