import './BPMNVisualizer.scss';
import {useState, useEffect} from 'react';
// import ReactBpmn from 'react-bpmn';

import React from "react";
// import ReactDOM from "react-dom";
import BPMNComponent from "./BPMNComponent";
// import ModelerCreator from "./diagramCreator/index";
// import "./styles.css";
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';

function BPMNVisualizer(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [modeler, setModeler] = useState(null);

    useEffect(() => {
        setModeler(<BPMNComponent file = {file} />)
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

    return (
        <div className="BPMNVisualizer">
            {/* <BPMNComponent
                file = {file}
            /> */}
            {modeler}
        </div>
    );
}

export default BPMNVisualizer;
