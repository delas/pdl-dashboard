export const pingDynamicResourceInterval = 1000; // 1 seconds
export const pingHostInterval = 10000; // 10 seconds
export const pingMinerProcessInterval = 1000; // 1 seconds

export const visualizationConfig = {
    EVENTLOG: {
        XES: [
            {
                Title: "Histogram",
                ResourceType: "HISTOGRAM",
            },
        ]
    },
    HISTOGRAM: {
        JSON: [
            {
                Title: "Histogram",
                ResourceType: "HISTOGRAM",
            },
        ]
    },
    PETRINET: {
        PNML: [
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
