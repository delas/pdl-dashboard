import './SidebarFile.scss';
import {useState, useEffect} from 'react';
import { FaTrash } from 'react-icons/fa';

function SidebarFile(props) {

    const {
        filename,
        filetype,
        fileId,
        deleteFile,
        selectFileForVisualization,
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if(isLoading){
        return (
            <div className="SidebarFile">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className="SidebarFile">
            <div className='SidebarFile-flexContainer'>
                <div className='SidebarFile-flexContainer-left'>
                    <div className='SidebarFile-filetype'>
                        {filetype}
                    </div>
                    <div className='SidebarFile-filename' 
                        // onClick = {() => { openPopup(popups.AddNewHostPopup, {repository: {}}) }}
                        onClick = {() => {selectFileForVisualization(fileId)}}
                    >
                        {filename}
                    </div>
                </div>
                <div className='SidebarFile-delete' onClick = {() => {deleteFile(fileId)}}>
                    <FaTrash/>
                </div>
            </div>
        </div>
    );
}

export default SidebarFile;
