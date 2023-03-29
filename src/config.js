const imageType = [
    {
        ResourceType: "JPG",
        Title: "JPG image",
    },
    {
        ResourceType: "PNG",
        Title: "PNG image",
    },
    {
        ResourceType: "SVG",
        Title: "SVG image",
    },
]

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
            ...imageType,
        ]
    },
    PETRINET: {
        PNML: [
            {
                ResourceType: "DOT",
                Title: "Related resources",
            },
            ...imageType,
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
            ...imageType,
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