import './ShadowPopup.scss';
import {useState, useEffect} from 'react';
import {getMinersLocal, getHostLocal} from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import Popup from '../../Widgets/Popup/Popup';
import {ShadowMiner} from '../../../Services/MinerServices';
import InputField from '../../Widgets/InputField/InputField';

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

    const onSubmit = () => {
        const ownerHostname = selectedMinerHostOwner.label;
        const minerHost = getHostLocal(selectedMinerHostOwner.value);
        
        const miners = minerHost.config;
        const shadowableMinersTemp = miners.filter(miner => miner.Shadow === true);
        const miner = shadowableMinersTemp.find(miner => miner.MinerId === selectedShadowableMiner.value);
        miner.MinerLabel = newMinerName ? newMinerName : miner.MinerLabel;
        const extension = "py";
        const body = {
            Host: ownerHostname + "/shadow/",
            Extension: extension,
            Config: miner
        }
        const receiverHostname = selectedMinerHostReceiver.label;
        ShadowMiner(receiverHostname, body);
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
                        placeholder = {`Alpha miner - cloned`}
                        // id = "AddNewHostPopup-input-miner-id"
                        onChange = {onNewMinerNameChange}
                        value = {newMinerName}
                        label = {`Hostname:`}
                    />
                    }
                </div>
            </Popup>
        </BackdropModal>
    );
}

export default ShadowPopup;
