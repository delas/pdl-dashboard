import './SidebarFile.scss';
import {useState, useEffect} from 'react';
import { FaTrash } from 'react-icons/fa';
import { getFile } from '../../../Store/LocalDataStore';
import { getFileExtension, getFileResourceLabel, getFileContent } from '../../../Utils/FileUnpackHelper';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';

function SidebarFile(props) {

    const {
        fileId,
        deleteFile,
        selectFileForVisualization,
        shouldSetFileContent,
    } = props;

    const [fileContentLoading, setFileContentLoading] = useState(true);
    const [file, setFile] = useState(null);

    useEffect(() => {
        getFileAndCheckContents();
    }, []);

    const getFileAndCheckContents = () => {
        const tempFile = getFile(fileId);
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
        <div className="SidebarFile">
            <div className='SidebarFile-flexContainer'>
                <div className='SidebarFile-flexContainer-left'>
                    <div className='SidebarFile-filetype'>
                        {getFileExtension(file)}
                    </div>
                    <div className='SidebarFile-filename' onClick = {() => {selectFileForVisualization(fileId)}} >
                        {getFileResourceLabel(file)}
                    </div>
                </div>

                <div className='SidebarFile-delete' onClick = {() => {deleteFile(fileId)}}>
                    <FaTrash/>
                </div>
            </div>
            {fileContentLoading && // Show spinner if file content is loading
            <div className='SpinnerModal'>
                <div className='LoadingSpinner-container'>
                    <LoadingSpinner loading={fileContentLoading}/>
                </div>
            </div>}
        </div>
    );
}

export default SidebarFile;
