import { PingMiner } from '../Services/MinerServices';
import { PingRepository } from '../Services/RepositoryServices';
import { PingServiceRegistry } from '../Services/ServiceRegistryServices';
import { getMiners, getRepositories, getServiceRegistries, setStatus } from '../Store/LocalDataStore';

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