import './Sidebar.scss';
import Button from '../Button/Button';
import {useState, useEffect, useCallback} from 'react';
import { FaCircle, FaCog, FaFileUpload, FaBuffer } from 'react-icons/fa';
import SidebarFile from '../SidebarFiles/SidebarFile';
import { getAllFiles } from '../../Store/LocalDataStore';
import { getFileResourceId } from '../../Utils/FileUnpackHelper';
import LoadingSpinner from '../Widgets/LoadingSpinner/LoadingSpinner';

function Sidebar(props) {

    const {
        openPopup,
        popups,
        deleteFile,
        selectFileForVisualization,
        // setUpdateSidebar
        shouldSetFileContent,
        setComponentUpdaterFunction,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [files, setFiles] = useState([]);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() =>{ updateState({}); setFiles(getAllFiles());}, []);

    useEffect(() => {
        setComponentUpdaterFunction("Sidebar", {update: forceUpdate});
        setIsLoading(false);
    }, []);

    useEffect(() => {
        setFiles(getAllFiles());
    }, []);

    if(isLoading){
        return (
            <div className="Sidebar">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
            </div>
        )
    }

    return (
        <div className={`Sidebar`}>
            <div className='Sidebar-flexContainer'>
                <div className='Sidebar-flexContainer-top'>
                    <div className='Sidebar-flexContainer-buttons'>
                        <Button
                            text = {`Upload resource`}
                            icon = {<FaFileUpload/>}
                            disabled = {false}
                            className = {``}
                            onClick = {() => {openPopup(popups.AddFilePopup)}}
                        />
                        <Button
                            text = {`Execute action`}
                            icon = {<FaCog/>}
                            disabled = {false}
                            className = {``}
                            onClick = {() => {openPopup(popups.ActionPopup)}}
                        />
                        <Button
                            text = {`Add new host`}
                            icon = {<FaBuffer/>}
                            disabled = {false}
                            className={``}
                            onClick = {() => {openPopup(popups.AddNewHostPopup)}}
                        />
                    </div>
                    <div className='Sidebar-flexContainer-files'>
                        {
                            files.map((file, index) => {
                                const fileId = getFileResourceId(file);
                                return(
                                    <SidebarFile key={index}
                                        openPopup = {openPopup}
                                        popups = {popups}
                                        deleteFile = {deleteFile}
                                        fileId = {fileId}
                                        selectFileForVisualization = {selectFileForVisualization}
                                        shouldSetFileContent = {shouldSetFileContent}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
                <div className='Sidebar-flexContainer-actions'>
                    {/* <div>
                        {
                            getFilesOfType("png").map((file) => {
                                return <img src={file.fileContent}></img>
                            })
                        }
                    </div> */}
                </div>
                <div className='Sidebar-flexContainer-status'>
                    <div className='Sidebar-status'>
                        <div className='Sidebar-status-icon'>
                            <FaCircle/>
                        </div>
                        <div className='Sidebar-status-text'>
                            All systems online
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
