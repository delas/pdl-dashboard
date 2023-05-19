import { PingMiner, GetMinerActionProcessStatus, GetMinerConfig, GetMinerShadowProcessStatus } from '../Services/MinerServices';
import { PingRepository, GetSingleFileMetadata, GetRepositoryConfig } from '../Services/RepositoryServices';
import { PingServiceRegistry, PingConnectedFilters, GetConfigFromServiceRegistry } from '../Services/ServiceRegistryServices';
import { 
    getAllHostAddedFromServiceRegistry, 
    getServiceRegistriesLocal, 
    setHostStatusLocal, 
    getAllRunningActionProcessesLocal, 
    setProcessKeyLocalAsync, 
    getAllShadowProcessesLocal,
    getAllRunningShadowProcessesLocal,
    getAllHostLocallyAdded, 
    getProcessLocal, 
    getFileLocal, 
    getRepositoriesLocal, 
    getMinersLocal,
    saveHostLocal,
    removeProcessLocal,
} from '../Store/LocalDataStore';
import { getFileResourceId } from './FileUnpackHelper';
import {msToTime} from './Utils';

export async function pingAllAddedServices() {
    pingAllLocallyAddedServices();
    pingAllServicesAddedFromServicesRegistry();
}

function pingAllServicesAddedFromServicesRegistry(){
    getServiceRegistriesLocal().forEach(SR => { // for each service registry
        const filters = getAllHostAddedFromServiceRegistry(SR.name).map(host => { // get all hosts added from that service registry
            return host.name;
        })
        if(filters.length > 0)
        PingConnectedFilters(SR.name, filters) // ping all hosts added from that service registry
            .then((res) => {
                if(res.status !== 200) return;
                res.data.forEach(host => { // for each hostStatus {name: host.net.com, status: bool} in the response
                    const localHost = getAllHostAddedFromServiceRegistry(SR.name).find(localHost => localHost.name === host.host);
                    setHostStatusLocal(localHost.id, host.status ? "online" : "offline"); // set status of host
                });
            }).catch(() => {
                console.log("Failed to ping connected filters");
                getAllHostAddedFromServiceRegistry(SR.name).forEach(host => { // if failed to ping connected filters, set all hosts added from that service registry to offline
                    setHostStatusLocal(host.id, "offline");
                });
            });
    })
}

function pingAllLocallyAddedServices() {
    getAllHostLocallyAdded().forEach(host => { // for each host added locally
        switch(host.type.value){
            case "miner":
                PingMiner(host.name).then((res) =>{ // ping miner
                    const status = res.status === 200 && res.data.toUpperCase() === "PONG";
                    setHostStatusLocal(host.id, status ? "online" : "offline"); // set status of miner
                }).catch((e) => {
                    setHostStatusLocal(host.id, "offline"); // if failed to ping miner, set status to offline
                    console.log(`Failed to connect to miner ${host.name} with error: ${e}`)
                });
                break;
            case "repository":
                PingRepository(host.name).then((res) =>{
                    const status = res.status === 200 && res.data.toUpperCase() === "PONG";
                    setHostStatusLocal(host.id, status ? "online" : "offline");
                }).catch((e) => {
                    setHostStatusLocal(host.id, "offline");
                    console.log(`Failed to connect to repository ${host.name} with error: ${e}`)
                });
                break;
            case "service registry":
                PingServiceRegistry(host.name).then((res) =>{
                    const status = res.status === 200 && res.data.toUpperCase() === "PONG";
                    setHostStatusLocal(host.id, status ? "online" : "offline");
                }).catch((e) => {
                    setHostStatusLocal(host.id, "offline");
                    console.log(`Failed to connect to service registry ${host.name} with error: ${e}`)
                });
                break;
            default:
                break;
        }
    });
}

