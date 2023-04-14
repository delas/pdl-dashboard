import { PingMiner, GetMinerProcessStatus } from '../Services/MinerServices';
import { PingRepository, GetSingleFileMetadata } from '../Services/RepositoryServices';
import { PingServiceRegistry, PingConnectedFilters } from '../Services/ServiceRegistryServices';
import { getAllHostAddedFromServiceRegistry, getServiceRegistriesLocal, setHostStatusLocal, getAllRunningProcessesLocal, setProcessKeyLocalAsync, getAllHostLocallyAdded, getProcessLocal, getFileLocal } from '../Store/LocalDataStore';
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
        PingConnectedFilters(SR.name, filters) // ping all hosts added from that service registry
            .then((res) => {
                if(res.status !== 200) return;
                res.data.forEach(host => { // for each hostStatus {name: host.net.com, status: bool} in the response
                    const localHost = getAllHostAddedFromServiceRegistry(SR.name).find(localHost => localHost.name = host.host);
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
    getAllHostLocallyAdded().forEach(host => {
        switch(host.type.value){
            case "miner":
                PingMiner(host.name).then((res) =>{
                    const status = res.status === 200 && res.data.toUpperCase() === "PONG";
                    setHostStatusLocal(host.id, status ? "online" : "offline");
                }).catch((e) => {
                    setHostStatusLocal(host.id, "offline");
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
