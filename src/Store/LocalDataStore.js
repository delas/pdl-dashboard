export function saveHost(key, hostObject){
    localStorage.setItem(key, JSON.stringify(hostObject));
}

export function removeHost(key){
    try{
        console.log(`remove item with key ${key}`);
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