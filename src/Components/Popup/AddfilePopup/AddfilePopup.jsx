import './AddfilePopup.scss';
import {useState, useEffect} from 'react';
import { FaRegWindowClose, FaCloudUploadAlt } from 'react-icons/fa';
import FileInput from '../../Widgets/FileInput/FileInput';
import PopupFooter from '../../Widgets/PopupFooter/PopupFooter';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';

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

                <PopupHeader
                    title = {`Upload file`}
                    closePopup = {toggleFilePopupOpen}
                />

                <FileInput onChange = {() => {}}/>

                <PopupFooter
                    onCancelClick = {toggleFilePopupOpen}
                    onNextClick = {() => {}}
                    cancelText = {`Cancel`}
                    nextText = {`Confirm`}
                />

            </div>
        </div>
    );
}

export default AddFilePopup;
