import './SidebarHosts.scss';
import {useState, useEffect, useCallback} from 'react';
import { FaRegWindowClose } from 'react-icons/fa';
import SidebarHostItem from './SidebarHostItem/SidebarHostItem';
import {getMiners, getRepositories, getServiceRegistries} from '../../Store/LocalDataStore';
import {PingServiceRegistry} from '../../Services/ServiceRegistryServices';
import {PingMiner} from '../../Services/MinerServices';
import {PingRepository} from '../../Services/RepositoryServices';



function SidebarHosts(props) {
    const {
        toggleSidebarHosts,
        openPopup,
        popups,
        removeHost,
        setUpdateSidebarHosts
    } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(() => {
        setUpdateSidebarHosts({update: forceUpdate});
        setIsLoading(false);
    }, []);

    if(isLoading){
        return (
            <div className="SidebarHosts">
                <div>Loading ...</div>
            </div>
        )
    }

    const forceRerender = () => {
        forceUpdate({});
    }

    const removeHostAndUpdate = (id) => {
        removeHost(id);
        forceRerender();
    }

    return (
        <div className="SidebarHosts">

            <header className='SidebarHosts-Top'>
                <strong className='SidebarHosts-title'>
                    <h1>Host configuration</h1>
                </strong>
                <div className='SidebarHosts-closeButton'>
                    <FaRegWindowClose onClick = {() => {toggleSidebarHosts()}}/>
                </div>
            </header>
            <div className='SidebarHosts-body'>
                <div className='SidebarHosts-section SidebarHosts-repository'>
                    <h5>Repositories</h5>
                    <div className='SidebarHosts-hostsContainer'>
                        {getRepositories().map((repository, index) => {
                            return(
                            // <>
                                <SidebarHostItem key = {index}
                                    id = {repository.id}
                                    hostName = {repository.name}
                                    hostType = {repository.type}
                                    addedFrom = {repository.addedFrom}
                                    onRemove = {removeHostAndUpdate}
                                    ping = {PingRepository}
                                    openPopup = {openPopup}
                                    popups = {popups}
                                    status = {repository.status}
                                    allowClick = {repository.status === "online"}
                                    hostProvidedValue = {repository.config.Label}
                                />)
                            // </>)
                        })}
                        
                    </div>
                </div>

                <div className='SidebarHosts-section SidebarHosts-miner'>
                    <h5>Miners</h5>

                    {getMiners().map((miner, index) => {
                        return (
                        // <>
                            <SidebarHostItem key = {index}
                                id = {miner.id}
                                hostName = {miner.name}
                                hostType = {miner.type}
                                addedFrom = {miner.addedFrom}
                                onRemove = {removeHostAndUpdate}
                                ping = {PingMiner}
                                openPopup = {openPopup}
                                popups = {popups}
                                status = {miner.status}
                                allowClick = {miner.status === "online"}
                                hostProvidedValue = {miner.config.Label}
                            />)
                        // </>
                    })}
                </div>

                <div className='SidebarHosts-section SidebarHosts-serviceRegistry'>
                    <h5>Service Registries</h5>

                    {getServiceRegistries().map((serviceRegistry, index) => {
                        return (
                        // <>
                            <SidebarHostItem key = {index}
                                id = {serviceRegistry.id}
                                hostName = {serviceRegistry.name}
                                hostType = {serviceRegistry.type}
                                addedFrom = {serviceRegistry.addedFrom}
                                onRemove = {removeHostAndUpdate}
                                ping = {PingServiceRegistry}
                                openPopup = {openPopup}
                                popups = {popups}
                                status = {serviceRegistry.status}
                                allowClick = {serviceRegistry.status === "online"}
                            />
                            // </>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default SidebarHosts;
