import './AddNewHostPopup.scss';
import {useState, useEffect} from 'react';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import {v4 as uuidv4} from 'uuid';
import InputField from '../../Widgets/InputField/InputField';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import Popup from '../../Widgets/Popup/Popup';

function AddNewHostPopup(props) {

    const {
        toggleNewHostPopupOpen,
        addHost
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selectedHosttype, setSelectedHosttype] = useState(null);
    const [hostName, setHostname] = useState(null);


    useEffect(() => {
        setIsLoading(false);
    }, []);

    const handleSubmit = () => { // create new host object and add it to the list of hosts in localMemory
        // const newHost = {
        //     id: uuidv4(),
        //     name: hostName,
        //     status: "online",
        //     type: selectedHosttype,
        //     addedFrom: 'locally',
        //     config: {},
        // };
        addHost(hostName, selectedHosttype.value, "locally");
    }

    const handleTextfieldChange = (res) => {
        setHostname(res.value);
    }

    const onConfirmClick = () => {
        handleSubmit();
        toggleNewHostPopupOpen();
    }

    const handleNextConfirmDisabled = () => {
        return !(selectedHosttype && hostName);
    }

    if(isLoading){
        return (
            <div className="AddNewHostPopup">
                <div>Loading ...</div>
            </div>
        )
    }

    const hosttypes = [
        {label:'miner', value:'miner'},
        {label:'repository', value:'repository'},
        {label:'service registry', value:'service registry'}
    ];

    const onDropdownValueChange = (value) => {
        setSelectedHosttype(value);
    }

    return (
        <BackdropModal closeModal = {toggleNewHostPopupOpen}>
            <Popup
                title = {`Add new host`}
                closePopup = {toggleNewHostPopupOpen}
                onCancelClick = {toggleNewHostPopupOpen}
                onNextClick = {onConfirmClick}
                cancelText = {`Cancel`}
                nextText = {`Confirm`}
                nextButtonDisabled = {handleNextConfirmDisabled()}
            >

                <InputField
                    className={`AddNewHostPopup-input`}
                    type={`text`} 
                    placeholder = {`http://miner.host.net`}
                    id = "AddNewHostPopup-input-miner-id"
                    onChange = {handleTextfieldChange}
                    value = {hostName}
                    label = {`Hostname:`}
                />

                <Dropdown
                    options = {hosttypes}
                    onValueChange = {onDropdownValueChange}
                    label = {`Host type:`}
                    value = {selectedHosttype}
                />
            </Popup>
        </BackdropModal>
    );
}

export default AddNewHostPopup;
