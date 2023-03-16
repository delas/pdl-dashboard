import './ActionPopup.scss';
import {useState, useEffect, useCallback} from 'react';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import PopupFooter from '../../Widgets/PopupFooter/PopupFooter';
import InputField from '../../Widgets/InputField/InputField';
import HorizontalLine from '../../Widgets/HorizontalLine/HorizontalLine';
import { getMiners, getRepositories, getMiner } from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import { PostMineAction } from '../../../Services/MinerServices';
import {GetVisFilesMetadata, GetLogFilesMetadata} from '../../../Services/RepositoryServices';

function ActionPopup(props) {

    const {
        toggleActionPopupOpen,
        miner = {},
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState(1);
    const [minerDestination, setMinerDestination] = useState(null);
    
    const [repositoryFileOwner, setRepositoryFileOwner] = useState(null);
    const [repositoryDestination, setRepositoryDestination] = useState(null);
    const [selectedVisualizationFile, setSelectedVisualizationFile] = useState(null);
    const [selectedLogFile, setSelectedLogFile] = useState(null);
    const [minerObject, setMinerObject] = useState(null);

    const [visFilesForDropdown, setVisFilesForDropdown] = useState([]);
    const [logFilesForDropdown, setLogFilesForDropdown] = useState([]);
    const [visDropdownLoading, setVisDropdownLoading] = useState(false);
    const [logDropdownLoading, setLogDropdownLoading] = useState(false);
    const [selectedParams, setSelectedParams] = useState([]);
    const [fileOutputName, setFileOutputName] = useState("");
    const [fileOutputType, setFileOutputType] = useState(null);

    const [outputFileTypeForDropdown, setOutputFileTypeForDropdown] = useState(null);
 
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(() => {
        setIsLoading(false);
        onMinerChange(miner);
    }, []);

    const setFilesFromRepository = (hostname) => {
        GetVisFilesMetadata(hostname).then(res => {
            setVisFilesForDropdown(convertFilesToDropdown(res.data))
        }).then(
            setVisDropdownLoading(false)
        );
        GetLogFilesMetadata(hostname).then(res => {
            setLogFilesForDropdown(convertFilesToDropdown(res.data))
        }).then(
            setLogDropdownLoading(false)
        );
    }

    const onMinerChange = (value) => {
        setMinerDestination(value);
        const miner = getMiner(value.value);
        setMinerObject(miner);
        setSelectedParams(miner.config.MinerParameters);
        convertFileTypeToDropdown(miner.config.FileOutputExtension);
    }

    const miners = getMiners().map((miner, index) => {
        return {label: miner.name, value: miner.id}
    });
    
    const repositories = getRepositories().map((repository, index) => {
        return {label: repository.name, value: repository.id}
    });

    const convertFilesToDropdown = (files) => {
        return files.map((file) => ({label: file.FileLabel, value: file}) );
    }

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

    const onRepositoryDestinationDropdownChange = (value) => {
        setRepositoryDestination(value);
    }

    const onRepositoryFileOwnerDropdownChange = (value) => {
        setRepositoryFileOwner(value);
        setFilesFromRepository(value.label);
    }

    const onMinerDropdownChange = (value) => {
        setMinerDestination(value);
    }

    const onLogFileDropdownChange = (value) => {
        setSelectedLogFile(value);
        setSelectedVisualizationFile(null);
    }

    const onVisualizationFileDropdownChange = (value) => {
        setSelectedVisualizationFile(value);
        setSelectedLogFile(null);
    }

    const getNextButtonName = () => {
        return selected === 4 ? 'confirm' : 'next' 
    }

    const getCancelButtonName = () => {
        return selected === 1 ? 'Cancel' : 'Back' 
    }

    const handleNextButtonClick = () => {
        selected !== 4 ? setSelected(selected + 1) : handleConfirmClick();
    }

    const handleConfirmClick = () => {
        const file = selectedLogFile ? selectedLogFile.value : selectedVisualizationFile.value;
        const params = {}
        selectedParams.forEach((param) => {
            params[param.name] = convertInputResponseToType(param.selectedValue, param.type)
        });
        var data = {
            Input: {
                MetadataObject: file,//selectedLogFile ? selectedLogFile : selectedVisualizationFile,
                MinerParameters: params,
            },
            Output: {
                Host: `${repositoryDestination.label}/resources/`,
                ResourceLabel: fileOutputName,
                FileExtension: fileOutputType.value,
            }
        };     
        PostMineAction(minerDestination.label, data).then((res) => console.log(res));
    }

    const handleCancelButtonClick = () => {
        if(selected !== 1) 
        setSelected(selected - 1) 
        else {
            setSelected(selected)
            toggleActionPopupOpen()
        };
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

    const onFileOutputNameChange = (res) => {
        setFileOutputName(res.value);
    }

    const convertFileTypeToDropdown = (FileOutputExtensions) => {
        setOutputFileTypeForDropdown(
            FileOutputExtensions.map((fileExtension) => {
                return ({label: fileExtension, value: fileExtension});
            })
        );
    }

    const onOutputFiletypeChange = (res) => {
        console.log(res);
        setFileOutputType(res);
    }

    if(isLoading){
        return (
            <div className="ActionPopup">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <BackdropModal closeModal = {toggleActionPopupOpen}>
            
            <div className='ActionPopup' 
                onClick = {(e) => {e.stopPropagation()}}
            >

                <PopupHeader
                    title = {`New action`}
                    closePopup = {toggleActionPopupOpen}
                />

                <div className='ActionPopup-wizard-steps'>
                    <div className={`ActionPopup-wizard-step ActionPopup-wizard-step-${selected === 1 ? "selected": ""}`}>
                        <span className='ActionPopup-wizard-step-text'>1. Miner</span>
                    </div>
                    <div className={`ActionPopup-wizard-step ActionPopup-wizard-step-${selected === 2 ? "selected": ""}`}>
                        <span className='ActionPopup-wizard-step-text'>2. Inputs</span>
                    </div>
                    <div className={`ActionPopup-wizard-step ActionPopup-wizard-step-${selected === 3 ? "selected": ""}`}>
                        <span className='ActionPopup-wizard-step-text'>3. Parameters</span>
                    </div>
                    <div className={`ActionPopup-wizard-step ActionPopup-wizard-step-${selected === 4 ? "selected": ""}`}>
                        <span className='ActionPopup-wizard-step-text'>4. Repository</span>
                    </div>
                </div>

                {/* ------------------ STEP 1 ------------------ */}

                {selected === 1 ? 
                    <div className='ActionPopup-wizard-step1'>
                        <Dropdown
                            options = {miners}
                            onValueChange = {onMinerDropdownChange}
                            label = {`Select miner`}
                            value = {minerDestination}
                        />
                    </div>
                : null}

                {/* ------------------ STEP 2 ------------------ */}

                {selected === 2 ? 
                    <div className='ActionPopup-wizard-step2'>
                        <Dropdown
                            options = {repositories}
                            onValueChange = {onRepositoryFileOwnerDropdownChange}
                            label = {`Select repository to search for file:`}
                            value = {repositoryFileOwner}
                        />
                        {repositoryFileOwner &&
                            <div className='ActionPopup-wizard-step2-fileExplained'>Select one file from either:</div>
                        }

                        {logDropdownLoading ? <div>Loading...</div> :
                            (repositoryFileOwner && minerObject.config.ResourceInputType === "EventLog") && 
                            <Dropdown
                                options = {logFilesForDropdown}
                                onValueChange = {onLogFileDropdownChange}
                                label = {`Log file:`}
                                value = {selectedLogFile}
                            />
                        }
                        {visDropdownLoading ? <div>Loading...</div> :
                            (repositoryFileOwner && minerObject.config.ResourceInputType === "Visualization") && 
                            <Dropdown
                                options = {visFilesForDropdown}
                                onValueChange = {onVisualizationFileDropdownChange}
                                label = {`Visualization file:`}
                                value = {selectedVisualizationFile}
                            />
                        }
                    </div> 

                : null}

                {/* ------------------ STEP 3 ------------------ */}

                {selected === 3 ? 
                    <div className='ActionPopup-wizard-step3'>
                        <div className='ActionPopup-wizard-parameter-inputs'>
                            {selectedParams === null || selectedParams === undefined || selectedParams?.length === 0 ? 
                                <span>Miner requires no parameters</span> :
                                selectedParams.map((param, index) => {
                                    const type = getInputType(param);
                                    return (
                                        <>
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
                                        {index < minerObject.config.MinerParameters?.length - 1 ? <HorizontalLine/> : null}
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div> 
                : null}

                {/* ------------------ STEP 4 ------------------ */}

                {selected === 4 ? 
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
                            value = {fileOutputName}
                            onChange = {onFileOutputNameChange}
                        />

                        {(outputFileTypeForDropdown && outputFileTypeForDropdown.length > 1) ? 
                            <Dropdown
                                options = {outputFileTypeForDropdown}
                                onValueChange = {onOutputFiletypeChange}
                                label = {`Select output filetype:`}
                                value = {fileOutputType}
                            /> : <div className='Dropdown-length-1'>
                                    <div className='Dropdown-legnth-1-label'>
                                        Selected output filetype:
                                    </div>
                                    <div className='Dropdown-legnth-1-text'>
                                        {outputFileTypeForDropdown[0].label}
                                    </div>
                                </div>
                        }
                    </div> 
                : null}

                <PopupFooter
                    onCancelClick = {handleCancelButtonClick}
                    onNextClick = {handleNextButtonClick}
                    cancelText = {getCancelButtonName()}
                    nextText = {getNextButtonName()}
                />

            </div>
        </BackdropModal>
    );
}

export default ActionPopup;
