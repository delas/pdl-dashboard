import { PingMiner, GetMinerProcessStatus } from '../Services/MinerServices';
import { PingRepository, GetSingleFileMetadata } from '../Services/RepositoryServices';
import { PingServiceRegistry } from '../Services/ServiceRegistryServices';
import { getMinersLocal, getRepositoriesLocal, getServiceRegistriesLocal, setHostStatusLocal, getAllRunningProcessesLocal, setProcessKeyLocal, getAllFilesLocal, getProcessLocal } from '../Store/LocalDataStore';
import { getFileDynamic, getFileHost, getFileResourceId } from './FileUnpackHelper';
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
            .then(res => {
                if(res?.data?.ProcessStatus) { // Update status
                    const result = res.data;
                    setProcessKeyLocal(process.id, "status", result.ProcessStatus);

                    switch(result.ProcessStatus?.toUpperCase()){
                        case "RUNNING":
                            setProcessKeyLocal(process.id, "progress", msToTime(new Date().getTime() - process.startTime))
                            break;
                        case "COMPLETE":
                            const newEndTime = new Date().getTime();
                            setProcessKeyLocal(process.id, "endTime", newEndTime);
                            setProcessKeyLocal(process.id, "progress", msToTime(newEndTime - process.startTime));
                            break;
                        case "CRASH":
                            setProcessKeyLocal(process.id, "endTime", new Date());
                            setProcessKeyLocal(process.id, "progress", process.duration);
                            setProcessKeyLocal(process.id, "error", result.Error);
                            break;
                        default:
                            setProcessKeyLocal(process.id, "progress", 0);
                            break;
                    }

                    if(process.saveOrUpdateFile && res?.data?.ResourceId){
                        GetSingleFileMetadata(process.outputDestination, res?.data?.ResourceId)
                            .then((res) => {
                                if(res?.data){
                                    const metadata = res.data;
                                    const resourceId = getFileResourceId(metadata);
                                    setProcessKeyLocal(process.id, "resourceId", resourceId);
                                    metadata["processId"] = process.id;
                                    getAndAddFile(metadata);
                                }
                            })
                            .catch(() => {
                                alert("Failed to get file");
                            })
                    }
                }
            })
            .catch(e => {
                setProcessKeyLocal(process.id, "status", "Stopped");
                setProcessKeyLocal(process.id, "error", e);
            })
    })
}

export async function getAllDynamicResources(getAndAddFile) {
    const files = getAllFilesLocal();
    if(files.length > 0)
    files.filter(file => {
        return getFileDynamic(file); 
    }).forEach(file => {
        GetSingleFileMetadata(getFileHost(file), getFileResourceId(file)).then((res) => {
            if(res?.data) {
                getAndAddFile(res?.data);
            }
            // if(getProcess(file.processId)) 
        }).catch(() => {
            alert("Failed to get file");
        });
    })
}