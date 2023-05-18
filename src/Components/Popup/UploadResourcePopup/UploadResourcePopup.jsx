import './UploadResourcePopup.scss';
import {useState, useEffect} from 'react';
import {getRepositoriesLocal} from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import { sendFileToRepository, GetSingleFileMetadata, sendStreamToRepository } from '../../../Services/RepositoryServices';
import Tabs from '../../Widgets/Tabs/Tabs';
import UploadFileBody from './UploadFileBody/UploadFileBody';
import UploadStreamBody from './UploadStreamBody/UploadStreamBody';
import Popup from '../../Widgets/Popup/Popup';

function UploadResourcePopup(props) {

    const {
        toggleFilePopupOpen,
        repository = {},
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

    const [fileExtension, setFileExtension] = useState(null);
    const [resourceName, setResourceName] = useState(null);

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
        switch(tabIndex.Title){
            case "File":
                break;
            case "Stream":
                setSelectedFileType({label: "EventStream", value: "EventStream"});
                setResourceName(null);
                break;
            default:
                break;
        }
    }
    const fileTabs = [{Title: 'File'}, {Title: 'Stream'}];
    
    const onFileUploadValueChange = (event) => {
        setSelectedFile(event.target.files[0]);
        const filenameWithoutExtension = event.target.files[0].name.split('.')[0];
        setResourceName(filenameWithoutExtension);
		setIsFilePicked(true);
    }

    const onFileDestinationDropdownChange = (value) => {
        setFileDestination(value)
    }

    const onFileDescriptionChange = (res) => {
        setFileDescription(res.value);
    }

    const handleConfirmButtonDisabled = () => { // return true = disabled
        if(!fileDestination || Object.keys(fileDestination).length <= 0){
            return true;
        }

        switch(selectedTab.Title){
            case "File":
                return !(isFilePicked && selectedFileType && fileDescription && fileExtension);
            case "Stream":
                return !(streamBrokerLocation && streamTopic && fileDescription);
            default:
                return true;
        }
    }

    const onConfirmClick = () => {
        let request;
        switch(selectedTab.Title){
            case "File":
                setIsLoading(true);
                request = sendFileToRepository(
                    fileDestination.label, 
                    selectedFile, 
                    fileExtension, 
                    selectedFileType.value, 
                    resourceName, 
                    fileDescription
                );
                break;
            case "Stream":
                setIsLoading(true);
                request = sendStreamToRepository(
                    fileDestination.label, 
                    streamBrokerLocation, 
                    streamTopic, 
                    resourceName, 
                    selectedFileType.value, 
                    fileDescription
                );
                break;
            default:
                alert("It seems there was an error while uploading the resource. Please try selecting a tab in the popup and try again.")
                setIsLoading(false);
                return;
        }
        request.then((res) => {
            GetSingleFileMetadata(fileDestination.label, res.data)
            .then((res) => {
                const metadata = res.data;
                metadata["repositoryUrl"] = fileDestination.label;
                getAndAddFile(metadata);
            });
        })
        .then(() => {toggleFilePopupOpen(); setIsLoading(false);})
        .catch((err) => {console.log(err); setIsLoading(false);});
    }

    const repositories = getRepositoriesLocal().map((repository, index) => {
        return {label: repository.name, value: repository.id}
    })

    const radiobuttonsFile = [
        {label: "Raw data/event log", value: "EventLog"},
        {label: "Process Model", value: "ProcessModel"},
        {label: "Petri net", value: "PetriNet"}
    ];

    const onRadioButtonChange = (value) => {
        changeSelectedFileType(value);
    }

    const changeSelectedFileType = (value) => {
        setSelectedFileType(value);
    }

    const onFileExtensionChange = (value) => {
        setFileExtension(value.value);
    }

    const onResourceNameChange = (value) => {
        setResourceName(value.value);
    }

    const onStreamBrokerLocationChange = (res) => {
        setStreamBrokerLocation(res.value);
    }
    const onStreamTopicChange = (res) => {
        setStreamTopic(res.value);
    }

    return (
        <BackdropModal closeModal = {toggleFilePopupOpen} showSpinner={isLoading}>
            <Popup
                title = {`Upload file`}
                closePopup = {toggleFilePopupOpen}
                onCancelClick = {toggleFilePopupOpen}
                onNextClick = {onConfirmClick}
                cancelText = {`Cancel`}
                nextText = {`Confirm`}
                nextButtonDisabled = {handleConfirmButtonDisabled()}
            >

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
                        onFileExtensionChange = {onFileExtensionChange}
                        fileExtension = {fileExtension}
                        onResourceNameChange = {onResourceNameChange}
                        resourceName = {resourceName}
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
                        onResourceNameChange = {onResourceNameChange}
                        resourceName = {resourceName}
                    />}
                    
                </div>
            </Popup>
        </BackdropModal>
    );
}

export default UploadResourcePopup;
