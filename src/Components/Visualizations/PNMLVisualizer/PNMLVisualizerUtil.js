// const fs = require('fs');
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

        console.log(data);

        let ref = {};
        let figures = {
            places: getPlaces(data.net.page.place, ref),
            transitions: getTransitions(data.net.page.transition, ref),
            arcs: getArcs(data.net.page.arc, ref)
        }
            // .concat(getPlaces(data.net.page.place, ref))
            // .concat(getTransitions(data.net.page.transition, ref))
            // // .concat(getToolSpecific(data.net.page.toolspecific, ref))
            // .concat(getArcs(data.net.page.arc, ref));

        return {
            id: data.net.id,
            type: data.net.type,
            name: data.net.name.text,
            size: figures.length,
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

//     function getTip(type) {
//         switch (type) {
//             case 'multi-both': return { type: 'DoubleArrowTip', count: 2 };
//             case 'multi-ordinary': return { type: 'DoubleArrowTip', count: 1 };
//             case 'both': return { type: 'ArrowTip', count: 2 };
//             case 'ordinary': return { type: 'ArrowTip', count: 1 };
//             case 'test': return { type: 'ArrowTip', count: 0 };
//         }
//     }

//     function getPlaces(place, ref = {}) {
//         return getFigures(place, 'Place', ref)
//     }

//     function getTransitions(transition, ref = {}) {
//         return getFigures(transition, 'Transition', ref);
//     }

//     function getToolSpecific(toolspecific, ref = {}) {
//         if (toolspecific !== undefined && toolspecific.VirtualPlace !== undefined) {
//             return getFigures(toolspecific.VirtualPlace, 'VirtualPlace', ref);
//         }
//         return [];
//     }

//     function getArcs(arc, ref = {}) {
        
//         return getFigures(arc, 'Arc', ref);
//     }

//     function getFigures(figure, type, ref = {}) {
//         let figures = [];
//         if (figure !== undefined) {
//             (figure instanceof Array ? figure : [figure]).forEach(raw => {
//                 figure = {
//                     id: raw.id,
//                     type: type,
//                     line: parseColor(raw?.graphics?.fill)
//                 };
//                 console.log(figure);
//                 console.log(raw);

//                 if (type === 'Arc') {
//                     // console.log(figure);
//                     figure.source = raw.source;
//                     figure.target = raw.target;
//                     figure.LineStyle = raw?.graphics?.line?.style;
//                     figure.tip = getTip(raw?.type?.text);
//                     figure.positions = [ ref[figure.source]?.position ];
//                     if (raw.graphics?.position !== undefined) {
//                         (raw.graphics?.position instanceof Array ? raw.graphics?.position : [raw.graphics?.position])
//                             .forEach(position => {
//                                 figure?.positions?.push({ x: parseInt(position?.x), y: parseInt(position?.y)})
//                             });
//                     }
//                     figure.positions.push(ref[figure.target]?.position);
//                 } else {
//                     figure.width = parseInt(raw.graphics?.dimension?.x);
//                     figure.height = parseInt(raw.graphics?.dimension?.y);
//                     figure.position = {
//                         x: parseInt(raw.graphics?.position?.x) - figure?.width/2,
//                         y: parseInt(raw.graphics?.position?.y) - figure?.height/2
//                     };
//                     figure.fill = parseColor(raw?.graphics?.fill);
//                 }

//                 figures.push(figure);
//                 ref[figure.id] = figure;
//                 raw.textId = 0;

//                 if (raw.initialMarking !== undefined || raw.inscription !== undefined || raw.create !== undefined) {
//                     if (raw.create !== undefined) raw.inscription = raw.create;
//                     if (raw.initialMarking !== undefined) raw.inscription = raw.initialMarking;
//                     let text = getText(raw, 'inscription');
//                     figures.push(text);
//                     ref[text.id] = text;
//                 }
//                 if (raw.name !== undefined) {
//                     let text = getText(raw, 'name');
//                     figures.push(text);
//                     ref[text.id] = text;
//                 }
//             });
//         }
//         return figures;
//     }

//     function getText(raw, textType) {
//         return {
//             id: 't' + raw.id + raw.textId++,
//             type: 'Text',
//             textType: textType,
//             text: raw[textType].text,
//             align: 'center',
//             position: { x: parseInt(raw?.graphics?.position?.x), y: parseInt(raw?.graphics?.position?.y) },
//             offset: { x: parseInt(raw[textType]?.graphics?.offset?.x), y: parseInt(raw[textType]?.graphics?.offset?.y) },
//             font: { family: 'SansSerif', style: (textType === 'name' ? 1 : 0), size: 12 },
//             ref: parseInt(raw.id)
//         };
//     }
// }
}
module.exports = new PNMLParser();