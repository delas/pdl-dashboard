import './ActionPopup.scss';
import {useState, useEffect} from 'react';
import { FaRegWindowClose, FaCloudUploadAlt } from 'react-icons/fa';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import FileInput  from '../../Widgets/FileInput/FileInput';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import PopupFooter from '../../Widgets/PopupFooter/PopupFooter';
import InputField from '../../Widgets/InputField/InputField';
import HorizontalLine from '../../Widgets/HorizontalLine/HorizontalLine';
import { getMiners, getRepositories, getMiner, getAllFiles, getFile } from '../../../Store/LocalDataStore';
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
    const [dropdownValue, setDropdownValue] = useState(null);
    const [minerDestination, setMinerDestination] = useState(null);
    
    const [repositoryFileOwner, setRepositoryFileOwner] = useState(null);
    const [repositoryDestination, setRepositoryDestination] = useState(null);
    const [selectedVisualizationFile, setSelectedVisualizationFile] = useState(null);
    const [selectedLogFile, setSelectedLogFile] = useState(null);
    const [minerParams, setMinerParams] = useState([]);
    const [availableFilesForDropdown, setAvailableFilesForDropdown] = useState([]);

    const [visFilesForDropdown, setVisFilesForDropdown] = useState([]);
    const [logFilesForDropdown, setLogFilesForDropdown] = useState([]);
    const [visDropdownLoading, setVisDropdownLoading] = useState(true);
    const [logDropdownLoading, setLogDropdownLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
        onMinerChange(miner);
        setAvailableFilesForDropdown(convertFilesToDropdown(getAllFiles()));
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
        const params = miner?.config?.Parameters;
        setMinerParams(params);
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
        var data = {
            repositoryInputPath: `${repositoryFileOwner.label}/resources/`,
            fileId: file.FileId,
            fileExtension: file.FileExtension,
            repositoryOutputPath: `${repositoryDestination.label}/resources/`,
            params : [

            ]
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

                        {repositoryFileOwner &&
                            logDropdownLoading ? <div>Loading...</div> :
                            <Dropdown
                                options = {logFilesForDropdown}
                                onValueChange = {onLogFileDropdownChange}
                                label = {`Log file:`}
                                value = {selectedLogFile}
                            />
                        }
                        {repositoryFileOwner &&
                            visDropdownLoading ? <div>Loading...</div> :
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
                            {
                                minerParams === null || minerParams === undefined || minerParams?.length === 0 ? 
                                <span>Miner requires no parameters</span> :
                                minerParams.map((param, index) => {
                                    const type = getInputType(param);
                                    return (
                                        <>
                                        <InputField
                                            key = {index}
                                            label = {param.name}
                                            fieldType = {type}
                                            placeholder = {type}
                                        />
                                        {index < minerParams?.length - 1 ? <HorizontalLine/> : null}
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
