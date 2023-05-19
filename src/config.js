export const pingDynamicResourceInterval = 1000; // 1 seconds
export const pingHostInterval = 10000; // 10 seconds
export const pingMinerProcessInterval = 1000; // 1 seconds
export const pingShadowProcessInterval = 10000; // 10 seconds

export const visualizationConfig = {
    EVENTLOG: {
        XES: [
            {
                ResourceType: "HISTOGRAM",
                Title: "Histogram",
            },
        ]
    },
    HISTOGRAM: {
        JSON: [
            {
                ResourceType: "HISTOGRAM",
                Title: "Histogram",
            },
        ]
    },
    PETRINET: {
        PNML: [ // There is no stable visualization for PNML files
            // {
            //     ResourceType: "PNML",
            //     Title: "PNML",
            // },
        ],
        SVG: [
            {
                ResourceType: "IMAGE",
                Title: "Petri net",
            },
        ],
        JPG: [
            {
                ResourceType: "IMAGE",
                Title: "Petri net",
            },
        ],
        PNG: [
            {
                ResourceType: "IMAGE",
                Title: "Petri net",
            },
        ]
    },
    PROCESSMODEL: {
        BPMN: [
            {
                ResourceType: "BPMN",
                Title: "BPMN",
            },
        ],
        SVG: [
            {
                ResourceType: "IMAGE",
                Title: "BPMN",
            },
        ],
        JPG: [
            {
                ResourceType: "IMAGE",
                Title: "BPMN",
            },
        ],
        PNG: [
            {
                ResourceType: "IMAGE",
                Title: "BPMN",
            },
        ]
    },
    ALIGNMENT: {
        JSON: [
            {
                ResourceType: "ALIGNMENT",
                Title: "Alignment",
            }
        ],
    },
    OTHER: {
        PNG: [
            {
                ResourceType: "IMAGE",
                Title: "Image viewer",
            }
        ],
        JPG: [
            {
                ResourceType: "IMAGE",
                Title: "Image viewer",
            }
        ],
        SVG: [
            {
                ResourceType: "IMAGE",
                Title: "Image viewer",
            }
        ],
        DOT: [
            {
                ResourceType: "DOT",
                Title: "Graph viewer",
            }
        ]

    }
}

export const getAvailableResourceTypes = () => {
    return Object.keys(visualizationConfig);
}

export const getAllAvailableFileExtensions = () => {
    return getAvailableResourceTypes().reduce((acc, resourceType) => {
        return [...acc, ...getAvailableFileExtensions(resourceType) ];
    }, []);
}

export const getVisalizations = (resourceType, fileExtension) => {
    if(resourceType) {
        if(visualizationConfig[resourceType]) {
            return visualizationConfig[resourceType][fileExtension];
        } else {
            return [];
        }
    } else {
        return [];
    }
}

export const getAvailableFileExtensions = (resourceType) => {
    return Object.keys(visualizationConfig[resourceType]);
}

export const isResourceTypeAndFileExtension = (resourceType, fileExtension) => {
    return getAvailableResourceTypes().includes(resourceType) 
    && getAvailableFileExtensions(resourceType).includes(fileExtension);
}