export async function pingAllActionProcesses(getAndAddFile) {
    getAllRunningActionProcessesLocal().forEach((process) => {
        GetMinerActionProcessStatus(process.hostname, process.processId)
            .then(async res => {
                if(res?.data?.ProcessStatus) { // Update status
                    const result = res.data;
                    await setProcessKeyLocalAsync(process.id, "status", result.ProcessStatus);
                    process = getProcessLocal(process.id); // get updated process
                    if(res?.data?.Error){
                        alert(`An error has occured: ${res?.data?.Error}`);
                        setProcessKeyLocalAsync(process.id, "error", res?.data?.Error);
                        return;
                    }
                    if(process.saveOrUpdateFile && !process.resourceId && res?.data?.ResourceId && !res?.data?.Error){
                        tryGetAndSaveMetadataFromProcess(process, res?.data?.ResourceId, getAndAddFile); // get metadata and save file
                    }
                    await updateActionProcessKeys(process, result); // Update progress, endTime, saveOrUpdateFile, error
                }
            })
            .catch(e => {
                setProcessKeyLocalAsync(process.id, "status", "Stopped");
                setProcessKeyLocalAsync(process.id, "error", e);
            })
    })
}


const updateActionProcessKeys = async (process, result) => {
    switch(result.ProcessStatus?.toUpperCase()){
        case "RUNNING":
            await setProcessKeyLocalAsync(process.id, "progress", msToTime(new Date().getTime() - process.startTime))
            break;
        case "COMPLETE":
            await setProcessKeyLocalAsync(process.id, "saveOrUpdateFile", false);
            await setProcessKeyLocalAsync(process.id, "endTime", new Date().getTime());
            await setProcessKeyLocalAsync(process.id, "progress", msToTime(new Date().getTime() - process.startTime));
            break;
        case "CRASH":
            await setProcessKeyLocalAsync(process.id, "saveOrUpdateFile", false);
            await setProcessKeyLocalAsync(process.id, "endTime", new Date().getTime());
            await setProcessKeyLocalAsync(process.id, "progress", msToTime(new Date().getTime() - process.startTime));
            await setProcessKeyLocalAsync(process.id, "error", result.Error);
            break;
        case "STOPPED":
            await setProcessKeyLocalAsync(process.id, "saveOrUpdateFile", false);
            await setProcessKeyLocalAsync(process.id, "endTime", new Date().getTime());
            await setProcessKeyLocalAsync(process.id, "progress", msToTime(new Date().getTime() - process.startTime));
            break;
        default:
            await setProcessKeyLocalAsync(process.id, "progress", 0);
            break;
    }
}

export async function pingAllShadowProcesses(addOrUpdateHost, openInformationPrompt) {
    getAllRunningShadowProcessesLocal().forEach((process) => {
        GetMinerShadowProcessStatus(process.hostname, process.processId)
            .then(async res => {
                if(res?.data) { // Update status
                    const result = res.data;
                    await setProcessKeyLocalAsync(process.id, "status", result);
                    process = getProcessLocal(process.id);
                    if(result && typeof result === "string" && result.toUpperCase() === "COMPLETE"){ // TODO: some completion condition
                        GetMinerConfig(process.hostname)
                            .then(() => {addOrUpdateHost(process.hostname, process.minerType.value, process.addedFrom, process.minerId, "online")})
                            .then(() => {
                                openInformationPrompt({
                                    title: "Shadow process completed",
                                    text: `Cloning completed for ${process.hostname} "${process.processName}" in ${msToTime(new Date().getTime() - process.startTime)}`,
                                    setTimeoutClose: true,
                                    closeButtonText: "close",
                                    disabled: false,
                                })
                                removeProcessLocal(process.id);
                            })
                            .catch((err) => {
                                openInformationPrompt({
                                    title: "Shadow process failed",
                                    text: `Cloning successful. Failed to get config for ${process.hostname}. Try to refresh your browser. Error: ${err}`,
                                    setTimeoutClose: false,
                                    closeButtonText: "close",
                                    disabled: false,
                                })
                                removeProcessLocal(process.id);
                            });
                    }
                    if(result && typeof result === "string" && result.toUpperCase() === "CRASH"){
                        openInformationPrompt({
                            title: "Shadow process crash",
                            text: `Cloning crashed for ${process.hostname} "${process.processName}" after ${msToTime(new Date().getTime() - process.startTime)}`,
                            setTimeoutClose: false,
                            closeButtonText: "close",
                            disabled: false,
                        })
                        removeProcessLocal(process.id);
                    }
                }
            })
            .catch(e => {
                setProcessKeyLocalAsync(process.id, "status", "Stopped");
                openInformationPrompt({
                    title: "Shadow process failed",
                    text: `Cloning failed for "${process.hostname} ${process.processName}" after ${msToTime(new Date().getTime() - process.startTime)} with error: ${e}`,
                    setTimeoutClose: false,
                    closeButtonText: "close",
                    disabled: false,
                })
                setProcessKeyLocalAsync(process.id, "error", e);
            })
    })
}

