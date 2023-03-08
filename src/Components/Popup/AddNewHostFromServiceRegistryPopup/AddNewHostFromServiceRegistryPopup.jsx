import './AddNewHostFromServiceRegistryPopup.scss';
import {useState, useEffect} from 'react';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import {saveHost} from '../../../Store/LocalDataStore';
import {v4 as uuidv4} from 'uuid';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import PopupFooter from '../../Widgets/PopupFooter/PopupFooter';
// import InputField from '../../Widgets/InputField/InputField';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import SidebarHostItem from '../../SidebarHosts/SidebarHostItem/SidebarHostItem';

function AddNewHostFromServiceRegistryPopup(props) {

    const {
        togglenewHostFromSRPopupOpen,
        serviceRegistry = {},

    } = props;

    const [isLoading, setIsLoading] = useState(true);

    const [isMinersLoading, setIsMinersLoading] = useState(true);
    const [isRepositoriesLoading, setIsRepositoriesLoading] = useState(true);
    const [minerHostsSelected, setMinerHostsSelected] = useState([]);
    const [repositoryHostsSelected, setRepositoryHostsSelected] = useState([]);


    useEffect(() => {
        setIsLoading(false);
    });

    const handleSubmit = () => {
        minerHostsSelected.forEach((miner, index) => {
            const newHost = {
                id: uuidv4(),
                name: miner.hostName,
                status: "online",
                type: miner.selectedHosttype,
                addedFrom: serviceRegistry.label,
            };
            saveHost(newHost.id, newHost);
        });

        repositoryHostsSelected.forEach((repository, index) => {
            const newHost = {
                id: uuidv4(),
                name: repository.hostName,
                status: "online",
                type: repository.selectedHosttype,
                addedFrom: serviceRegistry.label,
            };
            saveHost(newHost.id, newHost);
        });
    }


    const addMinerHost = (miner) => {
        setMinerHostsSelected(minerHostsSelected.concat(miner));
    }

    const addRepositoryHost = (repository) => {
        console.log(repository);
        setRepositoryHostsSelected(repositoryHostsSelected.concat(repository));
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

    if(isLoading){
        return (
            <div className="AddNewHostFromServiceRegistryPopup">
                <div>Loading ...</div>
            </div>
        )
    }

    const hosttypes = [
        {label:'miner', value:'miner'},
        {label:'repository', value:'repository'},
        {label:'service registry', value:'service registry'}
    ];


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
                                options = {hosttypes}
                                onValueChange = {addMinerHost}
                                label = {`Miners:`}
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
                                            hostName = {miner.name}
                                            hostType = {miner.type}
                                            addedFrom = {miner.addedFrom}
                                            onRemove = {removeMinerHost}
                                            ping = {null}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </div>  

                    <div className='AddNewHostFromServiceRegistryPopup-body-repositories'>
                        <div className='AddNewHostFromServiceRegistryPopup-body-repositories-top'>
                            <Dropdown
                                options = {hosttypes}
                                onValueChange = {addRepositoryHost}
                                label = {`Repositories:`}
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
                                                hostName = {repository.name}
                                                hostType = {repository.type}
                                                addedFrom = {repository.addedFrom}
                                                onRemove = {removeRepositoryHost}
                                                ping = {null}
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
                    nextText = {`Confirm`}
                />

            </div>
        </BackdropModal>
    );
}

export default AddNewHostFromServiceRegistryPopup;
