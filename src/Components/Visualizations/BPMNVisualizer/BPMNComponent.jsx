import React from "react";
import BpmnViewer from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-font/dist/css/bpmn-embedded.css";
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from "bpmn-js-properties-panel";
// import { BpmnPropertiesProviderModule } from "bpmn-js-properties-panel";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import './BPMNComponent.scss';

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
        Viewer.importXML(xml, function(err) {
            if (err) {
                return console.error("could not import BPMN 2.0 diagram", err);
            }

            var canvas = Viewer.get("canvas"),
            overlays = Viewer.get("overlays");

            // zoom to fit full viewport
            canvas.zoom("fit-viewport");

            // attach an overlay to a node
            overlays.add("SCAN_OK", "note", {
                position: {
                    bottom: 0,
                    right: 0
                },
                html: '<div class="diagram-note">Mixed up the labels?</div>'
            });

            // add marker
            canvas.addMarker("SCAN_OK", "needs-discussion");
        });
    }

    // a diagram to display
    //
    // see index-async.js on how to load the diagram asynchronously from a url.
    // (requires a running webserver)
    var diagramXML = this.props.file.fileContent;

    // import xml
    importXML(diagramXML, this.viewer);
  }
}

export default BPMNComponent;
