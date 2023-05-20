import './ShadowPopup.scss';
import {useState, useEffect} from 'react';
import {getMinersLocal, getHostLocal} from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import Popup from '../../Widgets/Popup/Popup';
import {ShadowMiner} from '../../../Services/MinerServices';
import InputField from '../../Widgets/InputField/InputField';
import { saveProcessLocal } from '../../../Store/LocalDataStore';
import {v4 as uuidv4} from 'uuid';

function ShadowPopup(props) {
    const {
        toggleShadowPopupOpen,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selectedMinerHostOwner, setSelectedMinerHostOwner] = useState(null);
    const [selectedMinerHostReceiver, setSelectedMinerHostReceiver] = useState(null);
    const [shadowableMinersDropdownFormat, setShadowableMiners] = useState([]);
    const [selectedShadowableMiner, setSelectedShadowableMiner] = useState(null);
    const [newMinerName, setNewMinerName] = useState(null);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const connectedMinersDropdownFormat = getMinersLocal().map((miner) => { // Dropdown options for miner hosts
        return {label: miner.name, value: miner.id}
    });

    const findAndSetShadowableMiners = (minerHostId) => {
        const minerHost = getHostLocal(minerHostId);
        const miners = minerHost.config;
        if(miners.length <= 0) return;
        
        const shadowableMinersTemp = miners.filter(miner => miner.Shadow === true);
        setShadowableMiners(convertShadowableMinersToDropdownFormat(shadowableMinersTemp));
    }

    const convertShadowableMinersToDropdownFormat = (shadowableMiners) => {
        return shadowableMiners.map(miner => {
            return {label: miner.MinerLabel, value: miner.MinerId}
        });
    }

    const onMinerHostOwnerDropdownValueChange = (minerHost) => { // {label: "name", value: "id"}
        setSelectedMinerHostOwner(minerHost);
        findAndSetShadowableMiners(minerHost.value);
    }

    const onSelectedShadowableMinerDropdownValueChange = (value) => {
        setSelectedShadowableMiner(value);
    }

    const onMinerHostReceiverDropdownValueChange = (minerHost) => { // {label: "name", value: "id"}
        setSelectedMinerHostReceiver(minerHost);
    }

    const onNewMinerNameChange = (res) => {
        setNewMinerName(res.value);
    }

    const handleConfirmButtonDisabled = () => { // return true = disabled
        return(!selectedMinerHostOwner || !selectedShadowableMiner || !selectedMinerHostReceiver);      
    }

    const handleSaveShadowProcess = (minerReceiver, shadowMiner, processId) => {
        const status = {
            id: uuidv4(),
            objectType: "shadowProcess",
            hostname: minerReceiver.name,
            minerId: minerReceiver.id,
            processId: processId,
            processName: `Shadow ${shadowMiner.MinerLabel}`,
            status: "Running",
            progress: 0,
            startTime: new Date().getTime(),
            endTime: null,
            outputDestination: minerReceiver.name,
            error: null,
            addedFrom: minerReceiver.addedFrom,
            minerType: minerReceiver.type,
        };
        saveProcessLocal(status);
    }

    const onSubmit = () => {
        const ownerHostname = selectedMinerHostOwner.label; // hostname e.g. localhost:5000
        const minerHost = getHostLocal(selectedMinerHostOwner.value); // miner host object
        
        const miners = minerHost.config; // miner host config
        const shadowableMinersTemp = miners.filter(miner => miner.Shadow === true); // shadowable miners
        const miner = shadowableMinersTemp.find(miner => miner.MinerId === selectedShadowableMiner.value); // selected shadowable miner
        miner.MinerLabel = newMinerName ? newMinerName : miner.MinerLabel; // set new miner name if it exists
        const body = {
            Host: ownerHostname + "/shadow/",
            Config: miner
        }
        const receiverHostname = selectedMinerHostReceiver.label;
        setIsLoading(true);

        ShadowMiner(receiverHostname, body)
            .then((res) => {
                const receiverMiner = getMinersLocal().find(miner => miner.name === receiverHostname);
                handleSaveShadowProcess(receiverMiner, miner, res.data);
            })
            .then(() => {
                setIsLoading(false);
                toggleShadowPopupOpen();
            })
            .catch(() => {
                setIsLoading(false);
                alert(`Something went wrong when trying to clone miner from ${ownerHostname} to ${receiverHostname}}`);
                toggleShadowPopupOpen();
            });
    }

    return (
        <BackdropModal closeModal = {toggleShadowPopupOpen} showSpinner={isLoading}>

            <Popup
                title = {`Clone miner to new host`}
                closePopup = {toggleShadowPopupOpen}
                onCancelClick = {toggleShadowPopupOpen}
                onNextClick = {onSubmit}
                cancelText = {`Cancel`}
                nextText = {`Confirm`}
                nextButtonDisabled = {handleConfirmButtonDisabled()}
            >
                
                <div className='ShadowPopup-body'>
                    <Dropdown
                        options = {connectedMinersDropdownFormat}
                        onValueChange = {onMinerHostOwnerDropdownValueChange}
                        label = {`Select miner host to clone miner from:`}
                        value = {selectedMinerHostOwner}
                    />
                    
                    {selectedMinerHostOwner && // show only if a miner host owner is selected
                        (shadowableMinersDropdownFormat.length >= 0 ? // show only if there are shadowable miners
                            <Dropdown
                                options = {shadowableMinersDropdownFormat}
                                onValueChange = {onSelectedShadowableMinerDropdownValueChange}
                                label = {`Choose from clonable miner:`}
                                value = {selectedShadowableMiner}
                            /> : "No shadowable miners found" // show if no shadowable miners found
                        )
                    }

                    {selectedMinerHostOwner && // show only if a miner host owner is selected
                        <Dropdown
                            options = {connectedMinersDropdownFormat}
                            onValueChange = {onMinerHostReceiverDropdownValueChange}
                            label = {`Select miner host to clone miner to:`}
                            value = {selectedMinerHostReceiver}
                        />
                    }

                    {selectedMinerHostOwner &&
                        <InputField
                        className={`ShadowPopup-minername-input`}
                        type={`text`} 
                        placeholder = {`[My new miner name]`}
                        onChange = {onNewMinerNameChange}
                        value = {newMinerName}
                        label = {`New miner label:`}
                    />
                    }
                </div>
            </Popup>
        </BackdropModal>
    );
}

export default ShadowPopup;
