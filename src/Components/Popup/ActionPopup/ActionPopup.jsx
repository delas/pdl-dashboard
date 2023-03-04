import './ActionPopup.scss';
import {useState, useEffect} from 'react';
import { FaRegWindowClose, FaCloudUploadAlt } from 'react-icons/fa';
import Dropdown from '../../Dropdown/Dropdown';

function ActionPopup(props) {

    const {
        toggleActionPopupOpen
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState(1);
    const [dropdownValue, setDropdownValue] = useState(null);

    useEffect(() => {
        setIsLoading(false);
    });

    const Miners = [
        {label: 'miner1', value: 'sv'},
        {label: 'miner2', value: 'en'},
        {label: 'miner3', value: 'au'},
        {label: 'miner4', value: 'dk'},
        {label: 'miner5', value: 'nw'},
        {label: 'miner6', value: 'ge'},
        {label: 'miner7', value: 'fr'},
        {label: 'miner8', value: 'us'},
    ];

    const Repository = [
        {label: 'repository1', value: 'sv'},
        {label: 'repository2', value: 'en'},
        {label: 'repository3', value: 'au'},
        {label: 'repository4', value: 'dk'},
        {label: 'repository5', value: 'nw'},
        {label: 'repository6', value: 'ge'},
        {label: 'repository7', value: 'fr'},
        {label: 'repository8', value: 'us'},
    ];

    const Files = [
        {label: 'file1', value: 'sv'},
        {label: 'file2', value: 'en'},
        {label: 'file3', value: 'au'},
        {label: 'file4', value: 'dk'},
        {label: 'file5', value: 'nw'},
        {label: 'file6', value: 'ge'},
        {label: 'file7', value: 'fr'},
        {label: 'file8', value: 'us'},
    ];

    const Params = [
        {name: 'param1', type: 'string'},
        {name: 'param2', type: 'double'},
        {name: 'param3', type: 'int'},
        {name: 'param4', type: 'string'},
        {name: 'param5', type: 'bool'},
        {name: 'param6', type: 'float'},
    ]

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

    const onValueChange = (value) => {
        setDropdownValue(value);
    }

    const getNextButtonName = () => {
        return selected === 4 ? 'confirm' : 'next' 
    }

    const getCancelButtonName = () => {
        return selected === 1 ? 'Cancel' : 'Back' 
    }

    const handleNextButtonClick = () => {
        selected !== 4 ? setSelected(selected + 1) : setSelected(selected);
    }

    const handleCancelButtonClick = () => {
        selected !== 1 ? setSelected(selected - 1) : setSelected(selected);
    }

    if(isLoading){
        return (
            <div className="ActionPopup">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        // <div className='ActionPopup'>
        <div className='Backdrop-modal' 
            onClick = {() => {toggleActionPopupOpen()}}
        >

            <div className='ActionPopup' 
                onClick = {(e) => {e.stopPropagation()}}
            >
                
                <header className='ActionPopup-header'>
                    <h4>New action</h4>
                    <div className='ClosePopup'>
                        <FaRegWindowClose
                            onClick = {() => {toggleActionPopupOpen()}}
                        />
                    </div>
                </header>

                <table className='ActionPopup-wizard-steps'>
                        <td className={`ActionPopup-wizard-step ActionPopup-wizard-step-${selected === 1 ? "selected": ""}`}>
                            <span className='ActionPopup-wizard-step-text'>1. Miner</span>
                        </td>
                        <td className={`ActionPopup-wizard-step ActionPopup-wizard-step-${selected === 2 ? "selected": ""}`}>
                            <span className='ActionPopup-wizard-step-text'>2. Inputs</span>
                        </td>
                        <td className={`ActionPopup-wizard-step ActionPopup-wizard-step-${selected === 3 ? "selected": ""}`}>
                            <span className='ActionPopup-wizard-step-text'>3. Parameters</span>
                        </td>
                        <td className={`ActionPopup-wizard-step ActionPopup-wizard-step-${selected === 4 ? "selected": ""}`}>
                            <span className='ActionPopup-wizard-step-text'>4. Repository</span>
                        </td>
                </table>

                {/* ------------------ STEP 1 ------------------ */}

                {selected === 1 ? 
                    <div className='ActionPopup-wizard-step1'>
                        <div className='ActionPopup-wizard-dropdown'>
                            <span className='ActionPopup-wizard-dropdown-label'>Select miner</span>
                            <Dropdown
                                options = {Miners}
                                onValueChange = {onValueChange}
                            />
                        </div>
                    </div>
                : null}

                {/* ------------------ STEP 2 ------------------ */}

                {selected === 2 ? 
                    <div className='ActionPopup-wizard-step2'>
                        <form id="file-upload-form" class="ActionPopup-body">
                            <input id="file-upload" type="file" name="fileUpload" accept="image/*" className='ActionPopup-fileinput'/>

                            <label for="file-upload" id="file-drag" className='ActionPopup-fileinput-label'>
                                <FaCloudUploadAlt id="file-image" src="#" alt="Preview" className='ActionPopup-fileinput-icon'/>

                                <div className='ActionPopup-fileinput-selectFile'>
                                    <div>Select a file or drag here</div>
                                    <span id="file-upload-btn" class="ActionPopup-fileinput-button">Select a file</span>
                                </div>

                            </label>
                        </form>

                        <div className='ActionPopup-wizard-dropdown'>
                            <span className='ActionPopup-wizard-dropdown-label'>Select file</span>
                            <Dropdown
                                options = {Files}
                                onValueChange = {onValueChange}
                            />
                        </div>
                    </div> 
                : null}

                {/* ------------------ STEP 3 ------------------ */}

                {selected === 3 ? 
                    <div className='ActionPopup-wizard-step3'>
                        <div className='ActionPopup-wizard-parameter-inputs'>
                            {
                                Params.map((param, index) => {
                                    const type = getInputType(param);
                                    return (
                                        <div className='ActionPopup-Wizard-parameter-input-parent'>
                                            <label className='ActionPopup-Wizard-paramter-input-label'>
                                                {param.name}
                                            </label>
                                            <input 
                                                className={`ActionPopup-Wizard-parameter-input ActionPopup-Wizard-parameter-input-${type}`}
                                                type={type} key={index} 
                                                placeholder = {type}
                                            />
                                            
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div> 
                : null}

                {/* ------------------ STEP 4 ------------------ */}

                {selected === 4 ? 
                    <div className='ActionPopup-wizard-step4'>
                        <div className='ActionPopup-wizard-dropdown'>
                            <span className='ActionPopup-wizard-dropdown-label'>Select the destination repository</span>
                            <Dropdown
                                options = {Repository}
                                onValueChange = {onValueChange}
                            />
                        </div>
                    </div> 
                : null}

                

                <footer className='ActionPopup-footer'>
                    <div className='ActionPopup-buttonContainer'>
                        <button className='ActionPopup-button ActionPopup-button-cancel'
                            onClick = {() => {handleCancelButtonClick()}}
                        >{getCancelButtonName()}</button>
                        <button className='ActionPopup-button ActionPopup-button-confirm' onClick={() => {handleNextButtonClick()}}>{getNextButtonName()}</button>
                    </div>
                </footer>

            </div>

        </div>
        // </div>
    );
}

export default ActionPopup;
