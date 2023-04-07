export function getFileHost(file){
    return file.ResourceInfo.Host;
}

export function getFileResourceId(file){
    return file.ResourceId;
}

export function getFileExtension(file){
    return file.ResourceInfo.FileExtension;
}

export function getFileContent(file){
    return file.fileContent;
}

export function getFileResourceLabel(file){
    return file.ResourceInfo.ResourceLabel;
}

export function getFileResourceType(file){
    return file.ResourceInfo.ResourceType;
}

export function getFileDynamic(file){
    return file.ResourceInfo.Dynamic;
}

export function getFileDescription(file){
    return file.ResourceInfo.Description;
}

export function getFileCreationDate(file){
    return file.CreationDate;
}

export function getFileStreamTopic(file){
    return file.ResourceInfo.StreamTopic;
}

export function getFileProcessId(file){
    return file.processId;
}

export function fileBuilder(file, properties = {}){
    return {
        ResourceId: properties.ResourceId || getFileResourceId(file),
        ResourceInfo: {
            Host: properties.Host || getFileHost(file),
            FileExtension: properties.FileExtension || getFileExtension(file),
            ResourceLabel: properties.ResourceLabel || getFileResourceLabel(file),
            ResourceType: properties.ResourceType || getFileResourceType(file),
            Dynamic: properties.Dynamic || getFileDynamic(file),
            Description: properties.Description || getFileDescription(file),
            StreamTopic: properties.StreamTopic || getFileStreamTopic(file)
        },
        CreationDate: properties.CreationDate || getFileCreationDate(file),
        fileContent: properties.fileContent || getFileContent(file)
    }
}