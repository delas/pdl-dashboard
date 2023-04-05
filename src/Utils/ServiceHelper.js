import { set } from 'immutable';
import { PingMiner, GetMinerProcessStatus } from '../Services/MinerServices';
import { PingRepository } from '../Services/RepositoryServices';
import { PingServiceRegistry } from '../Services/ServiceRegistryServices';
import { getMiners, getRepositories, getServiceRegistries, setStatus, getAllRunningProcesses, setProcessKey } from '../Store/LocalDataStore';

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

export async function pingAllProcesses() {
    getAllRunningProcesses().forEach((process) => {
        GetMinerProcessStatus(process.hostname, process.processId)
            .then(res => {
                if(res?.data?.ProcessStatus) // Update status
                setProcessKey(process.id, "status", res?.data?.ProcessStatus);

                switch(res?.data?.ProcessStatus?.toUpperCase()){
                    case "RUNNING":
                        setProcessKey(process.id, "progress", (new Date().getTime() - process.startTime.getTime()) / 1000);
                        break;
                    case "COMPLETE":
                        setProcessKey(process.id, "progress", process.duration);
                        setProcessKey(process.id, "endTime", new Date());
                        break;
                    case "CRASH":
                        setProcessKey(process.id, "progress", process.duration);
                        setProcessKey(process.id, "error", res?.data?.Error);
                        break;
                    default:
                        setProcessKey(process.id, "progress", 0);
                        break;
                }
            })
            .catch(e => {
                setProcessKey(process.id, "status", "Stopped");
                setProcessKey(process.id, "error", e);
            })
    })
}