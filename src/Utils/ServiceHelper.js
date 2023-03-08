import { PingMiner } from '../Services/MinerServices';
import { PingRepository } from '../Services/RepositoryServices';
import { PingServiceRegistry } from '../Services/ServiceRegistryServices';
import { getMiners, getRepositories, getServiceRegistries, setStatus } from '../Store/LocalDataStore';

export async function pingAllAddedServices() {
    console.log("running all ping");
    getMiners().forEach(miner => {
        PingMiner(miner.name).then((res) =>{
            const status = res.status === 200 && res.data.toUpperCase() === "PONG";
            setStatus(miner.id, status ? "online" : "offline");
        }).catch(() => {
            setStatus(miner.id, "offline");
        });
    });
    getRepositories().forEach(repository => {
        PingRepository(repository.name).then((res) =>{
            const status = res.status === 200 && res.data.toUpperCase() === "PONG";
            setStatus(repository.id, status ? "online" : "offline");
        }).catch(() => {
            setStatus(repository.id, "offline");
        });
    })
    getServiceRegistries().forEach(SR => {
        PingServiceRegistry(SR.name).then((res) =>{
            const status = res.status === 200 && res.data.toUpperCase() === "PONG";
            setStatus(SR.id, status ? "online" : "offline");
        }).catch(() => {
            setStatus(SR.id, "offline");
        });
    })
}