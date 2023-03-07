import './AddfilePopup.scss';
import {useState, useEffect} from 'react';
import { FaRegWindowClose, FaCloudUploadAlt } from 'react-icons/fa';
import FileInput from '../../Widgets/FileInput/FileInput';
import PopupFooter from '../../Widgets/PopupFooter/PopupFooter';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import {getRepositories} from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';

function AddFilePopup(props) {

    const {
        toggleFilePopupOpen,
        repository = {},
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [fileDestination, setFileDestination] = useState({});

    useEffect(() => {
        setIsLoading(false);
        setFileDestination(repository);
    }, []);

    if(isLoading){
        return (
            <div className="AddFilePopup">
                <div>Loading ...</div>
            </div>
        )
    }

    const onValueChange = (value) => {
        setFileDestination(value)
    }

    const repositories = getRepositories().map((repository, index) => {
        return {label: repository.name, value: repository.id}
    })

    return (
            <BackdropModal closeModal = {toggleFilePopupOpen}>

            <div className='AddFilePopup' 
                onClick = {(e) => {e.stopPropagation()}}
            >

                <PopupHeader
                    title = {`Upload file`}
                    closePopup = {toggleFilePopupOpen}
                />

                <FileInput onChange = {() => {}}/>

                {/* <div className='ActionPopup-wizard-step4'> */}
                <Dropdown
                    options = {repositories}
                    onValueChange = {onValueChange}
                    label = {`Select the destination repository`}
                    value = {fileDestination}
                />
                    {/* </div>  */}

                <PopupFooter
                    onCancelClick = {toggleFilePopupOpen}
                    onNextClick = {() => {}}
                    cancelText = {`Cancel`}
                    nextText = {`Confirm`}
                />

            </div>
        </BackdropModal>
    );
}

export default AddFilePopup;
