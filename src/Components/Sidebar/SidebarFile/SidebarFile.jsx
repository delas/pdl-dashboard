import './SidebarFile.scss';
import {useState, useEffect} from 'react';
import { FaTrash } from 'react-icons/fa';
import { CiStreamOn } from 'react-icons/ci';
import { setProcessKeyLocalAsync } from '../../../Store/LocalDataStore';
import { 
    getFileExtension, 
    getFileResourceLabel, 
    getFileContent, 
    getFileDynamic, 
    getFileProcessId, 
    getFileCreationDate, 
    getFileResourceId, 
    getFileResourceType 
} from '../../../Utils/FileUnpackHelper';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';
import {getDateInMsAsString} from '../../../Utils/Utils';

function SidebarFile(props) {

    const {
        deleteFile,
        selectFileForVisualization,
        shouldSetFileContent,
        isSelected,
        file,
    } = props;

    const [fileContentLoading, setFileContentLoading] = useState(true);

    const fileId = getFileResourceId(file);

    const generateNewFileTag = () => {
        switch(getFileResourceType(file)){
            case "EventStream": return "ES";
            case "PetriNet": return "PetN";
            case "ProcessTree": return "PT";
            case "ProcessModel": return "ProM";
            case "EventLog": return "EL";
            case "Histogram" : return "Hist";
            case "Alignment" : return "Alig";
            default: return "File";
        }
    }

    const fileTag = getFileExtension(file) ? getFileExtension(file) : generateNewFileTag();//getFileResourceType(file);

    useEffect(() => {
        getFileOrSetLoading();
    }, [file]);

    const getFileOrSetLoading = () => {
        if(shouldSetFileContent(file)) {
            if(!getFileContent(file) && !fileContentLoading){
                setFileContentLoading(true);
            } 
            else if(getFileContent(file) && fileContentLoading){
                setFileContentLoading(false);
            }
        }
        else {
            setFileContentLoading(false);
        }
        if(fileContentLoading){ // retry if file content is not loaded
            setTimeout(() => {
                getFileOrSetLoading();
            }, 1000);
        }
    }

    const deleteFileHandler = () => {
        // Stop retrieving file content - it still updates process status
        const processId = getFileProcessId(file); 
        if(processId) setProcessKeyLocalAsync(processId, "saveOrUpdateFile", false);
        
        // Remove file from local memory - not repository
        deleteFile(fileId);
        if(isSelected){
            selectFileForVisualization(null);
        }
    }

    const handleFileClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        selectFileForVisualization(fileId)
    }

    if(!file){
        return (
            <div className="SidebarFile">
                <div className='Spinner-container-s'>
                    <LoadingSpinner loading={true}/>
                </div>
            </div>
        )
    }

    return (
        <div className={`SidebarFile SidebarFile-selected-${isSelected}`}>
            <div className='SidebarFile-flexContainer'>
                <div className={`SidebarFile-flexContainer-left SidebarFile-flexContainer-left-stream-${getFileDynamic(file)}`}>
                    <div className='SidebarFile-filetype'>
                        {fileTag}
                    </div>
                    <div className='SidebarFile-text-center'  onClick={handleFileClick}>
                        <div className='SidebarFile-filename' >
                            {getFileResourceLabel(file)}
                        </div>
                        <div className='SidebarFile-creationDate'>
                            {getDateInMsAsString(getFileCreationDate(file))}
                        </div>
                    </div>
                </div>

                {getFileDynamic(file) && <div className='SidebarFile-stream'>
                    <CiStreamOn/>
                </div>}

                <div className='SidebarFile-delete' onClick = {() => {deleteFileHandler(fileId)}}>
                    <FaTrash/>
                </div>
            </div>

            {fileContentLoading && // Show spinner if file content is loading
            <div className={`SpinnerModal SpinnerModal-stream-${getFileDynamic(file)}`}>
                <div className='LoadingSpinner-container'>
                    <LoadingSpinner loading={fileContentLoading}/>
                </div>
            </div>}
            
        </div>
    );
}

export default SidebarFile;
