import './ActionPopup.scss';
import {useState, useEffect, useCallback} from 'react';
import { 
    getMinersLocal, 
    getRepositoriesLocal, 
    getHostLocal, 
    saveProcessLocal, 
    saveInputValuesLocal, 
    getSavedInputValuesLocal 
} from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import { PostMineAction } from '../../../Services/MinerServices';
import { GetRepositoryFilterMetadata } from '../../../Services/RepositoryServices';
import { 
    getFileResourceLabel, 
    getFileExtension, 
    getFileResourceType, 
    getFileResourceId,
    fileBuilder,
    getFileStreamTopic,
    getFileHost
} from '../../../Utils/FileUnpackHelper';
import {v4 as uuidv4} from 'uuid';
import ActionPopupWizardSteps from './ActionPopupWizardSteps/ActionPopupWizardSteps';
import ActionPopupPage1Miner from './ActionPopupPages/ActionPopupPage1Miner/ActionPopupPage1Miner';
import ActionPopupPage2Inputs from './ActionPopupPages/ActionPopupPage2Inputs/ActionPopupPage2Inputs';
import ActionPopupPage3Parameters from './ActionPopupPages/ActionPopupPage3Parameters/ActionPopupPage3Parameters';
import ActionPopupPage4Repository from './ActionPopupPages/ActionPopupPage4Repository/ActionPopupPage4Repository';
import Popup from '../../Widgets/Popup/Popup';

