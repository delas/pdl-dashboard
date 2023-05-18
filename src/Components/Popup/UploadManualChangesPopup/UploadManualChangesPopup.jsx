import './UploadManualChangesPopup.scss';
import {useState, useEffect} from 'react';
import {getRepositoriesLocal} from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import { sendFileToRepository, GetSingleFileMetadata } from '../../../Services/RepositoryServices';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import InputField from '../../Widgets/InputField/InputField';
import Popup from '../../Widgets/Popup/Popup';
import { getFileExtension, getFileHost, getFileResourceId, getFileResourceType } from '../../../Utils/FileUnpackHelper';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';

function UploadManualChangesPopup(props) {
    const {
        toggleUploadManualChangesPopup,
        repository = {},
        xml, 
        originalMetadata,
        saveFileAndUpdate,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [fileDestination, setFileDestination] = useState({});

    const [fileDescription, setFileDescription] = useState(null);
    const [resourceName, setResourceName] = useState(null);

    useEffect(() => {
        setIsLoading(false);
        setFileDestination(repository);
    }, []);

    const repositories = getRepositoriesLocal().map((repository, index) => {
        return {label: repository.name, value: repository.id}
    })

    useEffect(() => {
        if((!fileDestination || Object.keys(fileDestination).length <= 0) && originalMetadata) {
            const selectedRepository = repositories.find(repository => getFileHost(originalMetadata).includes(repository.label));
            setFileDestination(selectedRepository);
        }
    }, []);

    if(isLoading){
        return (
            <div className="UploadManualChangesPopup">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div> 
            </div>
        )
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
        return !(resourceName && fileDestination);
    }

    const onConfirmClick = () => {
        setIsLoading(true);
        const fileExtension = getFileExtension(originalMetadata);
        const selectedFileType = getFileResourceType(originalMetadata);
        const parents = [
            {
                ResourceId: getFileResourceId(originalMetadata),
                UsedAs: "ManualEditing"
            }
        ];
        const generatedFrom = {
            SourceHost: "Frontend",
            SourceId: "",
            SourceLabel: "Manual editing"
        }

        var blob = new Blob([xml], { type: 'text/xml' });
        const xmlFile =  new File([blob], `foo.xml`, {type: "text/xml"});

        sendFileToRepository(fileDestination.label, xmlFile, fileExtension, selectedFileType, resourceName, fileDescription, parents, generatedFrom)
        .then((res) => {
            GetSingleFileMetadata(fileDestination.label, res.data)
            .then((res) => {
                const isImage = false; // Currently no way to make changes to images
                const metadata = res.data;
                metadata["repositoryUrl"] = fileDestination.label; // Add repositoryUrl to metadata, used to get file content and children
                saveFileAndUpdate(res.data, xml, isImage);
            });
        })
        .then(() => {toggleUploadManualChangesPopup(); setIsLoading(false);})
        .catch((err) => {console.log(err); setIsLoading(false);});
    }

    const onResourceNameChange = (value) => {
        setResourceName(value.value);
    }

    return (
        <BackdropModal closeModal = {toggleUploadManualChangesPopup} showSpinner={isLoading}>

            <Popup
                title = {`Upload file`}
                closePopup = {toggleUploadManualChangesPopup}
                onCancelClick = {toggleUploadManualChangesPopup}
                onNextClick = {onConfirmClick}
                cancelText = {`Cancel`}
                nextText = {`Confirm`}
                nextButtonDisabled = {handleConfirmButtonDisabled()}
            >
                
                <div className='UploadManualChangesPopup-body'>
                    
                    <Dropdown
                        options = {repositories}
                        onValueChange = {onFileDestinationDropdownChange}
                        label = {`Select the destination repository:`}
                        value = {fileDestination}
                    />

                    <InputField
                        label = {"Resource name:"}
                        fieldType = {"text"}
                        placeholder = {"Name of the resource:"}
                        value = {resourceName}
                        onChange = {onResourceNameChange}
                    />

                    <InputField
                        label = {"Resource description:"}
                        fieldType = {"text"}
                        placeholder = {"Consider adding a description of the resource contents:"}
                        value = {fileDescription}
                        onChange = {onFileDescriptionChange}
                    />
                    
                </div>
            </Popup>
        </BackdropModal>
    );
}

export default UploadManualChangesPopup;
