import React, {useState, useEffect, useRef} from "react";
import BpmnViewer from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-font/dist/css/bpmn-embedded.css";
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from "bpmn-js-properties-panel";
// import { BpmnPropertiesProviderModule } from "bpmn-js-properties-panel";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import './BPMNComponent.scss';
import { getFileContent } from "../../../Utils/FileUnpackHelper";
import LoadingSpinner from "../../Widgets/LoadingSpinner/LoadingSpinner";

function BPMNComponent(props) {
    const {
        file,
        setComponentUpdaterFunction,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const viewerRef = useRef(null);
    const containerRef = useRef(null);
    const [didMount, setDidMount] = useState(false);

    useEffect(() => {
        setDidMount(true); // Setting mount will ensure the divs are created before the viewer accesses them
        containerRef.current = null; // Resetting the container ref will ensure the viewer is reloaded when the file changes
        setComponentUpdaterFunction("getBPMNXML", {call: getBPMNJSViewer});
    }, []);

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


    if(isLoading){
        return (
            <div className="BPMNComponent">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
            </div>
        )
    }

    return (
        <div className="BPMNComponent-parent">
            <div id="bpmn-component-canvas" ref={containerRef} />

            {/* <div id="propview" /> */}
        </div>
    );
}

export default BPMNComponent;