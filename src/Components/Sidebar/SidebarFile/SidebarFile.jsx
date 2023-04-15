import './SidebarFile.scss';
import {useState, useEffect} from 'react';
import { FaTrash } from 'react-icons/fa';
import { CiStreamOn } from 'react-icons/ci';
import { getFileLocal, setProcessKeyLocalAsync } from '../../../Store/LocalDataStore';
import { getFileExtension, getFileResourceLabel, getFileContent, getFileDynamic, getFileProcessId, getFileCreationDate } from '../../../Utils/FileUnpackHelper';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';

function SidebarFile(props) {

    const {
        fileId,
        deleteFile,
        selectFileForVisualization,
        shouldSetFileContent,
        isSelected,
    } = props;

    const [fileContentLoading, setFileContentLoading] = useState(true);
    const [file, setFile] = useState(null);

    useEffect(() => {
        getFileAndCheckContents();
    }, [fileId]);

    const getFileAndCheckContents = () => {
        const tempFile = getFileLocal(fileId);
        if(tempFile){
            setFile(tempFile);
        }
        if(tempFile && shouldSetFileContent(tempFile)){
            if(!getFileContent(tempFile)){
                setFileContentLoading(true);
                setTimeout(() => {getFileAndCheckContents()}, 1000);
            } else {
                setFileContentLoading(false);
            }
        } else {
            setFileContentLoading(false);
        }
    }

    const getCreationDateString = (file) => {
        const timeInMs = parseInt(getFileCreationDate(file));
        const date = new Date(timeInMs);

        //data.getMonth() + 1 because months are 0-11
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
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
                        {getFileExtension(file)}
                    </div>
                    <div className='SidebarFile-text-center'>
                        <div className='SidebarFile-filename' onClick = {() => {selectFileForVisualization(fileId)}} >
                            {getFileResourceLabel(file)}
                        </div>
                        <div className='SidebarFile-creationDate'>
                            {getCreationDateString(file)}
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
