import './AddNewHostPopup.scss';
import {useState, useEffect} from 'react';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import {saveHost} from '../../../Store/LocalDataStore';
import {v4 as uuidv4} from 'uuid';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import PopupFooter from '../../Widgets/PopupFooter/PopupFooter';
import InputField from '../../Widgets/InputField/InputField';

function AddNewHostPopup(props) {

    const {
        toggleNewHostPopupOpen
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selectedHosttype, setSelectedHosttype] = useState(null);
    const [hostName, setHostname] = useState(null);


    useEffect(() => {
        setIsLoading(false);
    });

    const handleSubmit = () => {
        const newHost = {
            id: uuidv4(),
            name: hostName,
            status: "online",
            type: selectedHosttype,
            addedFrom: 'locally',
        };
        saveHost(newHost.id, newHost);
    }

    const handleTextfieldChange = (event) => {
        setHostname(event.target.value);
    }

    const onConfirmClick = () => {
        handleSubmit();
        toggleNewHostPopupOpen();
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
        <div className='Backdrop-modal' 
            onClick = {() => {toggleNewHostPopupOpen()}}
        >

            <div className='AddNewHostPopup' 
                onClick = {(e) => {e.stopPropagation()}}
            >

                <PopupHeader
                    title = {`Add new host`}
                    closePopup = {toggleNewHostPopupOpen}
                />

                <div className='AddNewHostPopup-body'>

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
                        onValueCHange = {onDropdownValueChange}
                        label = {`Host type:`}
                    />

                </div>

                <PopupFooter
                    onCancelClick = {toggleNewHostPopupOpen}
                    onNextClick = {onConfirmClick}
                    cancelText = {`Cancel`}
                    nextText = {`Confirm`}
                />

            </div>

        </div>
    );
}

export default AddNewHostPopup;
