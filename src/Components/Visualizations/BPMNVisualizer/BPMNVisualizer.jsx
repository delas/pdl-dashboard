import './BPMNVisualizer.scss';
import {useState, useEffect} from 'react';
// import ReactBpmn from 'react-bpmn';

import React from "react";
// import ReactDOM from "react-dom";
import BPMNComponent from "./BPMNComponent";
// import ModelerCreator from "./diagramCreator/index";
// import "./styles.css";
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';
import DefaultButton from '../../Widgets/Buttons/DefaultButton/DefaultButton';

function BPMNVisualizer(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [modeler, setModeler] = useState(null);
    const [getUpdatedBPMN, setGetUpdatedBPMN] = useState({});

    const setComponentUpdaterFunction = (componentName, func) => {
        let tempUpdatedBPMN = getUpdatedBPMN;
        tempUpdatedBPMN[componentName] = func;
        setGetUpdatedBPMN(tempUpdatedBPMN);
    }

    useEffect(() => {
        setModeler(<BPMNComponent file = {file} setComponentUpdaterFunction={setComponentUpdaterFunction}/>)
        setIsLoading(false);
    }, [file]);

    if(isLoading){
        return (
            <div className="BPMNVisualizer">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
            </div>
        )
    }
    function onShown() {
        console.log('diagram shown');
    }

    function onLoading() {
        console.log('diagram loading');
    }

    function onError(err) {
        console.log('failed to show diagram');
    }

    function saveChanges() {
        console.log(getUpdatedBPMN?.getBPMNXML)
        if(getUpdatedBPMN?.getBPMNXML){
            const xml = getUpdatedBPMN.getBPMNXML.call();
            // TODO: Send xml to backend
        }
    }

    return (
        <div className="BPMNVisualizer">
            <div className='BPMNVisualizer-button-container'>
                <DefaultButton
                    text = 'Save'
                    click = {saveChanges}
                    disabled = {false}
                    primary = {true}/>
            </div>
            {/* <BPMNComponent
                file = {file}
            /> */}
            {modeler}
        </div>
    );
}

export default BPMNVisualizer;
