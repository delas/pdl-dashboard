import { PingMiner, GetMinerProcessStatus } from '../Services/MinerServices';
import { PingRepository, GetSingleFileMetadata } from '../Services/RepositoryServices';
import { PingServiceRegistry } from '../Services/ServiceRegistryServices';
import { getMiners, getRepositories, getServiceRegistries, setStatus, getAllRunningProcesses, setProcessKey, getAllFiles } from '../Store/LocalDataStore';
import { getFileDynamic, getFileResourceId } from './FileUnpackHelper';
import {msToTime} from './Utils';

export async function pingAllAddedServices() {
    getMiners().forEach(miner => {
        PingMiner(miner.name).then((res) =>{
            const status = res.status === 200 && res.data.toUpperCase() === "PONG";
            setStatus(miner.id, status ? "online" : "offline");
        }).catch((e) => {
            setStatus(miner.id, "offline");
            console.log(`Failed to connect to miner ${miner.name} with error: ${e}`)
        });
    });
    getRepositories().forEach(repository => {
        PingRepository(repository.name).then((res) =>{
            const status = res.status === 200 && res.data.toUpperCase() === "PONG";
            setStatus(repository.id, status ? "online" : "offline");
        }).catch((e) => {
            setStatus(repository.id, "offline");
            console.log(`Failed to connect to repository ${repository.name} with error: ${e}`)
        });
    })
    getServiceRegistries().forEach(SR => {
        PingServiceRegistry(SR.name).then((res) =>{
            const status = res.status === 200 && res.data.toUpperCase() === "PONG";
            setStatus(SR.id, status ? "online" : "offline");
        }).catch((e) => {
            setStatus(SR.id, "offline");
            console.log(`Failed to connect to service registry ${SR.name} with error: ${e}`)
        });
    })
}

export async function pingAllProcesses(getAndAddFile) {
    getAllRunningProcesses();
    getAllRunningProcesses().forEach((process) => {
        GetMinerProcessStatus(process.hostname, process.processId)
            .then(res => {
                if(res?.data?.ProcessStatus) { // Update status
                    setProcessKey(process.id, "status", res?.data?.ProcessStatus);

                    switch(res.data.ProcessStatus?.toUpperCase()){
                        case "RUNNING":
                            setProcessKey(process.id, "progress", msToTime(new Date().getTime() - process.startTime))
                            break;
                        case "COMPLETE":
                            const newEndTime = new Date().getTime();
                            setProcessKey(process.id, "endTime", newEndTime);
                            setProcessKey(process.id, "progress", msToTime(newEndTime - process.startTime));
                            break;
                        case "CRASH":
                            setProcessKey(process.id, "endTime", new Date());
                            setProcessKey(process.id, "progress", process.duration);
                            setProcessKey(process.id, "error", res?.data?.Error);
                            break;
                        default:
                            setProcessKey(process.id, "progress", 0);
                            break;
                    }

                    if(res?.data?.ResourceId){
                        GetSingleFileMetadata(process.outputDestination, res?.data?.ResourceId)
                            .then((res) => {
                                const resourceId = getFileResourceId(res?.data);
                                setProcessKey(process.id, "resourceId", resourceId);
                                getAndAddFile(res?.data);
                            })
                            .catch(() => {
                                alert("Failed to get file");
                            })
                    }
                }
            })
            .catch(e => {
                setProcessKey(process.id, "status", "Stopped");
                setProcessKey(process.id, "error", e);
            })
    })
}

export async function getAllDynamicResources(getAndAddFile) {
    getAllFiles().filter(file => {
        return getFileDynamic(file); 
    }).forEach(file => {
        getAndAddFile(file);
    })
}