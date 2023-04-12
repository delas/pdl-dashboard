import { PingMiner, GetMinerProcessStatus } from '../Services/MinerServices';
import { PingRepository, GetSingleFileMetadata } from '../Services/RepositoryServices';
import { PingServiceRegistry } from '../Services/ServiceRegistryServices';
import { getMinersLocal, getRepositoriesLocal, getServiceRegistriesLocal, setHostStatusLocal, getAllRunningProcessesLocal, setProcessKeyLocalAsync, getAllFilesLocal, getProcessLocal, getFileLocal } from '../Store/LocalDataStore';
import { getFileDynamic, getFileHost, getFileProcessId, getFileResourceId } from './FileUnpackHelper';
import {msToTime} from './Utils';

export async function pingAllAddedServices() {
    getMinersLocal().forEach(miner => {
        PingMiner(miner.name).then((res) =>{
            const status = res.status === 200 && res.data.toUpperCase() === "PONG";
            setHostStatusLocal(miner.id, status ? "online" : "offline");
        }).catch((e) => {
            setHostStatusLocal(miner.id, "offline");
            console.log(`Failed to connect to miner ${miner.name} with error: ${e}`)
        });
    });
    getRepositoriesLocal().forEach(repository => {
        PingRepository(repository.name).then((res) =>{
            const status = res.status === 200 && res.data.toUpperCase() === "PONG";
            setHostStatusLocal(repository.id, status ? "online" : "offline");
        }).catch((e) => {
            setHostStatusLocal(repository.id, "offline");
            console.log(`Failed to connect to repository ${repository.name} with error: ${e}`)
        });
    })
    getServiceRegistriesLocal().forEach(SR => {
        PingServiceRegistry(SR.name).then((res) =>{
            const status = res.status === 200 && res.data.toUpperCase() === "PONG";
            setHostStatusLocal(SR.id, status ? "online" : "offline");
        }).catch((e) => {
            setHostStatusLocal(SR.id, "offline");
            console.log(`Failed to connect to service registry ${SR.name} with error: ${e}`)
        });
    })
}

export async function pingAllProcesses(getAndAddFile) {
    getAllRunningProcessesLocal();
    getAllRunningProcessesLocal().forEach((process) => {
        GetMinerProcessStatus(process.hostname, process.processId)
            .then(async res => {
                if(res?.data?.ProcessStatus) { // Update status
                    const result = res.data;
                    await setProcessKeyLocalAsync(process.id, "status", result.ProcessStatus);

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
                        default:
                            await setProcessKeyLocalAsync(process.id, "progress", 0);
                            break;
                    }
                    
                    process = getProcessLocal(process.id);

                    if(res?.data?.Error){
                        alert(`An error has occured: ${res?.data?.Error}`);
                        return;
                    }

                    if(process.saveOrUpdateFile && res?.data?.ResourceId && !res?.data?.Error){
                        GetSingleFileMetadata(process.outputDestination, res?.data?.ResourceId)
                            .then(async (res) => {
                                if(res?.data){
                                    const metadata = res.data;
                                    const resourceId = getFileResourceId(metadata);
                                    await setProcessKeyLocalAsync(process.id, "resourceId", resourceId)
                                    metadata["processId"] = process.id;
                                    getAndAddFile(metadata);
                                }
                            })
                            .catch(async () => {
                                setProcessKeyLocalAsync(process.id, "saveOrUpdateFile", false).then(() => {
                                    const resourceId = getFileResourceId(res?.data?.ResourceId);
                                    const metadata = resourceId ? getFileLocal(resourceId) : null;
                                    if(metadata) {
                                        getAndAddFile(metadata, true);
                                    }
                                    alert(`Failed to get file: ${process.error}`);
                                });
                            })
                    }
                }
            })
            .catch(e => {
                setProcessKeyLocalAsync(process.id, "status", "Stopped");
                setProcessKeyLocalAsync(process.id, "error", e);
            })
    })
}

// export async function getAllDynamicResources(getAndAddFile) {
    // const files = getAllFilesLocal();
    // if(files.length > 0)
    // files.filter(file => {
    //     return getFileDynamic(file); 
    // }).forEach(file => {
    //     if(!getProcessLocal(getFileProcessId(file)).saveOrUpdateFile) return;
    //     GetSingleFileMetadata(getFileHost(file), getFileResourceId(file)).then((res) => {
    //         if(res?.data) {
    //             getAndAddFile(res?.data);
    //         }
    //     }).catch(async () => {
    //         setProcessKeyLocalAsync(getFileProcessId(file), "saveOrUpdateFile", false).then(() => {
    //             const resourceId = getFileResourceId(file);
    //             const metadata = resourceId ? getFileLocal(resourceId) : null;
    //             if(metadata) {
    //                 getAndAddFile(metadata, true);
    //             }
    //             alert("Failed to get file 1");
    //         });
    //     });
    // })
// }