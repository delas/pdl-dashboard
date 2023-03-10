import './AddfilePopup.scss';
import {useState, useEffect} from 'react';
import FileInput from '../../Widgets/FileInput/FileInput';
import PopupFooter from '../../Widgets/PopupFooter/PopupFooter';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import {getRepositories} from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import { sendFileToRepository } from '../../../Services/RepositoryServices';
import Radiobuttons from '../../Widgets/Radiobuttons/Radiobuttons';

function AddFilePopup(props) {

    const {
        toggleFilePopupOpen,
        repository = {},
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [fileDestination, setFileDestination] = useState({});

    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
    const [selectedFileType, setSelectedFileType] = useState(null);

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
    
    const onFileUploadValueChange = (event) => {
        setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
    }

    const onDropdownValueChange = (value) => {
        setFileDestination(value)
    }

    const onConfirmClick = () => {
        if(isFilePicked && 
            fileDestination !== null && fileDestination !== undefined
            && selectedFileType !== null && selectedFileType !== undefined){
            sendFileToRepository(fileDestination.label, selectedFile, selectedFileType.value);
        }
    }

    const repositories = getRepositories().map((repository, index) => {
        return {label: repository.name, value: repository.id}
    })

    const radiobuttons = [
        {label: "Raw data/event log", value: "EventLog"},
        {label: "Visualization/processed data", value: "Visualization"}
    ];

    const onRadioButtonChange = (value) => {
        setSelectedFileType(value);
    }

    return (
            <BackdropModal closeModal = {toggleFilePopupOpen}>

            <div className='AddFilePopup' 
                onClick = {(e) => {e.stopPropagation()}}
            >

                <PopupHeader
                    title = {`Upload file`}
                    closePopup = {toggleFilePopupOpen}
                />
                <div className='AddFilePopup-body'>

                    <FileInput 
                        filename = {selectedFile?.name}
                        filesize = {selectedFile?.size}
                        onChange = {onFileUploadValueChange}
                    />

                    <Radiobuttons
                        options = {radiobuttons}
                        onChange = {onRadioButtonChange}
                        title = {'Select file type'}
                    />

                    <Dropdown
                        options = {repositories}
                        onValueChange = {onDropdownValueChange}
                        label = {`Select the destination repository`}
                        value = {fileDestination}
                    />
                    
                </div>

                <PopupFooter
                    onCancelClick = {toggleFilePopupOpen}
                    onNextClick = {onConfirmClick}
                    cancelText = {`Cancel`}
                    nextText = {`Confirm`}
                />

            </div>
        </BackdropModal>
    );
}

export default AddFilePopup;
