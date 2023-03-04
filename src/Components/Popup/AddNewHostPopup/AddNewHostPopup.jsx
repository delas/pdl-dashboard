import './AddNewHostPopup.scss';
import {useState, useEffect} from 'react';
import { FaRegWindowClose, FaCloudUploadAlt } from 'react-icons/fa';
import Dropdown from '../../Dropdown/Dropdown';

function AddNewHostPopup(props) {

    const {
        toggleNewHostPopupOpen
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selectedHosttype, setSelectedHosttype] = useState(null);


    useEffect(() => {
        setIsLoading(false);
    });

    if(isLoading){
        return (
            <div className="AddNewHostPopup">
                <div>Loading ...</div>
            </div>
        )
    }

    const hosttypes = [
        {name:'miner', value:'miner'},
        {name:'repository', value:'repository'},
        {name:'service registry', value:'service registry'}
    ]

    const onValueChange = (value) => {
        setSelectedHosttype(value);
    }

    return (
        // <div className='AddNewHostPopup'>
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
                        <label className='AddNewHostPopup-input-label' for ="AddNewHostPopup-input-miner-id">
                            {`Hostname:`}
                        </label>
                        <input 
                            className={`AddNewHostPopup-input`}
                            type={`text`} 
                            placeholder = {`http://miner.host.net`}
                            id = "AddNewHostPopup-input-miner-id"
                        />
                        
                    </div>

                    <div className='AddNewHostPopup-hosttype-dropdown'>
                        <span className='AddNewHostPopup-wizard-dropdown-label'>Host type:</span>
                        <Dropdown
                            options = {hosttypes}
                            onValueChange = {onValueChange}
                        />
                    </div>

                </div>

                <footer className='AddNewHostPopup-footer'>
                    <div className='AddNewHostPopup-buttonContainer'>
                        <button className='AddNewHostPopup-button AddNewHostPopup-button-cancel'
                            onClick = {() => {toggleNewHostPopupOpen()}}
                        >Cancel</button>
                        <button className='AddNewHostPopup-button AddNewHostPopup-button-confirm'>Confirm</button>
                    </div>
                </footer>

            </div>

        </div>
        // </div>
    );
}

export default AddNewHostPopup;
