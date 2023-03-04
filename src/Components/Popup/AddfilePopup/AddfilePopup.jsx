import './AddfilePopup.scss';
import {useState, useEffect} from 'react';
import { FaRegWindowClose, FaCloudUploadAlt } from 'react-icons/fa';

function AddFilePopup(props) {

    const {
        toggleFilePopupOpen
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    });

    if(isLoading){
        return (
            <div className="AddFilePopup">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className='Backdrop-modal' 
            onClick = {() => {toggleFilePopupOpen()}}
        >

            <div className='AddFilePopup' 
                onClick = {(e) => {e.stopPropagation()}}
            >

                <header className='AddFilePopup-header'>
                    <h4>Upload file</h4>
                    <div className='ClosePopup'>
                        <FaRegWindowClose
                            onClick = {() => {toggleFilePopupOpen()}}
                        />
                    </div>
                </header>

                <form id="file-upload-form" classname="AddFilePopup-body">
                    <input id="file-upload" type="file" name="fileUpload" accept="image/*" className='AddFilePopup-fileinput'/>

                    <label for="file-upload" id="file-drag" className='AddFilePopup-fileinput-label'>
                        <FaCloudUploadAlt id="file-image" src="#" alt="Preview" className='AddFilePopup-fileinput-icon'
                            
                        />

                        <div className='AddFilePopup-fileinput-selectFile'>
                            <div>Select a file or drag here</div>
                            <span id="file-upload-btn" classname="AddFilePopup-fileinput-button">Select a file</span>
                        </div>
                    </label>
                </form>

                <footer className='AddFilePopup-footer'>
                    <div className='AddFilePopup-buttonContainer'>
                        <button className='AddFilePopup-button AddFilePopup-button-cancel'
                            onClick = {() => {toggleFilePopupOpen()}}
                        >Cancel</button>
                        <button className='AddFilePopup-button AddFilePopup-button-confirm'>Confirm</button>
                    </div>
                </footer>

            </div>
        </div>
    );
}

export default AddFilePopup;