function ActionPopup(props) {

    const {
        toggleActionPopupOpen,
        miner = {},
        openInformationPrompt
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
    const [wizardStep, setWizardStep] = useState(1);
    const [minerObject, setMinerObject] = useState(null); // The single miner config selected from first step
    const [maxWizardStep, setMaxWizardStep] = useState(null);
    
    // Force rerender
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(() => { // Component mounted
        setIsLoading(false);
        onMinerHostChange(miner); // If clicking miner in configure host miner, select that as the miner host
    }, []);

    useEffect(() => { // Component mounted and updated
        handleNextButtonDisabled();
    });

    const getNextButtonName = () => {
        return wizardStep === 4 ? 'confirm' : 'next' 
    }

    const getCancelButtonName = () => {
        return wizardStep === 1 ? 'Cancel' : 'Back' 
    }

    const handleNextButtonClick = () => {
        if(wizardStep !== 4) {
            setWizardStep(wizardStep + 1)
            if(wizardStep + 1 >= maxWizardStep) setMaxWizardStep(wizardStep + 1);
            if(wizardStep === 2 && minerObject?.MinerParameters.length <= 0) setWizardStep(wizardStep + 2); // Skip step 3 if no parameters
            if(wizardStep === 1) checkAndApplySavedInputValues(minerHostDropdownValue.value, minerObject);
        } else {
            handleConfirmClick();
        }
    }

    // --------------------------------------------
    // ------------------ STEP 1 ------------------
    // --------------------------------------------
    const miners = getMinersLocal().filter((miner) => miner.status === "online").map((miner) => { // Dropdown options for miner hosts
        return {label: miner.name, value: miner.id}
    });
    const [minerHostDropdownValue, setMinerHostDropdownValue] = useState(null); // Selected miner host
    const [minerHostMinersDropdownOptions, setMinerHostMinersDropdownOptions] = useState([]); // Dropdown options for miners
    const [selectedMinerHostMiner, setSelectedMinerHostMiner] = useState([]); // Selected miner {label: miner.MinerLabel, value: miner.MinerId}

    const onMinerHostChange = (value) => { // Onchange function on miner host dropdown
        setMinerHostDropdownValue(value);
        const minerHost = getHostLocal(value.value);
        setMinerHostMinersDropdownOptions(minerHost?.config.map((miner) => {
            return {label: miner.MinerLabel, value: miner.MinerId}
        }));
    }

    const onMinerDropdownChange = (value) => { // Onchange function on miner dropdown
        setSelectedMinerHostMiner(value);
        const minerHostObject = getHostLocal(minerHostDropdownValue.value);
        const miner = minerHostObject?.config.filter((minerFromHost) => {return (minerFromHost.MinerId === value.value)})[0];
        setMinerObject(miner);
        setSelectedParams(miner?.MinerParameters);
    }

    // --------------------------------------------
    // ------------------ STEP 2 ------------------
    // --------------------------------------------

    const repositories = getRepositoriesLocal().filter((repository) => {
        return repository.status === "online"
    }).map((repository, index) => { // dropdown options for repositories
        return {label: repository.name, value: repository.id}
    });
    const [repositoryFileOwnerDropdownSelected, setRepositoryFileOwnerDropdownSelected] = useState(null); // dropdown selected option for repository {label: repository.name, value: repository.id}
    const [selectedFiles, setSelectedFiles] = useState({});
    const [filteredFilesForDropdown, setFileredFilesForDropdown] = useState([])

    const convertFilesToDropdown = (files) => {
        return files.map((file) => {
            const prefix = getFileExtension(file) ? `${getFileExtension(file).toUpperCase()}` : `${getFileResourceType(file)}`;
            const label = `${prefix} \t ${getFileResourceLabel(file)}`;
            // <> // use this instead for a prettier structure of files. But it removes search option from dropdown
            //     <div className='ActionPopup-dropdown-item'>
            //         <div className='ActionPopup-dropdown-item-prefix'>
            //             {`${prefix}`}
            //         </div>  
            //         <div className='ActionPopup-dropdown-item-label'>
            //             {`${getFileResourceLabel(file)}`}
            //         </div>
            //     </div>
            // </>
            return ({label: label, value: file})
        });
    }

    const getUniqueResourceTypesFromMinerObject = (retries = 0) => {
        return minerObject.ResourceInput.map((inputTypes) => {
            return inputTypes.ResourceType;
        }).filter((x, i, a) => a.indexOf(x) === i);
    }

    const setFilesFromRepository = (hostname, minerObject) => { // Create list of files for each filter type - minerObject is optional param used to ensure it exists when needed instead of waiting for state to be set
        let filteredFilesTemp = {};
        getUniqueResourceTypesFromMinerObject().forEach((filter) => {
            GetRepositoryFilterMetadata(hostname, [filter]) // Get files of each filter
            .then(res => {
                // --------------- This piece of code will remove files from selectedFiles that are not in the new list of possible files ---------------
                if(selectedFiles && Object.keys(selectedFiles).length > 0) { // If selectedFiles is not empty
                    const filesMetadata = Object.keys(selectedFiles).map((inputName) => {
                        return selectedFiles[inputName].value;
                    }).filter(selectedMetadata => 
                        res.data.find(metadata => getFileResourceId(metadata) === getFileResourceId(selectedMetadata)) 
                    );
                    setSelectedFiles(filesMetadata);
                }

                // setting the dropdown options for each filter type
                filteredFilesTemp[filter] = convertFilesToDropdown(res.data); // Assign files to filter key in object {filter1: [files], filter2: [files]}      
            })
            .then(() => {
                setFileredFilesForDropdown(filteredFilesTemp) // Set filteredFilesTemp in state
            }) 
            .catch((e) => console.log(e));
        });
    }

    const onRepositoryFileOwnerDropdownChange = (value) => { // Onchange function on repository dropdown 
        const host = getHostLocal(value.value);
        if(!host || host.status === "offline") return;
        setRepositoryFileOwnerDropdownSelected(value);
        setFilesFromRepository(value.label);
    }

    const onFileDropdownChange = (value, resourceName) => { // Onchange function for all file dropdowns
        setSelectedFiles({...selectedFiles, [resourceName]: value});
        forceUpdate();
    }
    
    // --------------------------------------------
    // ------------------ STEP 3 ------------------
    // --------------------------------------------

    const [selectedParams, setSelectedParams] = useState([]);

    const getInputType = (param) => {
        switch(param.type){
            case 'string': return 'text';
            case 'int' : return 'number';
            case 'float': return 'number';
            case 'bool': return 'checkbox';
            case 'double': return 'number';
            default: return 'text';
        }
    }

    const convertInputResponseToType = (value, type) => {
        switch(type){
            case 'string': return value;
            case 'int' : return parseInt(value);
            case 'float': return parseFloat(value);
            case 'bool': return value;
            case 'double': return parseFloat(value);
            default: return value;
        }
    }

    const onParamValueChange = (res) => { // param = {value: e.target.value, index: index}
        let params = selectedParams;
        if(params) {
            const param = params[res.index];
            param.selectedValue = res.value;
            if(param.selectedValue > param.Max) param.selectedValue = param.Max;
            if(param.selectedValue < param.Min) param.selectedValue = param.Min;
            setSelectedParams(params);
            forceUpdate();
        }
    }

    // --------------------------------------------
    // ------------------ STEP 4 ------------------
    // --------------------------------------------

        const [repositoryDestination, setRepositoryDestination] = useState(null);
        const [outputFileName, setOutputFileName] = useState("");
        const [streamTopic, setStreamTopic] = useState("");
        const [streamDestination, setStreamDestination] = useState("");
        const [overrideStreamResource, setOverrideStreamResource] = useState(true);

        const onFileOutputNameChange = (res) => {
            setOutputFileName(res.value);
        }

        const onRepositoryDestinationDropdownChange = (value) => {
            setRepositoryDestination(value);
        }

        const onStreamTopicChange = (res) => {
            setStreamTopic(res.value);
        }

        const onStreamDestinationChange = (res) => {
            setStreamDestination(res.value);
        }

        const onOverrideStreamResourceChange = () => {
            setOverrideStreamResource(!overrideStreamResource);
        }

    // ------------------------------------------------------------------------
    // ------------------ Buttons and other default behavior ------------------
    // ------------------------------------------------------------------------

    const handleNextButtonDisabled = () => {
        switch (wizardStep) {
            case 1:
                setNextButtonDisabled(!minerObject);
                break;
            case 2:
                const isFileValid = Object.keys(selectedFiles).length >= minerObject.ResourceInput.length; // check if all files are selected
                setNextButtonDisabled(!(repositoryFileOwnerDropdownSelected && isFileValid));
                break;
            case 3:
                if (!selectedParams) setNextButtonDisabled(false);
                else {
                    const isParamValid = selectedParams.filter((param) => !param.selectedValue).length === 0; // check if all selected values are defined, not null or false
                    setNextButtonDisabled(!isParamValid);
                }
                break;
            case 4:
                setNextButtonDisabled(!repositoryDestination || !outputFileName); // check if repository dropdown value and output file name is defined
                break;
            default:
                setNextButtonDisabled(false); // default to enabled
        }
    }

    /* 
        Save process to localstorage
        This will be used to display the process in the process list

        All running statuses will be pinged from app.jsx - calling the pingAllProcesses function
        This will update the status of the process in the process list
        And handle saving files, and updating the file contents
    */
    const handleSaveProcess = (processId, resourceLabel) => {
        const status = {
            id: uuidv4(),
            objectType: "process",
            hostname: getHostLocal(minerHostDropdownValue.value).name,
            processId: processId,
            processName: minerObject.MinerLabel,
            status: "Running",
            progress: 0,
            startTime: new Date().getTime(),
            endTime: null,
            outputDestination: repositoryDestination.label,
            error: null,
            resourceId: null,
            saveOrUpdateFile: true,
            resourceLabel: resourceLabel,
        };
        saveProcessLocal(status);
    }

    const convertFilesToDictionary = () => {
        let filesDictionary = {};
        minerObject?.ResourceInput?.forEach((resourceInput) => { // Convert files to object {param1: file1, param2: file2}
            filesDictionary[resourceInput.Name] = selectedFiles[resourceInput.Name].value;
        });
        return filesDictionary;
    }

    const convertParamsToDictionary = (selectedParams) => {
        let params = {};
        if(selectedParams) 
            selectedParams.forEach(({ name, selectedValue, type }) => { // Convert params to object {param1: value1, param2: value2}
                params[name] = convertInputResponseToType(selectedValue, type);
            });
        return params;
    }

    // This function was created to allow docker containers to be called by their altered hostname
    const getMinerCallableHostName = (repositoryUrl) => {
        const repositoryConfig = getRepositoriesLocal().find(repository => repository.name === repositoryUrl).config;
        return repositoryConfig.AlteredHostname ? repositoryConfig.AlteredHostname : repositoryUrl;
    }

    // This function was created to allow docker containers to be called by their altered hostname
    const getHostDestination = () => {
        const isStreamOutput = minerObject.ResourceOutput.ResourceType === "EventStream";
        const host = isStreamOutput ? streamDestination : `${getMinerCallableHostName(repositoryDestination.label)}/resources/`;
        return host;
    }

    // This function was created to allow docker containers to be called by their altered hostname
    const getHostInit = () => {
        return `${getMinerCallableHostName(repositoryDestination.label)}/resources/metadata/`;
    }

    const setFileHostForAllFiles = () => {
        const files = convertFilesToDictionary();
        const newFiles = {}
        Object.keys(files).forEach((inputName) => {
            const file = files[inputName];
            const newFile = fileBuilder(file, {
                Host: getFileStreamTopic(file) ? getFileHost(file) : `${getMinerCallableHostName(repositoryFileOwnerDropdownSelected.label)}/resources/`, 
                fileContent: "null"
            });
            newFiles[inputName] = newFile;
        });
        return newFiles;
    }

    const handleConfirmClick = () => {
        setIsLoading(true);
        // const isStreamOutput = minerObject.ResourceOutput.ResourceType === "EventStream";
        // const host = isStreamOutput ? streamDestination : `${repositoryDestination.label}/resources/`;

        var data = {
            MinerId: minerObject.MinerId,
            Input: {
                // Resources: convertFilesToDictionary(minerObject?.ResourceInput),
                Resources: setFileHostForAllFiles(),
                MinerParameters: convertParamsToDictionary(selectedParams),// params ? params : {},
            },
            Output: {
                // Host: host,
                Host: getHostDestination(),
                // HostInit: `${repositoryDestination.label}/resources/metadata/`,
                HostInit: getHostInit(),
                ResourceLabel: outputFileName,
                FileExtension: minerObject.ResourceOutput.FileExtension,//selectedOutputFileType?.value ? selectedOutputFileType.value : outputFileTypeForDropdown[0].value,
                StreamTopic: streamTopic,
                Overwrite: overrideStreamResource,
            }
        };

        PostMineAction(minerHostDropdownValue.label, data)
            .then((res) => {
                handleSaveProcess(res.data, outputFileName);
            })
            .then(() => {
                handleSaveInputValues();
                toggleActionPopupOpen();
                openInformationPrompt({
                    title: "Process started",
                    text: "Check process status in the process list. The output will be visible in the sidebar once complete.",
                    closeButtonText: "Close",
                });
                setIsLoading(false);
            })
            .catch((err) => {
                openInformationPrompt({
                    title: "Process failed",
                    text: `Something went wrong when trying to start the requested resource ${err}`,
                    closeButtonText: "Close",
                });
                toggleActionPopupOpen();
                setIsLoading(false);
            });
    }

    const handleSaveInputValues = () => {
        const fileValues = {}
        Object.keys(selectedFiles).forEach(inputName => {
            fileValues[inputName] = selectedFiles[inputName].value;
        });
        const inputValues = {
            repositoryFileOwnerDropdownSelected: repositoryFileOwnerDropdownSelected,
            selectedFiles: fileValues,//selectedFiles.map(selectedFile => selectedFile.value),
            selectedParams: selectedParams,
            repositoryDestination: repositoryDestination,
            outputFileName: outputFileName,
            streamTopic: streamTopic,
            streamDestination: streamDestination,
        };
        saveInputValuesLocal(minerHostDropdownValue.value, minerObject.MinerId, inputValues);
    }

    const checkAndApplySavedInputValues = (minerHostId, minerObject) => {
        const minerId = minerObject.MinerId;
        const savedInputValues = getSavedInputValuesLocal(minerHostId, minerId);
        if(savedInputValues) {
            onRepositoryFileOwnerDropdownChange(savedInputValues.repositoryFileOwnerDropdownSelected);
            Object.keys(savedInputValues.selectedFiles).forEach((inputName) => {
                const file = savedInputValues.selectedFiles[inputName];
                const dropdownValue = convertFilesToDropdown([file])[0];
                onFileDropdownChange(dropdownValue, `${inputName}`);
            })
            savedInputValues.selectedParams.forEach((param, index) => {
                const paramInputValue = {value: param.selectedValue, index: index}
                onParamValueChange(paramInputValue);
            });
            onRepositoryDestinationDropdownChange(savedInputValues.repositoryDestination);
            onFileOutputNameChange({value: savedInputValues.outputFileName});

            if(minerObject.ResourceOutput.ResourceType === "EventStream") {
                onStreamTopicChange({value: savedInputValues.streamTopic});
                onStreamDestinationChange({value: savedInputValues.streamDestination});
            }
            // setWizardStep(4);
            setMaxWizardStep(4)
        }
    }

    const handleCancelButtonClick = () => {
        if(wizardStep !== 1) setWizardStep(wizardStep - 1) 
        else {
            setWizardStep(wizardStep)
            toggleActionPopupOpen()
        };
    }

    const handleWizardStepsClick = (index) => {
        if(index <= maxWizardStep) setWizardStep(index);
    }

    if(isLoading){
        return (
            <div className="ActionPopup">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <BackdropModal closeModal = {toggleActionPopupOpen} showSpinner={isLoading}>
            <Popup
                title = {`New action`}
                closePopup = {toggleActionPopupOpen}
                onCancelClick = {handleCancelButtonClick}
                onNextClick = {handleNextButtonClick}
                cancelText = {getCancelButtonName()}
                nextText = {getNextButtonName()}
                nextButtonDisabled = {nextButtonDisabled}
            >

                <ActionPopupWizardSteps
                    wizardStep = {wizardStep}
                    maxWizardStep = {maxWizardStep}
                    handleWizardStepsClick = {handleWizardStepsClick}
                />

                {wizardStep === 1 ? 
                    <ActionPopupPage1Miner
                        miners = {miners}
                        onMinerHostChange = {onMinerHostChange}
                        minerHostDropdownValue = {minerHostDropdownValue}
                        minerHostMinersDropdownOptions = {minerHostMinersDropdownOptions}
                        onMinerDropdownChange = {onMinerDropdownChange}
                        selectedMinerHostMiner = {selectedMinerHostMiner}
                    />
                : null}

                {wizardStep === 2 ? 
                    <ActionPopupPage2Inputs
                        repositories = {repositories}
                        onRepositoryFileOwnerDropdownChange = {onRepositoryFileOwnerDropdownChange}
                        repositoryFileOwnerDropdownSelected = {repositoryFileOwnerDropdownSelected}
                        minerObject = {minerObject}
                        filteredFilesForDropdown = {filteredFilesForDropdown}
                        onFileDropdownChange = {onFileDropdownChange}
                        selectedFiles = {selectedFiles}
                    /> : null}

                {wizardStep === 3 ? 
                    <ActionPopupPage3Parameters
                        selectedParams = {selectedParams}
                        onParamValueChange = {onParamValueChange}
                        getInputType = {getInputType}
                    /> : null}

                {wizardStep === 4 ? 
                    <ActionPopupPage4Repository
                        repositories = {repositories}
                        onRepositoryDestinationDropdownChange = {onRepositoryDestinationDropdownChange}
                        repositoryDestination = {repositoryDestination}
                        outputFileName = {outputFileName}
                        onFileOutputNameChange = {onFileOutputNameChange}
                        minerObject = {minerObject}
                        streamDestination = {streamDestination}
                        streamTopic = {streamTopic}
                        onStreamTopicChange = {onStreamTopicChange}
                        onStreamDestinationChange = {onStreamDestinationChange}
                        onOverrideStreamResourceChange = {onOverrideStreamResourceChange}
                        overrideStreamResource = {overrideStreamResource}
                    /> : null}
            </Popup>
        </BackdropModal>
    );
}

export default ActionPopup;
