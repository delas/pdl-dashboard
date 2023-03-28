import React from "react";
import BpmnViewer from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-font/dist/css/bpmn-embedded.css";
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from "bpmn-js-properties-panel";
// import { BpmnPropertiesProviderModule } from "bpmn-js-properties-panel";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import './BPMNComponent.scss';
import { getFileContent } from "../../../Utils/FileUnpackHelper";

class BPMNComponent extends React.Component {
    constructor(props) {
        super();
    }
    render() {
        return (
        <div className="BPMNComponent-parent">
            <div id="bpmn-component-canvas" ref={this.containerRef} />
            {/* <div id="propview" /> */}
        </div>
        );
    }
    componentDidMount() {
        this.viewer = new BpmnViewer({
            container: document.getElementById("bpmn-component-canvas"),
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

    // import function
    function importXML(xml, Viewer) {
      // import diagram
        Viewer.importXML(xml)
            .then(() => {
                var canvas = Viewer.get("canvas");
                canvas.zoom("fit-viewport");
            })
            .catch(err => {
                console.error("could not import BPMN 2.0 diagram", err);
            });
    }
    var diagramXML = getFileContent(this.props.file);

    // import xml
    if(diagramXML) importXML(diagramXML, this.viewer);
  }
}

export default BPMNComponent;
