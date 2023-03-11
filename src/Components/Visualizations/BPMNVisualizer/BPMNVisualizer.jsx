import './BPMNVisualizer.scss';
import {useState, useEffect} from 'react';
// import ReactBpmn from 'react-bpmn';

import React from "react";
// import ReactDOM from "react-dom";
import BPMNComponent from "./BPMNComponent";
// import ModelerCreator from "./diagramCreator/index";
// import "./styles.css";

function BPMNVisualizer(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    });

    if(isLoading){
        return (
            <div className="BPMNVisualizer">
                <div>Loading ...</div>
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
    
    console.log(file);

    return (
        <div className="BPMNVisualizer">
            {/* <ReactBpmn
                // url="/public/diagram.bpmn"
                url = {file.fileContent}
                onShown={ onShown }
                onLoading={ onLoading }
                onError={ onError }
            /> */}
            <BPMNComponent
                file = {file}
            />
        </div>
    );
}

export default BPMNVisualizer;
