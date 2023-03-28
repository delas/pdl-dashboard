import './SidebarFile.scss';
import {useState, useEffect} from 'react';
import { FaTrash } from 'react-icons/fa';
import { getFile } from '../../Store/LocalDataStore';
import { getFileExtension, getFileResourceLabel } from '../../Utils/FileUnpackHelper';
import LoadingSpinner from '../Widgets/LoadingSpinner/LoadingSpinner';

function SidebarFile(props) {

    const {
        fileId,
        deleteFile,
        selectFileForVisualization,
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
        if(!tempFile.fileContent){
            setFileContentLoading(true);
            setTimeout(() => {getFileAndCheckContents()}, 1000);
        } else {
            setFileContentLoading(false);
        }
    }

    if(!file){
        return (
            <div className="SidebarFile">
                <LoadingSpinner loading={true}/>
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
                    <div className='SidebarFile-filename' 
                        // onClick = {() => { openPopup(popups.AddNewHostPopup, {repository: {}}) }}
                        onClick = {() => {selectFileForVisualization(fileId)}}
                    >
                        {getFileResourceLabel(file)}
                    </div>
                </div>

                <div className='SidebarFile-delete' onClick = {() => {deleteFile(fileId)}}>
                    <FaTrash/>
                </div>
            </div>
            {!file.fileContent && 
            <div className='SpinnerModal'>
                <div className='LoadingSpinner-container'>
                    <LoadingSpinner loading={fileContentLoading}/>
                </div>
            </div>}
        </div>
    );
}

export default SidebarFile;
