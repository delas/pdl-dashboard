// export default {
//     availableVisualizations: [
//         {
//             FileExtension: "XES", 
//             ResourceType: "EVENTLOG",
//             Title: "Histogram",
//         }, 
//         {
//             FileExtension: "PNML", 
//             ResourceType: "PETRINET",
//             Title: "Petri net",
//         },
//         {
//             FileExtension: "BPMN",
//             ResourceType: "PROCESSMODEL",
//             Title: "BPMN",
//         },
//         {
//             FileExtension: "DOT", 
//             ResourceType: "GRAPH",
//             Title: "Related resources",
//         },
//         {
//             FileExtension: "JPG", 
//             ResourceType: "IMAGE",
//             Title: "Jpg image",
//         },
//         {
//             FileExtension: "PNG", 
//             ResourceType: "IMAGE",
//             Title: "Png image",
//         },
//     ]
// }

export const availableVisualizations = ["EVENTLOG", "PETRINET", "PROCESSMODEL", "GRAPH", "IMAGE"]
export const availableFileExtensions = ["XES", "PNML", "BPMN", "DOT", "JPG", "PNG", "CSV"]

export const config = {
    XES: {
        ResourceType: "EVENTLOG",
        Visualizations: [
            {
                ResourceType: "HISTOGRAM",
                Title: "Histogram",
            },
            {
                ResourceType: "DOT",
                Title: "Related resources",
            },
            {
                ResourceType: "JPG",
                Title: "JPG image",
            },
            {
                ResourceType: "PNG",
                Title: "PNG image",
            },
        ]
    },
    PNML: {
        ResourceType: "PETRINET",
        Visualizations: [
            {
                ResourceType: "DOT",
                Title: "Related resources",
            },
            {
                ResourceType: "JPG",
                Title: "JPG image",
            },
            {
                ResourceType: "PNG",
                Title: "PNG image",
            },
        ]
    },
    BPMN: {
        ResourceType: "BPMN",
        Visualizations: [
            {
                ResourceType: "BPMN",
                Title: "BPMN",
            },
            {
                ResourceType: "DOT",
                Title: "Related resources",
            },
            {
                ResourceType: "JPG",
                Title: "JPG image",
            },
            {
                ResourceType: "PNG",
                Title: "PNG image",
            },
        ]
    },
    CSV: {
        ResourceType: "EVENTLOG",
        Visualizations: [
            
        ]
    },
};