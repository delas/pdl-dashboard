import './AddNewHostFromServiceRegistryPopup.scss';
import {useState, useEffect} from 'react';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import {GetMinersFromServiceRegistry, GetRepositoriesFromServiceRegistry} from '../../../Services/ServiceRegistryServices';
import Popup from '../../Widgets/Popup/Popup';
import { getMinersLocal, getRepositoriesLocal } from '../../../Store/LocalDataStore';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';
import AddNewHostFromServiceRegistryPopupList from './AddNewHostFromServiceRegistryPopupLists/AddNewHostFromServiceRegistryPopupList';

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
            addHost(miner.label, miner.value, serviceRegistry.label);
        });

        repositoryHostsSelected.forEach((repository) => {
            addHost(repository.label, repository.value, serviceRegistry.label);
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

    const createAndSetHostSingleDropdownList = (hosts, hostsSelected, getHostsLocal) => {
        return hosts.filter((host) => { // Filter out repositories that are already selected
            return !hostsSelected.find((selectedHost) => {
                return selectedHost.label === host;
            });
        }).filter((host) => { // Filter out repositories that are already added
            return !getHostsLocal().find((addedHost) => {
                return addedHost.name === host;
            });
        });
    }

    const createAndSetHostDropdownLists = () => {
        if(miners !== null) {
            console.log(miners);
            const nonSelectedMiners = createAndSetHostSingleDropdownList(miners, minerHostsSelected, getMinersLocal);
            setMinersDropdownFormat(nonSelectedMiners.map((miner) => {
                return( {label: `${miner}`, value: "miner"} )
            }));
        }

        if(repositories !== null) {
            const nonSelectedRepositories = createAndSetHostSingleDropdownList(repositories, repositoryHostsSelected, getRepositoriesLocal);
            setRepositoriesDropdownFormat(nonSelectedRepositories.map((repository) => {
                return( {label: `${repository}`, value: "repository"} )
            }));
        }
    }

    useEffect(() => {
        createAndSetHostDropdownLists();
    }, [miners, repositories, minerHostsSelected, repositoryHostsSelected])

    if(isLoading){
        return (
            <div className="AddNewHostFromServiceRegistryPopup">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
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

                    <AddNewHostFromServiceRegistryPopupList
                        title = {`Selected Miners:`}
                        label = {`Miners:`}
                        DropdownOptions = {minersDropdownFormat}
                        onValueChange = {addMinerHost}
                        selectedHostsList = {minerHostsSelected}
                        onRemove = {removeMinerHost}
                        hostType = {{value: "miner", label: "miner"}}
                        
                    />
                    <AddNewHostFromServiceRegistryPopupList
                        title = {`Selected Repositories:`}
                        label = {`Repositories:`}
                        DropdownOptions = {repositoriesDropdownFormat}
                        onValueChange = {addRepositoryHost}
                        selectedHostsList = {repositoryHostsSelected}
                        onRemove = {removeRepositoryHost}
                        hostType = {{value: "repository", label: "repository"}}
                    />
                </div>
            </Popup>
        </BackdropModal>
    );
}

export default AddNewHostFromServiceRegistryPopup;
