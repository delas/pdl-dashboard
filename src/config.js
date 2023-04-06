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
    HISTOGRAM: {
        JSON: [
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
    if(resourceType) {
        if(config[resourceType]) {
            return config[resourceType][fileExtension];
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

export const getAvailableFileExtensions = (resourceType) => {
    return Object.keys(config[resourceType]);
}

export const isResourceTypeAndFileExtension = (resourceType, fileExtension) => {
    return getAvailableResourceTypes().includes(resourceType) 
    && getAvailableFileExtensions(resourceType).includes(fileExtension);
}
