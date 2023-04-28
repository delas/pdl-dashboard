import './ActionPopupPage4Repository.scss';
import Dropdown from '../../../../Widgets/Dropdown/Dropdown';
import InputField from '../../../../Widgets/InputField/InputField';
import Checkbox from '../../../../Widgets/Checkbox/Checkbox';

function ActionPopupPage4Repository(props) {

    const {
        repositories,
        onRepositoryDestinationDropdownChange,
        repositoryDestination,
        outputFileName,
        onFileOutputNameChange,
        minerObject,
        streamDestination,
        streamTopic,
        onStreamTopicChange,
        onStreamDestinationChange,
        onOverrideStreamResourceChange,
        overrideStreamResource,
    } = props;

    const isStreamOutput = minerObject.ResourceOutput.ResourceType === "EventStream";

    return (
        <div className='ActionPopup-wizard-step4'>
            <Dropdown
                options = {repositories}
                onValueChange = {onRepositoryDestinationDropdownChange}
                label = {`Select the destination repository`}
                value = {repositoryDestination}
            />

            <InputField
                label = {"Name of output resource"}
                fieldType = {"text"}
                placeholder = {"Please choose a name for the output generated by the algorithm"}
                value = {outputFileName}
                onChange = {onFileOutputNameChange}
            />

            {isStreamOutput && 
                <InputField
                    label = {"Stream broker"}
                    fieldType = {"text"}
                    placeholder = {"mqtt.eclipseprojects.io"}
                    value = {streamDestination}
                    onChange = {onStreamDestinationChange}
                />}

            {isStreamOutput && 
                <InputField
                    label = {"Stream topic"}
                    fieldType = {"text"}
                    placeholder = {"Hello_world_stream_topic"}
                    value = {streamTopic}
                    onChange = {onStreamTopicChange}
                />}

            {isStreamOutput &&
                <Checkbox
                    title = {"Override resource if it already exists (combination of stream broker and -topic)"}
                    value = {overrideStreamResource}
                    onChange = {onOverrideStreamResourceChange}
                    labelPosition = {'top'}
                />
            }            

            <div>
                output filetype:
            </div>
            <div>
                {`${minerObject.ResourceOutput.ResourceType} ${minerObject.ResourceOutput.FileExtension ? minerObject.ResourceOutput.FileExtension : ""}`}
            </div>
        </div> 
    );
}

export default ActionPopupPage4Repository;