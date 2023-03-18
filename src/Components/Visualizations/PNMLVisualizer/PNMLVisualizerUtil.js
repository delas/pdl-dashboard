const {XMLParser} = require('fast-xml-parser');

function PNMLParser() {

    const xmlOptions = { 
        attrPrefix : '', 
        attributeNamePrefix: '',
        ignoreAttributes: false,
        ignoreNonTextNodeAttr : false, 
        ignoreTextNodeAttr : false, 
        parseAttributeValue: true 
    }

    const parser = new XMLParser(xmlOptions);

    this.parsePnml = (xml) => {
        let data = parser.parse(xml).pnml;

        let ref = {};
        let figures = {
            places: getPlaces(data.net.page.place, ref),
            transitions: getTransitions(data.net.page.transition, ref),
            arcs: getArcs(data.net.page.arc, ref)
        }

        return {
            id: data?.net?.id,
            type: data?.net?.type,
            name: data?.net?.name?.text,
            size: figures?.length,
            figures: figures
        };
    };

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }

    function parseColor(color) {
        if(typeof(color?.color) === "string"){
            if(color.color.match(/rgb\((\d+)[,](\d+)[,](\d+)\)/) === null){
                color.color = hexToRgb(`${color.color}`);
            }else {
                color.color = color.color.match(/rgb\((\d+)[,](\d+)[,](\d+)\)/);
            }
            return { r: parseInt(color.color.r), g: parseInt(color.color.g), b: parseInt(color.color.b), alpha: 255 }
        }
        return false;
    }

    function getPlaces(places){
        return places;
    }

    function getTransitions(transitions){
        return transitions;
    }

    function getArcs(arcs){
        return arcs;
    }
}
module.exports = new PNMLParser();