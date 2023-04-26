import './Sidebar.scss';
// import Iconi from '../Widgets/Button/IconizedButton/IconizedButton';
import IconizedButton from '../Widgets/Buttons/IconizedButton/IconizedButton';
import {useState, useEffect, useCallback} from 'react';
import { FaCircle, FaCog, FaFileUpload, FaBuffer, FaFileDownload } from 'react-icons/fa';
import {ImCogs} from 'react-icons/im';
import SidebarFile from './SidebarFile/SidebarFile';
import { getAllFilesLocal, getAllHostStatusLocal } from '../../Store/LocalDataStore';
import { getFileContent, getFileCreationDate, getFileResourceId, getFileResourceLabel, getFileResourceType } from '../../Utils/FileUnpackHelper';
import LoadingSpinner from '../Widgets/LoadingSpinner/LoadingSpinner';

function Sidebar(props) {

    const {
        openPopup,
        popups,
        deleteFile,
        selectFileForVisualization,
        shouldSetFileContent,
        setComponentUpdaterFunction,
        selectedFileId,
        allHostStatus
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() =>{ 
        updateState({}); 
        // setFiles(sortFiles(getAllFilesLocal(), sortingOptions.dsc));
    }, []);

    useEffect(() => {
        setComponentUpdaterFunction("Sidebar", {update: forceUpdate});
        setIsLoading(false);
    }, []);

    // useEffect(() => {
        // setFiles(sortFiles(getAllFilesLocal(), sortingOptions.dsc));
    // }, []);

    const sortingOptions = {
        asc: "asc",
        dsc: "dsc",
        alfabetical: "alfabetical",
        type: "type",
    }

    const sortFiles = (files, sortType) => {
        switch(sortType){
            case sortingOptions.asc:
                return sortFilesAsc(files);
            case sortingOptions.dsc:
                return sortFilesDsc(files);
            case sortingOptions.alfabetical:
                return sortFilesAlphabetical(files);
            case sortingOptions.type:
                return sortFilesByType(files);
            default:
                return sortFilesDsc(files);
        }
    }

    const sortFilesAsc = (files) => {
        return files.sort((a, b) => {
            return getFileCreationDate(a) - getFileCreationDate(b);
        });
    }

    const sortFilesDsc = (files) => {
        return files.sort((a, b) => {
            return getFileCreationDate(b) - getFileCreationDate(a);
        });
    }

    const files = sortFiles(getAllFilesLocal(), sortingOptions.dsc);

    const sortFilesAlphabetical = (files) => {
        return files.sort((a, b) => {
            if(getFileResourceLabel(a) < getFileResourceLabel(b)) return -1;
            if(getFileResourceLabel(a) > getFileResourceLabel(b)) return 1;
            return 0;
        });
    }

    const sortingOrderTypes = {
        BPMN: 0,
        PNML: 1,
        JSON: 2,
        XML: 3,
        PNG: 4,
        SVG: 5,
        JPG: 6,
        JPEG: 7,
        GIF: 8,
    }

    const sortFilesByType = (files) => {
        return files.sort((a, b) => {
            return sortingOrderTypes[getFileResourceType(a).toUpperCase()] - sortingOrderTypes[getFileResourceType(b).toUpperCase()];
        });
    }

    const statusIconDisplayer = () => {
        if(allHostStatus === "mixed") return <FaCircle className='Sidebar-status-icon-yellow'/>
        if(allHostStatus === "online") return <FaCircle className='Sidebar-status-icon-green'/>
        if(allHostStatus === "offline") return <FaCircle className='Sidebar-status-icon-red'/>
        if(allHostStatus === "none") return <FaCircle className='Sidebar-status-icon-grey'/>
    }

    const statusTextDisplayer = () => {
        if(allHostStatus === "mixed") return <span>Some systems offline</span>
        if(allHostStatus === "online") return <span>All systems online</span>
        if(allHostStatus === "offline") return <span>All systems offline</span>
        if(allHostStatus === "none") return <span>No hosts connected</span>
    }

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
                    <div className='Sidebar-flexContainer-IconizedButtons'>
                        <IconizedButton
                            text = {`Upload resource`}
                            icon = {<FaFileUpload/>}
                            disabled = {false}
                            className = {``}
                            onClick = {() => {openPopup(popups.AddFilePopup)}}
                        />
                        <IconizedButton
                            text = {`View resource`}
                            icon = {<FaFileDownload/>}
                            disabled = {false}
                            className = {``}
                            onClick = {() => {openPopup(popups.GetFilePopup)}}
                        />
                        <IconizedButton
                            text = {`Execute action`}
                            icon = {<FaCog/>}
                            disabled = {false}
                            className = {``}
                            onClick = {() => {openPopup(popups.ActionPopup)}}
                        />
                        <IconizedButton
                            text = {`Inspect processes`}
                            icon = {<ImCogs/>}
                            disabled = {false}
                            className={``}
                            onClick = {() => {openPopup(popups.ProcessOverviewPopup)}}
                        />
                    </div>
                    <div className='Sidebar-flexContainer-files'>
                        {
                            files.map((file, index) => {
                                const fileId = getFileResourceId(file);
                                const isSelected = selectedFileId === fileId;
                                return(
                                    <SidebarFile key={index}
                                        openPopup = {openPopup}
                                        popups = {popups}
                                        deleteFile = {deleteFile}
                                        // fileId = {fileId}
                                        file = {file}
                                        selectFileForVisualization = {selectFileForVisualization}
                                        shouldSetFileContent = {shouldSetFileContent}
                                        isSelected = {isSelected}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
                <div className='Sidebar-flexContainer-status'>
                    <div className='Sidebar-status'>
                        <div className='Sidebar-status-icon'>
                            {statusIconDisplayer()}
                        </div>
                        <div className='Sidebar-status-text'>
                            {statusTextDisplayer()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
