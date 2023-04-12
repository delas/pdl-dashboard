import './AddNewHostFromServiceRegistryPopup.scss';
import {useState, useEffect} from 'react';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import {v4 as uuidv4} from 'uuid';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import SidebarHostItem from '../../SidebarHosts/SidebarHostItem/SidebarHostItem';
import {GetMinersFromServiceRegistry, GetRepositoriesFromServiceRegistry} from '../../../Services/ServiceRegistryServices';
import Popup from '../../Widgets/Popup/Popup';
import { getMinersLocal, getRepositoriesLocal } from '../../../Store/LocalDataStore';

function AddNewHostFromServiceRegistryPopup(props) {

    const {
        togglenewHostFromSRPopupOpen,
        serviceRegistry = {},
        addHost,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [minerHostsSelected, setMinerHostsSelected] = useState([]);
    const [repositoryHostsSelected, setRepositoryHostsSelected] = useState([]);
    const [miners, setMiners] = useState(null);
    const [repositories, setRepositories] = useState(null);
    const [minersDropdownFormat, setMinersDropdownFormat] = useState(null);
    const [repositoriesDropdownFormat, setRepositoriesDropdownFormat] = useState(null);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const handleSubmit = () => {
        minerHostsSelected.forEach((miner) => {
            const newHost = {
                id: uuidv4(),
                name: miner.label,
                status: "offline",
                type: {label: miner.value, value: miner.value},
                addedFrom: serviceRegistry.label,
            };
            addHost(newHost.id, newHost);
        });

        repositoryHostsSelected.forEach((repository) => {
            const newHost = {
                id: uuidv4(),
                name: repository.label,
                status: "offline",
                type: {label: repository.value, value: repository.value},
                addedFrom: serviceRegistry.label,
            };
            addHost(newHost.id, newHost);
        });
    }

    const handleNextConfirmDisabled = () => {
        return (minerHostsSelected.length === 0 && repositoryHostsSelected.length === 0);
    }

    const addMinerHost = (miner) => {
        setMinerHostsSelected(minerHostsSelected.concat(miner));
    }

    const addRepositoryHost = (repository) => {
        setRepositoryHostsSelected(repositoryHostsSelected.concat(repository));
    }

    const removeMinerHost = (hostLabel) => {
        setMinerHostsSelected(minerHostsSelected.filter(listItem => listItem.label!== hostLabel));
    }

    const removeRepositoryHost = (hostLabel) => {
        setRepositoryHostsSelected(repositoryHostsSelected.filter(listItem => listItem.label !== hostLabel));
    }

    const onConfirmClick = () => {
        handleSubmit();
        togglenewHostFromSRPopupOpen();
    }

    useEffect(() => {
        GetMinersFromServiceRegistry(serviceRegistry.label).then(res => setMiners(res.data) )
        GetRepositoriesFromServiceRegistry(serviceRegistry.label).then(res => setRepositories(res.data) )
    }, []);

    const createAndSetHostDropdownLists = () => {
        if(miners !== null) {
            const nonSelectedMiners = miners
            .filter((miner) => { // Filter out miners that are already selected
                return !minerHostsSelected.find((selectedMiner) => {
                    return selectedMiner.label === miner.HostName;
                });
            }).filter((miner) => { // Filter out miners that are already added
                return !getMinersLocal().find((localMiner) => {
                    return localMiner.name === miner.HostName;
                });
            });

            setMinersDropdownFormat(nonSelectedMiners.map((miner) => {
                return( {label: `${miner.HostName}`, value: "miner"} )
            }));
        }

        if(repositories !== null) {
            const nonSelectedRepositories = repositories
            .filter((repository) => { // Filter out repositories that are already selected
                return !repositoryHostsSelected.find((selectedRepository) => {
                    return selectedRepository.label === repository.HostName;
                });
            }).filter((repository) => { // Filter out repositories that are already added
                return !getRepositoriesLocal().find((localRepository) => {
                    return localRepository.name === repository.HostName;
                });
            });

            setRepositoriesDropdownFormat(nonSelectedRepositories.map((repository) => {
                return( {label: `${repository.HostName}`, value: "repository"} )
            }));
        }
    }

    useEffect(() => {
        createAndSetHostDropdownLists();
    }, [miners, repositories, minerHostsSelected, repositoryHostsSelected])

    if(isLoading){
        return (
            <div className="AddNewHostFromServiceRegistryPopup">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <BackdropModal closeModal = {togglenewHostFromSRPopupOpen}>
            <Popup
                title = {`Add new host from service registry: ${serviceRegistry.label}`}
                closePopup = {togglenewHostFromSRPopupOpen}
                onCancelClick = {togglenewHostFromSRPopupOpen}
                onNextClick = {onConfirmClick}
                cancelText = {`Cancel`}
                nextText = {`Add selected`}
                nextButtonDisabled = {handleNextConfirmDisabled()}
            >

                <div className='AddNewHostFromServiceRegistryPopup-body'>
                    <div className='AddNewHostFromServiceRegistryPopup-body-miners'>
                        <Dropdown
                            options = {minersDropdownFormat}
                            onValueChange = {addMinerHost}
                            label = {`Miners:`}
                            loading = {minersDropdownFormat === null}
                        />
                        <div className='AddNewHostFromServiceRegistryPopup-body-miners-bottom'>
                            <span className='AddNewHostFromServiceRegistryPopup-body-right-miners-Title'>
                                Selected Miners: 
                            </span>
                            <div className='AddNewHostFromServiceRegistryPopup-body-right-miners-list'>
                                {minerHostsSelected.map((miner, index) => {
                                    return(
                                        <SidebarHostItem key = {index}
                                            id = {miner.label}
                                            hostName = {miner.label}
                                            hostType = {{value: "miner", label: "miner"}}
                                            addedFrom = {serviceRegistry.label}
                                            onRemove = {removeMinerHost}
                                            ping = {null}
                                            allowClick = {false}
                                        />)
                                })}
                            </div>
                        </div>
                    </div>  

                    <div className='AddNewHostFromServiceRegistryPopup-body-repositories'>
                        <Dropdown
                            options = {repositoriesDropdownFormat}
                            onValueChange = {addRepositoryHost}
                            label = {`Repositories:`}
                            loading = {repositoriesDropdownFormat === null}
                        />
                        <div className='AddNewHostFromServiceRegistryPopup-body-repositories-bottom'>
                            <span className='AddNewHostFromServiceRegistryPopup-body-right-repositories-Title'>
                                Selected Repositories:
                            </span>
                            <div className='AddNewHostFromServiceRegistryPopup-body-right-repositories-list'>
                                {repositoryHostsSelected.map((repository, index) => {
                                    return(
                                        <SidebarHostItem key = {index}
                                            id = {repository.label}
                                            hostName = {repository.label}
                                            hostType = {{value: "repository", label: "repository"}}
                                            addedFrom = {serviceRegistry.label}
                                            onRemove = {removeRepositoryHost}
                                            ping = {null}
                                            allowClick = {false}
                                        />)
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </Popup>
        </BackdropModal>
    );
}

export default AddNewHostFromServiceRegistryPopup;
