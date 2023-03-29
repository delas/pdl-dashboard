import './UploadResourcePopup.scss';
import {useState, useEffect} from 'react';
import PopupFooter from '../../Widgets/PopupFooter/PopupFooter';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import {getRepositories} from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import { sendFileToRepository, GetSingleFileMetadata } from '../../../Services/RepositoryServices';
import Tabs from '../../Widgets/Tabs/Tabs';
import UploadFileBody from './UploadFileBody/UploadFileBody';
import UploadStreamBody from './UploadStreamBody/UploadStreamBody';
import { saveFile } from '../../../Store/LocalDataStore';
import {availableFileExtensions} from '../../../config';
import { getFileExtension } from '../../../Utils/FileUnpackHelper';

function UploadResourcePopup(props) {

    const {
        toggleFilePopupOpen,
        repository = {},
        // addFile,
        getAndAddFile,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [fileDestination, setFileDestination] = useState({});

    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
    const [selectedFileType, setSelectedFileType] = useState(null);

    const [fileDescription, setFileDescription] = useState(null);
    const [selectedTab, setSelectedTab] = useState({Title: "File"});

    const [streamBrokerLocation, setStreamBrokerLocation] = useState(null);
    const [streamTopic, setStreamTopic] = useState(null);

    useEffect(() => {
        setIsLoading(false);
        setFileDestination(repository);
    }, []);

    if(isLoading){
        return (
            <div className="UploadResourcePopup">
                <div>Loading ...</div>
            </div>
        )
    }

    const onTabChange = (tabIndex) => {
        setSelectedTab(tabIndex);
    }
    const fileTabs = [{Title: 'File'}, {Title: 'Stream'}];
    
    const onFileUploadValueChange = (event) => {
        setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
    }

    const onFileDestinationDropdownChange = (value) => {
        setFileDestination(value)
    }

    const onFileDescriptionChange = (res) => {
        setFileDescription(res.value);
    }

    const onConfirmClick = () => {
        if(isFilePicked && fileDestination && selectedFileType){
            setIsLoading(true);
            sendFileToRepository(fileDestination.label, selectedFile, selectedFileType.value, fileDescription).then((res) => {
                GetSingleFileMetadata(fileDestination.label, res.data).then((res) => {
                    // if(availableFileExtensions.includes(getFileExtension(res.data).toUpperCase())){
                        // const reader = new FileReader();
                        // reader.readAsText(selectedFile, 'UTF-8');
                        // reader.onload = function (evt) {
                            // getAndAddFile({res.data, fileContent: evt.target.result})
                        // }
                        getAndAddFile(res.data);
                    // } else {
                    //     getAndAddFile({...res.data, fileContent: null});
                    // }
                });
            })
            .then(() => {toggleFilePopupOpen(); setIsLoading(false);})
            .catch((err) => {console.log(err); setIsLoading(false);});
        }
    }

    const repositories = getRepositories().map((repository, index) => {
        return {label: repository.name, value: repository.id}
    })

    const radiobuttonsFile = [
        {label: "Raw data/event log", value: "EventLog"},
        {label: "Visualization/processed data", value: "Visualization"},
    ];

    const onRadioButtonChange = (value) => {
        setSelectedFileType(value);
        console.log(value);
    }

    const onStreamBrokerLocationChange = (res) => {
        setStreamBrokerLocation(res.value);
    }
    const onStreamTopicChange = (res) => {
        setStreamTopic(res.value);
    }

    return (
            <BackdropModal closeModal = {toggleFilePopupOpen} showSpinner={isLoading}>

            <div className='UploadResourcePopup' 
                onClick = {(e) => {e.stopPropagation()}}
            >

                <PopupHeader
                    title = {`Upload file`}
                    closePopup = {toggleFilePopupOpen}
                />

                <Tabs
                    onTabChange = {onTabChange}
                    selectedTab = {selectedTab}
                    tablist = {fileTabs}
                />
                
                <div className='UploadResourcePopup-body'>
                    
                    {(selectedTab.Title === "File") && <UploadFileBody
                        selectedFile = {selectedFile}
                        onFileUploadValueChange = {onFileUploadValueChange}
                        radiobuttonsOptions = {radiobuttonsFile}
                        onRadioButtonChange = {onRadioButtonChange}
                        fileDescription = {fileDescription}
                        onFileDescriptionChange = {onFileDescriptionChange}
                        repositories = {repositories}
                        onFileDestinationDropdownChange = {onFileDestinationDropdownChange}
                        fileDestination = {fileDestination}
                    />}

                    {(selectedTab.Title === "Stream") && <UploadStreamBody
                        onStreamBrokerLocationChange = {onStreamBrokerLocationChange}
                        onStreamTopicChange = {onStreamTopicChange}
                        fileDescription = {fileDescription}
                        onFileDescriptionChange = {onFileDescriptionChange}
                        repositories = {repositories}
                        onFileDestinationDropdownChange = {onFileDestinationDropdownChange}
                        fileDestination = {fileDestination}
                        streamBrokerLocation = {streamBrokerLocation}
                        streamTopic = {streamTopic}
                    />}
                    
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

export default UploadResourcePopup;
