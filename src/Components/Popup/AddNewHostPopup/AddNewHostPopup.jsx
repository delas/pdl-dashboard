import './AddNewHostPopup.scss';
import {useState, useEffect} from 'react';
import { FaRegWindowClose, FaCloudUploadAlt } from 'react-icons/fa';
import Dropdown from '../../Dropdown/Dropdown';
import {saveHost} from '../../../Store/LocalDataStore';
import {v4 as uuidv4} from 'uuid';

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
                
                <header className='AddNewHostPopup-header'>
                    <h4>Add new host</h4>
                    <div className='ClosePopup'>
                        <FaRegWindowClose
                            onClick = {() => {toggleNewHostPopupOpen()}}
                        />
                    </div>
                </header>

                <div className='AddNewHostPopup-body'>

                    <div className='AddNewHostPopup-input-parent'>
                        <label className='AddNewHostPopup-input-label' for="AddNewHostPopup-input-miner-id">
                            {`Hostname:`}
                        </label>
                        <input 
                            className={`AddNewHostPopup-input`}
                            type={`text`} 
                            placeholder = {`http://miner.host.net`}
                            id = "AddNewHostPopup-input-miner-id"
                            onChange = {handleTextfieldChange}
                            value = {hostName}
                        />
                        
                    </div>

                    <div className='AddNewHostPopup-hosttype-dropdown'>
                        <span className='AddNewHostPopup-wizard-dropdown-label'>Host type:</span>
                        <Dropdown
                            options = {hosttypes}
                            onValueCHange = {onDropdownValueChange}
                        />
                    </div>

                </div>

                <footer className='AddNewHostPopup-footer'>
                    <div className='AddNewHostPopup-buttonContainer'>
                        <button className='AddNewHostPopup-button AddNewHostPopup-button-cancel'
                            onClick = {() => {toggleNewHostPopupOpen()}}
                        >Cancel</button>
                        <button className='AddNewHostPopup-button AddNewHostPopup-button-confirm' onClick={() => {
                            handleSubmit();
                            toggleNewHostPopupOpen();
                        }}>Confirm</button>
                    </div>
                </footer>

            </div>

        </div>
    );
}

export default AddNewHostPopup;
