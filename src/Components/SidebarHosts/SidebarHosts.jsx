import './SidebarHosts.scss';
import {useState, useEffect, useCallback} from 'react';
import { FaRegWindowClose } from 'react-icons/fa';
import SidebarHostItem from './SidebarHostItem/SidebarHostItem';
import {getMinersLocal, getRepositoriesLocal, getServiceRegistriesLocal} from '../../Store/LocalDataStore';
import {PingServiceRegistry} from '../../Services/ServiceRegistryServices';
import {PingMiner} from '../../Services/MinerServices';
import {PingRepository} from '../../Services/RepositoryServices';
import IconizedButton from '../Widgets/Buttons/IconizedButton/IconizedButton';
import {FaPlus} from 'react-icons/fa';
import {BiTransfer} from 'react-icons/bi';

function SidebarHosts(props) {
    const {
        toggleSidebarHosts,
        openPopup,
        popups,
        removeHost,
        setComponentUpdaterFunction,
        setAllHostsStatus
    } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [, updateState] = useState();
    const [repositoryHosts, setRepositoryHosts] = useState([]);
    const [minerHosts, setMinerHosts] = useState([]);
    const [SRHosts, setSRHosts] = useState([]);
    const forceUpdate = useCallback(() =>{ 
        updateState({}); 
        setRepositoryHosts(getRepositoriesLocal());
        setMinerHosts(getMinersLocal());
        setSRHosts(getServiceRegistriesLocal());
        setAllHostsStatus(); // After ping, will update the collective status of all hosts. Affects sidebar
    }, []);
    

    useEffect(() => {
        setComponentUpdaterFunction("SidebarHosts", {update: forceUpdate});
        forceUpdate();
        setIsLoading(false);
        setAllHostsStatus();
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
                    <h2>Host configuration</h2>
                </strong>
                <div className='SidebarHosts-closeButton'>
                    <FaRegWindowClose onClick = {() => {toggleSidebarHosts()}}/>
                </div>
            </header>

            <IconizedButton
                text = {`Add new host`}
                icon = {<FaPlus/>}
                disabled = {false}
                className={``}
                onClick = {() => {openPopup(popups.AddNewHostPopup)}}
            />

            <IconizedButton
                text = {`Clone miner from host`}
                icon = {<BiTransfer/>}
                disabled = {false}
                className={``}
                onClick = {() => {openPopup(popups.ShadowPopup)}}
            />

            <div className='SidebarHosts-body'>
                <div className='SidebarHosts-section SidebarHosts-repository'>
                    <div className='SidebarHosts-hostheader'>
                        <h5>Repositories</h5>
                    </div>
                    <div className='SidebarHosts-hostsContainer'>
                        {repositoryHosts.map((repository, index) => {
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
                    <div className='SidebarHosts-hostheader'>
                        <h5>Miners</h5>
                    </div>

                    {minerHosts.map((miner, index) => {
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
                                hostProvidedValue = {miner.config.MinerLabel}
                            />)
                        // </>
                    })}
                </div>

                <div className='SidebarHosts-section SidebarHosts-serviceRegistry'>
                    <div className='SidebarHosts-hostheader'>
                        <h5>Service Registries</h5>
                    </div>

                    {SRHosts.map((serviceRegistry, index) => {
                        return (
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
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default SidebarHosts;
