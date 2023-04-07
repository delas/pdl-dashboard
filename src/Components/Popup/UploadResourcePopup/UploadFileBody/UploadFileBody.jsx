import './UploadFileBody.scss';
import {useState, useEffect} from 'react';
import FileInput from '../../../Widgets/FileInput/FileInput';
import Dropdown from '../../../Widgets/Dropdown/Dropdown';
import Radiobuttons from '../../../Widgets/Radiobuttons/Radiobuttons';
import InputField from '../../../Widgets/InputField/InputField';

function UploadFileBody(props) {

    const {
        selectedFile,
        onFileUploadValueChange,
        radiobuttonsOptions,
        onRadioButtonChange,
        fileDescription,
        onFileDescriptionChange,
        repositories,
        onFileDestinationDropdownChange,
        fileDestination,
        onFileExtensionChange,
        fileExtension,
        onResourceNameChange,
        resourceName
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, [])

    if(isLoading){
        return (
            <div className="UploadFileBody">
                <div>Loading ...</div>
            </div>
        )
    }

    return (        
        <div className='UploadFileBody-body'>
            
            <FileInput 
                filename = {selectedFile?.name}
                filesize = {selectedFile?.size}
                onChange = {onFileUploadValueChange}
            />

            <Radiobuttons
                options = {radiobuttonsOptions}
                onChange = {onRadioButtonChange}
                title = {'Select file type'}
            />

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

            <InputField
                label = {"File extension:"}
                fieldType = {"text"}
                placeholder = {"svg, png, jpg, pnml, bpmn, ..."}
                value = {fileExtension}
                onChange = {onFileExtensionChange}
            />
            
        </div>
    );
}

export default UploadFileBody;
