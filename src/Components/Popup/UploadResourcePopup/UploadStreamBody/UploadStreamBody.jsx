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
{/* 
            <div className='UploadStreamBody-description'>
                <div><b>Why "upload" a stream?</b></div>
                By uploading information on where the stream can be found, it is possible to ask other resources to subscribe to it.
            </div> */}

            <Dropdown
                options = {repositories}
                onValueChange = {onFileDestinationDropdownChange}
                label = {`Select the destination repository:`}
                value = {fileDestination}
            />
        
            <InputField
                label = {"Stream broker location:"}
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