const tryGetAndSaveMetadataFromProcess = (process, resourceId, getAndAddFile) => {
    GetSingleFileMetadata(process.outputDestination, resourceId)
        .then(async (res) => {
            if(res?.data){
                const metadata = res.data;
                const resourceId = getFileResourceId(metadata);
                await setProcessKeyLocalAsync(process.id, "resourceId", resourceId)
                metadata["processId"] = process.id;
                metadata["repositoryUrl"] = process.outputDestination;
                setTimeout(() => {
                    getAndAddFile(metadata);
                }, 3000);
            }
        })
        .catch(async () => {
            setProcessKeyLocalAsync(process.id, "saveOrUpdateFile", false).then(() => {
                const newResourceId = getFileResourceId(resourceId);
                const metadata = newResourceId ? getFileLocal(newResourceId) : {};
                metadata["processId"] = process.id;
                metadata["repositoryUrl"] = process.outputDestination;
                if(metadata) {
                    getAndAddFile(metadata, true);
                }
                alert(`Failed to get file: ${process.error}`);
            });
        })
}

export const getAndSaveAllHostConfig = () => {
    const miners = getMinersLocal();
    const repositories = getRepositoriesLocal();
    const serviceRegistries = getServiceRegistriesLocal();
    getLocallyAddedHostConfig(miners, repositories);
    getServiceRegistriesHostConfig(serviceRegistries);
}

const getLocallyAddedHostConfig = (miners, repositories) => {
    miners.filter(miner => miner.addedFrom === "locally").forEach((miner) => {
        addOrUpdateHostDirect(miner.id, miner);
    });
    repositories.filter(repository => repository.addedFrom === "locally").forEach((repository) => {
        addOrUpdateHostDirect(repository.id, repository);
    });
}

const getServiceRegistriesHostConfig = (serviceRegistries) => {
    serviceRegistries.forEach((SR) => {
        const hostsFromSR = getAllHostAddedFromServiceRegistry(SR.name);
        const hostUrlsFromSR = hostsFromSR.map((host) => host.name);
        if(hostUrlsFromSR.length > 0)
        GetConfigFromServiceRegistry(SR.name, hostUrlsFromSR).then((res) => {
            const configList = res.data; // list of config objects [{host: "hostUrl", config: "config"}, {host: "hostUrl", config: "config"}...]
            hostsFromSR.forEach((host) => {
                const configObj = configList.find((configObj) => configObj.host === host.name);
                if(configObj){
                    host.config = configObj.config;
                    saveHostLocal(host.id, host);
                }
            });
        });
    });
}

const addOrUpdateHostDirect = (id, host) => {
    handleAddHostOfType(host.type.value, host.name).then((res) => {
        host.config = res?.data;
        saveHostLocal(id, host);
    })
}

const handleAddHostOfType = async (type, hostname) => {
    switch(type){
        case 'miner': return GetMinerConfig(hostname)
        case 'repository': return GetRepositoryConfig(hostname)
        case 'service registry': return null;
        default: return null;
    }
}

