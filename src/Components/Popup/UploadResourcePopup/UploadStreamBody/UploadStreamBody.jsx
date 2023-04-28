import './UploadStreamBody.scss';
import {useState, useEffect} from 'react';
import Dropdown from '../../../Widgets/Dropdown/Dropdown';
import InputField from '../../../Widgets/InputField/InputField';

function UploadStreamBody(props) {

    const {
        fileDescription,
        onFileDescriptionChange,
        repositories,
        onFileDestinationDropdownChange,
        fileDestination,
        streamBrokerLocation,
        onStreamBrokerLocationChange,
        streamTopic,
        onStreamTopicChange,
        onResourceNameChange,
        resourceName
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, [])

    if(isLoading){
        return (
            <div className="UploadStreamBody">
                <div>Loading ...</div>
            </div>
        )
    }

    return (        
        <div className='UploadStreamBody-body'>
            
            <Dropdown
                options = {repositories}
                onValueChange = {onFileDestinationDropdownChange}
                label = {`Select the destination repository:`}
                value = {fileDestination}
            />
        
            <InputField
                label = {"Stream broker host:"}
                fieldType = {"text"}
                placeholder = {"Streambroker.org.net.com.org"}
                value = {streamBrokerLocation}
                onChange = {onStreamBrokerLocationChange}
            />
            <InputField
                label = {"Stream topic:"}
                fieldType = {"text"}
                placeholder = {"My_very_special_topic"}
                value = {streamTopic}
                onChange = {onStreamTopicChange}
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
                placeholder = {"Consider adding a description of the resource contents"}
                value = {fileDescription}
                onChange = {onFileDescriptionChange}
            />
            
        </div>
    );
}

export default UploadStreamBody;
