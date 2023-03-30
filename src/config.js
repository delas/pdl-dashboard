// export const displayTypes = {
//     HISTOGRAM: {
//         Title: "Histogram",
//         ResourceTypes: [
//             "HISTOGRAM",
//         ],
//     },
//     GRAPH: {
//         Title: "Related resources",
//         ResourceTypes: [
//             "DOT",
//         ],
//     },
//     PROCESSMODEL: {
//         Title: "Process model",
//         ResourceTypes: [
//             "BPMN",
//             "DOT",
//             "SVG",
//             "PNG",
//             "JPG",
//         ],
//     },
//     PETRINET: {
//         Title: "Petri net",
//         ResourceTypes: [
//             "SVG",
//             "PNG",
//             "JPG",
//         ],
//     },
// }

// export const resourceTypesCanGet = {
//     EVENTLOG: {
//         HISTOGRAM: displayTypes.HISTOGRAM,
//         RELATEDRESOURCES: displayTypes.GRAPH,
//     },
//     PROCESSMODEL: {
//         PROCESSMODEL: displayTypes.PROCESSMODEL,
//         RELATEDRESOURCES: displayTypes.GRAPH,
//     },
//     PETRINET: {
//         PETRINET: displayTypes.PETRINET,
//         RELATEDRESOURCES: displayTypes.GRAPH,
//     },
// }

// export const getAvailableVisualizations = (resourceType) => {
//     return resourceTypesCanGet[resourceType];
// }

// export const getAvailableResourceType = (resourceType) => {
//     return resourceTypesCanGet[resourceType];
// }

// export const getAvailableFileTypes = () => {
//     return Object.keys(displayTypes).map((key) => { // will extract the resourcetypes arrays
//         return displayTypes[key].ResourceTypes;
//     })
//     .reduce((acc, val) => acc.concat(val), []) // will combine the arrays
//     .filter((v, i, a) => a.indexOf(v) === i); // will remove duplicates
// }

// export const getAvailableResourceTypes = () => {
//     return Object.keys(resourceTypesCanGet);
// }

// console.log(getAvailableResourceTypes());

export const config = {
    EVENTLOG: {
        XES: [
            {
                Title: "Histogram",
                ResourceType: "HISTOGRAM",
            },
            {
                ResourceType: "DOT",
                Title: "Related resources",
            },
        ]
    },
    PETRINET: {
        PNML: [
            {
                ResourceType: "DOT",
                Title: "Related resources",
            },
        ],
        SVG: [
            {
                ResourceType: "IMAGE",
                Title: "Petri net",
            },
            {
                ResourceType: "DOT",
                Title: "Related resources",
            },
        ],
        JPG: [
            {
                ResourceType: "IMAGE",
                Title: "Petri net",
            },
            {
                ResourceType: "DOT",
                Title: "Related resources",
            },
        ],
        PNG: [
            {
                ResourceType: "IMAGE",
                Title: "Petri net",
            },
            {
                ResourceType: "DOT",
                Title: "Related resources",
            },
        ]
    },
    PROCESSMODEL: {
        BPMN: [
            {
                ResourceType: "BPMN",
                Title: "BPMN",
            },
            {
                ResourceType: "DOT",
                Title: "Related resources",
            },
        ],
        SVG: [
            {
                ResourceType: "IMAGE",
                Title: "BPMN",
            },
            {
                ResourceType: "DOT",
                Title: "Related resources",
            },
        ],
        JPG: [
            {
                ResourceType: "IMAGE",
                Title: "BPMN",
            },
            {
                ResourceType: "DOT",
                Title: "Related resources",
            },
        ],
        PNG: [
            {
                ResourceType: "IMAGE",
                Title: "BPMN",
            },
            {
                ResourceType: "DOT",
                Title: "Related resources",
            },
        ]
    },
}

export const getAvailableResourceTypes = () => {
    return Object.keys(config);
}

export const getAllAvailableFileExtensions = () => {
    return getAvailableResourceTypes().reduce((acc, resourceType) => {
        return [...acc, ...getAvailableFileExtensions(resourceType) ];
    }, []);
}

export const getVisalizations = (resourceType, fileExtension) => {
    if(resourceType) return config[resourceType][fileExtension];
}

export const getAvailableFileExtensions = (resourceType) => {
    return Object.keys(config[resourceType]);
}

export const isResourceTypeAndFileExtension = (resourceType, fileExtension) => {
    return getAvailableResourceTypes().includes(resourceType) 
    && getAvailableFileExtensions(resourceType).includes(fileExtension);
}
