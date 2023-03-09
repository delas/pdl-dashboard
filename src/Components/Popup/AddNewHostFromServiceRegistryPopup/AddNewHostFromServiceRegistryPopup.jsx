import './AddNewHostFromServiceRegistryPopup.scss';
import {useState, useEffect} from 'react';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import {v4 as uuidv4} from 'uuid';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import PopupFooter from '../../Widgets/PopupFooter/PopupFooter';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import SidebarHostItem from '../../SidebarHosts/SidebarHostItem/SidebarHostItem';
import {GetMinersFromServiceRegistry, GetRepositoriesFromServiceRegistry} from '../../../Services/ServiceRegistryServices';

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
    });

    const handleSubmit = () => {
        console.log(minerHostsSelected);
        minerHostsSelected.forEach((miner, index) => {
            const newHost = {
                id: uuidv4(),
                name: miner,
                status: "offline",
                type: "miner",
                addedFrom: serviceRegistry.label,
            };
            addHost(newHost.id, newHost);
        });

        repositoryHostsSelected.forEach((repository, index) => {
            const newHost = {
                id: uuidv4(),
                name: repository,
                status: "offline",
                type: "repository",
                addedFrom: serviceRegistry.label,
            };
            addHost(newHost.id, newHost);
        });
    }

    const addMinerHost = (miner) => {
        setMinerHostsSelected(minerHostsSelected.concat(miner.value));
    }

    const addRepositoryHost = (repository) => {
        console.log(repository);
        setRepositoryHostsSelected(repositoryHostsSelected.concat(repository.value));
    }

    const removeMinerHost = (id) => {
        setMinerHostsSelected(minerHostsSelected.filter(listItem => listItem.id !== id));
    }

    const removeRepositoryHost = (id) => {
        setRepositoryHostsSelected(repositoryHostsSelected.filter(listItem => listItem.id !== id));
    }

    const onConfirmClick = () => {
        handleSubmit();
        togglenewHostFromSRPopupOpen();
    }

    useEffect(() => {
        GetMinersFromServiceRegistry(serviceRegistry.label).then(res => 
            setMiners(res.data)
        )

        GetRepositoriesFromServiceRegistry(serviceRegistry.label).then(res => 
            setRepositories(res.data)
        )
    }, []);

    useEffect(() => {
        if(miners !== null)
        setMinersDropdownFormat(miners.map((miner) => {
            return( {label: `${miner.Label} ${miner.HostName}`, value: miner.HostName} )
        }));

        if(repositories !== null)
        setRepositoriesDropdownFormat(repositories.map((repository) => {
            return( {label: `${repository.Label} ${repository.HostName}`, value: repository.HostName} )
        }));
    }, [miners, repositories])

    if(isLoading){
        return (
            <div className="AddNewHostFromServiceRegistryPopup">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <BackdropModal closeModal = {togglenewHostFromSRPopupOpen}>

            <div className='AddNewHostFromServiceRegistryPopup' 
                onClick = {(e) => {e.stopPropagation()}}
            >

                <PopupHeader
                    title = {`Add new host from service registry: ${serviceRegistry.label}`}
                    closePopup = {togglenewHostFromSRPopupOpen}
                />

                <div className='AddNewHostFromServiceRegistryPopup-body'>
                    <div className='AddNewHostFromServiceRegistryPopup-body-miners'>
                        <div className='AddNewHostFromServiceRegistryPopup-body-miners-top'>
                            <Dropdown
                                options = {minersDropdownFormat}
                                onValueChange = {addMinerHost}
                                label = {`Miners:`}
                                loading = {minersDropdownFormat === null}
                            />
                        </div>
                        <div className='AddNewHostFromServiceRegistryPopup-body-miners-bottom'>
                            <span className='AddNewHostFromServiceRegistryPopup-body-right-miners-Title'>
                                Selected Miners: 
                            </span>
                            <div className='AddNewHostFromServiceRegistryPopup-body-right-miners-list'>
                                {minerHostsSelected.map((miner, index) => {
                                    return(
                                        <SidebarHostItem key = {index}
                                            id = {miner.id}
                                            hostName = {miner}
                                            hostType = {"miner"}
                                            addedFrom = {serviceRegistry.label}
                                            onRemove = {removeMinerHost}
                                            ping = {null}
                                            allowClick = {false}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </div>  

                    <div className='AddNewHostFromServiceRegistryPopup-body-repositories'>
                        <div className='AddNewHostFromServiceRegistryPopup-body-repositories-top'>
                            <Dropdown
                                options = {repositoriesDropdownFormat}
                                onValueChange = {addRepositoryHost}
                                label = {`Repositories:`}
                                loading = {repositoriesDropdownFormat === null}
                            />
                        </div>
                        <div className='AddNewHostFromServiceRegistryPopup-body-repositories-bottom'>
                            <span className='AddNewHostFromServiceRegistryPopup-body-right-repositories-Title'>
                                Selected Repositories:
                            </span>
                            <div className='AddNewHostFromServiceRegistryPopup-body-right-repositories-list'>
                                {repositoryHostsSelected.map((repository, index) => {
                                    console.log(repository)
                                        return(
                                            <SidebarHostItem key = {index}
                                                id = {repository.id}
                                                hostName = {repository}
                                                hostType = {"repository"}
                                                addedFrom = {serviceRegistry.label}
                                                onRemove = {removeRepositoryHost}
                                                ping = {null}
                                                allowClick = {false}
                                            />
                                        )
                                    })}
                            </div>
                        </div>
                    </div>
                </div>

                <PopupFooter
                    onCancelClick = {togglenewHostFromSRPopupOpen}
                    onNextClick = {onConfirmClick}
                    cancelText = {`Cancel`}
                    nextText = {`Add selected`}
                />

            </div>
        </BackdropModal>
    );
}

export default AddNewHostFromServiceRegistryPopup;
