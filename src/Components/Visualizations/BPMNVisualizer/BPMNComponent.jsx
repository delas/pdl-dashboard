import React, {useState, useEffect, useRef} from "react";
import BpmnViewer from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-font/dist/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
import './BPMNComponent.scss';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from "bpmn-js-properties-panel";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import { getFileContent } from "../../../Utils/FileUnpackHelper";
import LoadingSpinner from "../../Widgets/LoadingSpinner/LoadingSpinner";
import {BiHide, BiShow} from 'react-icons/bi';

function BPMNComponent(props) {
    const {
        file,
        setComponentUpdaterFunction,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const viewerRef = useRef(null);
    const containerRef = useRef(null);
    const [didMount, setDidMount] = useState(false);
    const panelRef = useRef(null);
    const [isOpen, setIsOpen] = useState("show");

    useEffect(() => {
        setDidMount(true); // Setting mount will ensure the divs are created before the viewer accesses them
        containerRef.current = null; // Resetting the container ref will ensure the viewer is reloaded when the file changes
        setComponentUpdaterFunction("getBPMNXML", {call: getBPMNJSViewer});
    }, [file]);

    const getBPMNJSViewer = () => {
        return viewerRef.current;
    }

    useEffect(() => {
        viewerRef.current = new BpmnViewer({
            container: containerRef.current,
            keyboard: {
                bindTo: window
            },
            // propertiesPanel: {
            //     parent: "#propview"
            // },
            additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule],
            moddleExtensions: {
                camunda: camundaModdleDescriptor
            }
        });
        var diagramXML = getFileContent(file);


        viewerRef.current.importXML(diagramXML)
            .then(() => {
                var canvas = viewerRef.current.get("canvas");
                canvas.zoom("fit-viewport");
                setIsLoading(false);
            })
            .catch(err => {
                console.error("could not import BPMN 2.0 diagram", err);
                setIsLoading(false);
            });
    }, [file, didMount]);

    const togglePanelOpen = () => {
        setIsOpen(!isOpen);
        if(panelRef.current !== null)
        panelRef.current.className = `djs-palette two-column ${!isOpen ? "open" : "closed"}`;
    }

    if(isLoading || containerRef === null){
        return (
            <div className="BPMNComponent">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
            </div>
        )
    }

    panelRef.current = document.getElementsByClassName("djs-palette")[0];

    return (
        <div className="BPMNComponent-parent">
            <div id="bpmn-component-canvas" ref={containerRef} />

            {/* <div id="propview" /> */}

            <div className={`BPMNComponent-panen--${isOpen ? "open" : "closed"}`} onClick = {() => {togglePanelOpen()}}>
                {isOpen ? <BiShow/> : <BiHide/>}
            </div>
        </div>
    );
}

export default BPMNComponent;