import './ActionPopup.scss';
import {useState, useEffect, useCallback} from 'react';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import PopupFooter from '../../Widgets/PopupFooter/PopupFooter';
import InputField from '../../Widgets/InputField/InputField';
// import HorizontalLine from '../../Widgets/HorizontalLine/HorizontalLine';
import { getMiners, getRepositories, getMiner } from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import { PostMineAction } from '../../../Services/MinerServices';
import { GetSingleFileMetadata } from '../../../Services/RepositoryServices';
import { GetRepositoryFilterMetadata } from '../../../Services/RepositoryServices';
import { getFileResourceLabel } from '../../../Utils/FileUnpackHelper';

function ActionPopup(props) {

    const {
        toggleActionPopupOpen,
        miner = {},
        getAndAddFile,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
    const [wizardStep, setWizardStep] = useState(1);
    const [minerObject, setMinerObject] = useState(null); // The single miner config selected from first step
    const [maxWizardStep, setMaxWizardStep] = useState(null);


    useEffect(() => {
        setIsLoading(false);
        onMinerHostChange(miner);
    }, []);

    useEffect(() => {
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
        } else {
            handleConfirmClick();
        }
    }

    // Force rerender
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    // ------------------ STEP 1 ------------------
        const miners = getMiners().map((miner, index) => { // Dropdown options 
            return {label: miner.name, value: miner.id}
        });
        const [minerHostDropdownValue, setMinerHostDropdownValue] = useState(null); // dropdown selected option

        const [minerHostMinersDropdownOptions, setMinerHostMinersDropdownOptions] = useState([]);
        const [selectedMinerHostMiner, setSelectedMinerHostMiner] = useState([]);

        const onMinerHostChange = (value) => {
            setMinerHostDropdownValue(value);
            const minerHost = getMiner(value.value);
            setMinerHostMinersDropdownOptions(minerHost?.config.map((miner) => {
                return {label: miner.Label, value: miner.MinerId}
            }));
        }

        const onMinerDropdownChange = (value) => {
            setMinerObject(getMiner(value.value));
            setSelectedMinerHostMiner(value);
            const minerHostObject = getMiner(minerHostDropdownValue.value);
            const miner = minerHostObject?.config.filter((minerFromHost) => {return (minerFromHost.MinerId === value.value)})[0];
            setMinerObject(miner);
            setSelectedParams(miner?.MinerParameters);
            convertFileTypeToDropdown(miner?.FileOutputExtension);
        }

        const convertFileTypeToDropdown = (fileOutputExtensions) => {
            if(fileOutputExtensions) setOutputFileTypeForDropdown(fileOutputExtensions.map((fileExtension) => {
                return ({label: fileExtension, value: fileExtension});
            }));
        }

    // ------------------ STEP 2 ------------------
        const repositories = getRepositories().map((repository, index) => { // dropdown options
            return {label: repository.name, value: repository.id}
        });
        const [repositoryFileOwnerDropdownSelected, setRepositoryFileOwnerDropdownSelected] = useState(null); // dropdown selected option
        const [selectedFiles, setSelectedFiles] = useState({});
        const [filteredFilesForDropdown, setFileredFilesForDropdown] = useState([])

        const convertFilesToDropdown = (files) => {
            return files.map((file) => ({label: getFileResourceLabel(file), value: file}) );
        }

        const setFilesFromRepository = (hostname) => {

            const uniqueResourceTypes = minerObject.ResourceInput.map((inputTypes) => {
                return inputTypes.ResourceType;
            }).filter((x, i, a) => a.indexOf(x) === i);

            let filteredFilesTemp = {};
            uniqueResourceTypes.forEach((filter) => {
                GetRepositoryFilterMetadata(hostname, [filter]).then(res => {
                    filteredFilesTemp[filter] = convertFilesToDropdown(res.data);
                    setFileredFilesForDropdown(filteredFilesTemp);                
                }).catch((e) => console.log(e));
            });
        }

        const onRepositoryDestinationDropdownChange = (value) => {
            setRepositoryDestination(value);
        }
    
        const onRepositoryFileOwnerDropdownChange = (value) => {
            setRepositoryFileOwnerDropdownSelected(value);
            setFilesFromRepository(value.label);
        }

        const onFileDropdownChange = (value, resourceName) => {
            let newSelectedFiles = selectedFiles;
            newSelectedFiles[resourceName] = value;
            setSelectedFiles(newSelectedFiles);
            forceUpdate();
        }
    
    // ------------------ STEP 3 ------------------

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
                if(param.selectedValue > param.max) param.selectedValue = param.max;
                if(param.selectedValue < param.min) param.selectedValue = param.min;
                setSelectedParams(params);
                forceUpdate();
            }
        }

    // ------------------ STEP 4 ------------------
        const [repositoryDestination, setRepositoryDestination] = useState(null);

        const [outputFileName, setOutputFileName] = useState("");
        const [selectedOutputFileType, setSelectedOutputFileType] = useState(null);

        const [outputFileTypeForDropdown, setOutputFileTypeForDropdown] = useState(null);

        const onFileOutputNameChange = (res) => {
            setOutputFileName(res.value);
        }
    
        // const onOutputFiletypeChange = (res) => {
        //     setSelectedOutputFileType(res);
        // }

    // ------------------ Buttons and other default behavior ------------------

    const handleNextButtonDisabled = () => {
        switch (wizardStep) {
            case 1:
                setNextButtonDisabled(!minerObject);
                break;
            case 2:
                const isFileValid = true//selectedLogFile || selectedVisualizationFile;
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
                // const isOutputFileValid = outputFileTypeForDropdown.some((option) => option) || selectedOutputFileType; // check if at least one output file option is selected
                // setNextButtonDisabled(!(repositoryDestination && outputFileName && isOutputFileValid));
                break;
            default:
                setNextButtonDisabled(false); // default to enabled
        }
    }

    const handleConfirmClick = () => {

        let files = {};
        minerObject?.ResourceInput?.forEach((resourceInput) => {
            files[resourceInput.Name] = selectedFiles[resourceInput.Name].value;
        });

        let params = {};
        if(selectedParams) 
            selectedParams.forEach(({ name, selectedValue, type }) => {
                params[name] = convertInputResponseToType(selectedValue, type);
            });

        var data = {
            MinerId: selectedMinerHostMiner.value,
            Input: {
                Resources: files,//selectedLogFile ? selectedLogFile : selectedVisualizationFile,
                MinerParameters: params ? params : {},
            },
            Output: {
                Host: `${repositoryDestination.label}/resources/files/`,
                HostInit: `${repositoryDestination.label}/resources/info/`,
                ResourceLabel: outputFileName,
                FileExtension: minerObject.ResourceOutput.FileExtension//selectedOutputFileType?.value ? selectedOutputFileType.value : outputFileTypeForDropdown[0].value,
            }
        };
        
        setIsLoading(true);

        PostMineAction(minerHostDropdownValue.label, data)
            .then((res) => {
                GetSingleFileMetadata(repositoryDestination.label, res.data)
                    .then((res) => {
                        getAndAddFile(res.data);
                    })
                    .catch(() => {
                        alert("Something went wrong. There might an issue with the requested resource, or the repository. Please try again.");
                    });
            })
            .then(() => {
                toggleActionPopupOpen();
                setIsLoading(false);
            })
            .catch((err) => {
                alert("Something went wrong. Please try to reload your browser and check status of the requested resources");
                toggleActionPopupOpen();
                setIsLoading(false);
            });
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
            
            <div className='ActionPopup' 
                onClick = {(e) => {e.stopPropagation()}}
            >

                <PopupHeader
                    title = {`New action`}
                    closePopup = {toggleActionPopupOpen}
                />

                <div className='ActionPopup-wizard-steps'>
                    <div className={`ActionPopup-wizard-step ActionPopup-wizard-step-${wizardStep === 1 ? "selected": ""}
                        ActionPopup-wizard-step-${maxWizardStep >= 1 ? "clickable": "non-clickable"}
                    `} onClick = {() => {handleWizardStepsClick(1)}}>
                        <span className='ActionPopup-wizard-step-text'>1. Miner</span>
                    </div>
                    <div className={`ActionPopup-wizard-step ActionPopup-wizard-step-${wizardStep === 2 ? "selected": ""}
                        ActionPopup-wizard-step-${maxWizardStep >= 2 ? "clickable": "non-clickable"}
                    `} onClick = {() => {handleWizardStepsClick(2)}}>
                        <span className='ActionPopup-wizard-step-text'>2. Inputs</span>
                    </div>
                    <div className={`ActionPopup-wizard-step ActionPopup-wizard-step-${wizardStep === 3 ? "selected": ""}
                        ActionPopup-wizard-step-${maxWizardStep >= 3 ? "clickable": "non-clickable"}
                    `} onClick = {() => {handleWizardStepsClick(3)}}>
                        <span className='ActionPopup-wizard-step-text'>3. Parameters</span>
                    </div>
                    <div className={`ActionPopup-wizard-step ActionPopup-wizard-step-${wizardStep === 4 ? "selected": ""}
                        ActionPopup-wizard-step-${maxWizardStep >= 4 ? "clickable": "non-clickable"}
                    `} onClick = {() => {handleWizardStepsClick(4)}}>
                        <span className='ActionPopup-wizard-step-text'>4. Repository</span>
                    </div>
                </div>

                {/* ------------------ STEP 1 ------------------ */}

                {wizardStep === 1 ? 
                    <div className='ActionPopup-wizard-step1'>
                        <Dropdown
                            options = {miners}
                            onValueChange = {onMinerHostChange}
                            label = {`Select miner host`}
                            value = {minerHostDropdownValue}
                        />
                        {(minerHostDropdownValue && minerHostMinersDropdownOptions) &&
                            <Dropdown
                            options = {minerHostMinersDropdownOptions}
                            onValueChange = {onMinerDropdownChange}
                            label = {`Select miner`}
                            value = {selectedMinerHostMiner}
                        />}
                    </div>
                : null}

                {/* ------------------ STEP 2 ------------------ */}

                {wizardStep === 2 ? 
                    <div className='ActionPopup-wizard-step2'>
                        <Dropdown
                            options = {repositories}
                            onValueChange = {onRepositoryFileOwnerDropdownChange}
                            label = {`Select repository to search for file:`}
                            value = {repositoryFileOwnerDropdownSelected}
                        />

                        {repositoryFileOwnerDropdownSelected && 
                            minerObject?.ResourceInput?.map((resourceInput, index) => {
                                return(
                                    <Dropdown
                                        options = {filteredFilesForDropdown[resourceInput.ResourceType]}
                                        onValueChange = {onFileDropdownChange}
                                        label = {`Select ${resourceInput.Name} file:`}
                                        value = {selectedFiles[resourceInput.Name]}
                                        extraParam = {resourceInput.Name}
                                        key = {index}
                                    />
                                )
                            })
                        }
                    </div> 

                : null}

                {/* ------------------ STEP 3 ------------------ */}

                {wizardStep === 3 ? 
                    <div className='ActionPopup-wizard-step3'>
                        <div className='ActionPopup-wizard-parameter-inputs'>
                            {selectedParams === null || selectedParams === undefined || selectedParams?.length === 0 ? 
                                <span>Miner requires no parameters</span> :
                                selectedParams.map((param, index) => {
                                    const type = getInputType(param);
                                    return (
                                        <InputField
                                            key = {index}
                                            label = {param.name}
                                            fieldType = {type}
                                            placeholder = {type}
                                            min = {param.min}
                                            index = {index}
                                            max = {param.max}
                                            value = {param.selectedValue}
                                            onChange = {onParamValueChange}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div> 
                : null}

                {/* ------------------ STEP 4 ------------------ */}

                {wizardStep === 4 ? 
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

                        <div>
                            output filetype:
                        </div>
                        <div>
                            {`${minerObject.ResourceOutput.ResourceType} ${minerObject.ResourceOutput.FileExtension}`}
                        </div>


                        {/* {(outputFileTypeForDropdown && outputFileTypeForDropdown.length > 1) ? 
                            <Dropdown
                                options = {outputFileTypeForDropdown}
                                onValueChange = {onOutputFiletypeChange}
                                label = {`Select output filetype:`}
                                value = {selectedOutputFileType}
                            /> : <div className='Dropdown-length-1'>
                                    <div className='Dropdown-legnth-1-label'>
                                        Selected output filetype:
                                    </div>
                                    <div className='Dropdown-legnth-1-text'>
                                        {outputFileTypeForDropdown[0].label}
                                    </div>
                                </div>
                        } */}
                    </div> 
                : null}

                <PopupFooter
                    onCancelClick = {handleCancelButtonClick}
                    onNextClick = {handleNextButtonClick}
                    cancelText = {getCancelButtonName()}
                    nextText = {getNextButtonName()}
                    nextButtonDisabled = {nextButtonDisabled}
                />

            </div>
        </BackdropModal>
    );
}

export default ActionPopup;
