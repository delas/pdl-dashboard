import './BPMNVisualizer.scss';
import {useState, useEffect} from 'react';
import React from "react";
import BPMNComponent from "./BPMNComponent";
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';
import DefaultButton from '../../Widgets/Buttons/DefaultButton/DefaultButton';
import { getFileDynamic } from '../../../Utils/FileUnpackHelper';

function BPMNVisualizer(props) {
    const {
        file,
        uploadEditedFile,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [getUpdatedBPMN, setGetUpdatedBPMN] = useState({});
    const fileDynamic = getFileDynamic(file);
    const [modeler, setModeler] = useState(null);

    /* 
        This function is used to update a state value with a function defined in the child component.
        The purpose of this is to access the BPMN viewer from the child component and send data contained in
        the child to a popup. The setting of the child function happens on load, while the saving happens on the button click.
    */
    const setComponentUpdaterFunction = (componentName, func) => {
        let tempUpdatedBPMN = getUpdatedBPMN;
        tempUpdatedBPMN[componentName] = func;
        setGetUpdatedBPMN(tempUpdatedBPMN);
    }

    useEffect(() => {
        setIsLoading(false);
        setModeler(<BPMNComponent file = {file} setComponentUpdaterFunction={setComponentUpdaterFunction}/>)
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

    async function saveChanges() {
        if(getUpdatedBPMN?.getBPMNXML){
            const viewer = getUpdatedBPMN.getBPMNXML.call(); // getting the viewer from the child component
            viewer.saveXML({ format: true }, function (err, xml) { // getting the xml from the viewer
                if (err) {console.log(err); return};
                uploadEditedFile(xml, file); // Sending xml and file to popup
            });
        }
    }

    return (
        <div className="BPMNVisualizer">
            
            {!fileDynamic && // Hides button if the resource is dynamic
                <div className='BPMNVisualizer-button-container'>
                    <DefaultButton
                        text = 'Save'
                        click = {saveChanges}
                        disabled = {false}
                        primary = {true}/>
                </div>
            }
            {modeler}
        </div>
    );
}

export default BPMNVisualizer;
