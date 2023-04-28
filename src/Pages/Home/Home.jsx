import './Home.scss';
import React, {useState, useEffect
// ,Suspense
} from 'react';

//Popups
import UploadResourcePopup from '../../Components/Popup/UploadResourcePopup/UploadResourcePopup';
import ActionPopup from '../../Components/Popup/ActionPopup/ActionPopup';
import AddNewHostPopup from '../../Components/Popup/AddNewHostPopup/AddNewHostPopup';
import AddNewHostFromServiceRegistryPopup from '../../Components/Popup/AddNewHostFromServiceRegistryPopup/AddNewHostFromServiceRegistryPopup';
import ViewResourcePopup from '../../Components/Popup/ViewResourcePopup/ViewResourcePopup';
import ProcessOverviewPopup from '../../Components/Popup/ProcessOverviewPopup/ProcessOverviewPopup';
import ShadowPopup from '../../Components/Popup/ShadowPopup/ShadowPopup';

//Components
import Topbar from '../../Components/Topbar/Topbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import SidebarHosts from '../../Components/SidebarHosts/SidebarHosts';
import Visualizations from '../../Components/Visualizations/Visualizations';
// import ReactHtmlParser from 'react-html-parser';
import UploadManualChangesPopup from '../../Components/Popup/UploadManualChangesPopup/UploadManualChangesPopup';
import InformationPrompt from '../../Components/Widgets/InformationPrompt/InformationPrompt';
import {getAllHostStatusLocal} from '../../Store/LocalDataStore';

// import ReactDOMServer from 'react-dom/server'

function Home(props) {

    const {
        toggles,
        isOpen,
        set,
        addOrUpdateHost,
        removeHost,
        getAndAddFile,
        deleteFile,
        shouldSetFileContent,
        saveFileAndUpdate,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [popupProps, setPopupProps] = useState({});
    const [visualizationsFileId, setVisualizationsFileId] = useState(null);
    const [promptText, setPromptText] = useState("null");
    const [promptTitle, setPromptTitle] = useState("null");
    const [setTimeoutClosePrompt, setSetTimeoutClosePrompt] = useState(true);
    const [allHostStatus, setAllHostStatus] = useState([]);

    const popups = {
        AddNewHostPopup: 'AddNewHostPopup',
        AddFilePopup: 'AddFilePopup',
        ActionPopup: 'ActionPopup',
        NewSRHostPopup: 'NewSRHostPopup',
        ViewResourcePopup: 'ViewResourcePopup',
        ProcessOverviewPopup: 'ProcessOverviewPopup',
        UploadManualChangesPopup: 'UploadManualChangesPopup',
        ShadowPopup: 'ShadowPopup',
    }
    
    const openPopup = (popup, props = {}) => {
        switch(popup){
            case 'AddNewHostPopup': 
                set.setNewHostPopupOpen(true); 
                setPopupProps(props);
                break;
            case 'AddFilePopup': 
                set.setFilePopupOpen(true); 
                setPopupProps(props);
                break;
            case 'ActionPopup': 
                set.setActionPopupOpen(true); 
                setPopupProps(props);
                break;
            case 'NewSRHostPopup': 
                set.setNewHostFromSRPopupOpen(true); 
                setPopupProps(props);
                break;
            case 'ViewResourcePopup':
                set.setViewResourcePopupOpen(true);
                setPopupProps(props);
                break;
            case 'ProcessOverviewPopup':
                set.setProcessOverviewPopupOpen(true);
                setPopupProps(props);
                break;
            case 'UploadManualChangesPopup':
                set.setUploadManualChangesPopup(true);
                setPopupProps(props);
                break;
            case 'ShadowPopup':
                set.setShadowPopupOpen(true);
                setPopupProps(props);
                break;
            default: (() => {})(); break; // Do nothing. Produces empty lambda expression call
        }
    }

    const closePopup = (popup) => {
        switch(popup){
            case 'AddNewHostPopup': 
                set.setNewHostPopupOpen(false);
                break;
            case 'AddFilePopup': 
                set.setFilePopupOpen(false);
                break;
            case 'ActionPopup': 
                set.setActionPopupOpen(false);
                break;
            case 'NewSRHostPopup': 
                set.setNewHostFromSRPopupOpen(false);
                break;
            case 'ViewResourcePopup':
                set.setViewResourcePopupOpen(false);
                break;
            case 'ProcessOverviewPopup':
                set.setProcessOverviewPopupOpen(false);
                break;  
            case 'UploadManualChangesPopup':
                set.setUploadManualChangesPopupOpen(false);
                break;
            case 'ShadowPopup':
                set.setShadowPopupOpen(false);
                break;
            default: (() => {})(); break; // Do nothing. Produces empty lambda expression call
        }
    }

    const selectFileForVisualization = (fileId) => {
        if(fileId === null || fileId === undefined) {
            setVisualizationsFileId(null);
            return;
        }
        setVisualizationsFileId(fileId);
    }

    const openInformationPrompt = (promptTitle, promptText, setTimeoutClosePrompt = true) => {
        set.setIsInformationPromptOpen(true);
        setPromptTitle(promptTitle);
        setPromptText(promptText);
        setSetTimeoutClosePrompt(setTimeoutClosePrompt);
    }    

    // const [htmlString, setHtmlString] = useState(null); 

    useEffect(() => {
        setIsLoading(false);
        

        // const tb = <Topbar/>;
        // console.log(tb);
        // setHtmlString(ReactDOMServer.renderToString(tb));
        // // console.log(htmlString);

    }, []);

    const setAllHostsStatus = () => {
        const uniqueStatus = getAllHostStatusLocal().filter((x, i, a) => a.indexOf(x) === i)
        if(uniqueStatus.includes('online') && uniqueStatus.includes('offline')){ // if some hosts are offline and some are online
            setAllHostStatus( "mixed");
        } else if (uniqueStatus.includes('online') && !uniqueStatus.includes('offline')){ // if only if no hosts are offline
            setAllHostStatus("online"); 
        } else if (uniqueStatus.includes('offline') && !uniqueStatus.includes('online')){ // if only if no hosts are online
            setAllHostStatus("offline"); 
        } else if (uniqueStatus.length === 0){
            setAllHostStatus("noneConnected"); 
        }
    }

    if(isLoading){
        return (
            <div className="Home">
                <div>Loading ...</div>
            </div>
        )
    }
    
    // const htmlString = ReactDOMServer.renderToString(
    //         <Topbar toggleSidebar = {toggles.toggleSidebar}
    //         toggleSidebarHosts = {toggles.toggleSidebarHosts}
    //         sidebarOpen = {isOpen.sidebarOpen}
    //         sidebarHostsOpen = {isOpen.sidebarHostsOpen}
    //         />
    //     )
    // console.log(htmlString);

    // const ProfilePage = React.lazy(() => import(/* webpackIgnore: true */ htmlString));

    return (
        <div className="Home">
            <div className='Home-PageLayout'>
                <div className='Home-Topbar'>
                    <Topbar
                        toggleSidebar = {toggles.toggleSidebar}
                        toggleSidebarHosts = {toggles.toggleSidebarHosts}
                        sidebarOpen = {isOpen.sidebarOpen}
                        sidebarHostsOpen = {isOpen.sidebarHostsOpen}
                    />
                    {/* <div> { ReactHtmlParser(htmlString) } </div> */}
                </div>
                <div className={`Home-Page-below-topbar`}>
                    <div className={`Home-Sidebar Home-Sidebar${isOpen.sidebarOpen ? "-sidebaropen" : "-sidebarclosed"}`}>
                        <Sidebar
                            openPopup = {openPopup}
                            popups = {popups}
                            deleteFile = {deleteFile}
                            selectFileForVisualization = {selectFileForVisualization}
                            shouldSetFileContent = {shouldSetFileContent}
                            setComponentUpdaterFunction = {set.setComponentUpdaterFunction}
                            selectedFileId = {visualizationsFileId}
                            allHostStatus = {allHostStatus}
                        />
                    </div>

                    {visualizationsFileId && 
                        <div className={`Home-Content-visualizations-container Home-Content-visualizations-container${isOpen.sidebarOpen ? "-sidebaropen" : "-sidebarclosed"}`}>
                            <Visualizations
                                selectedFileId = {visualizationsFileId}
                                setComponentUpdaterFunction = {set.setComponentUpdaterFunction}
                                getAndAddFile = {getAndAddFile}
                                openPopup = {openPopup}
                                popups = {popups}
                            />
                        </div>
                        
                    }
                </div>

                <div className={`Home-SidebarHosts Home-SidebarHosts${isOpen.sidebarHostsOpen ? "-sidebarHostsopen" : "-sidebarHostsclosed"}`}>
                    <SidebarHosts
                        toggleSidebarHosts = {toggles.toggleSidebarHosts}
                        openPopup = {openPopup}
                        popups = {popups}
                        addHost = {addOrUpdateHost}
                        removeHost = {removeHost}
                        setComponentUpdaterFunction = {set.setComponentUpdaterFunction}
                        setAllHostsStatus = {setAllHostsStatus}
                    />
                </div>

                {isOpen.filePopupOpen ?
                    <UploadResourcePopup
                        toggleFilePopupOpen = {toggles.toggleFilePopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        getAndAddFile = {getAndAddFile}
                    />
                    : null
                }

                {isOpen.actionPopupOpen ?
                    <ActionPopup
                        toggleActionPopupOpen = {toggles.toggleActionPopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        openInformationPrompt = {openInformationPrompt}
                    />
                    : null
                }

                {isOpen.newHostPopupOpen ? 
                    <AddNewHostPopup
                        toggleNewHostPopupOpen = {toggles.toggleNewHostPopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        addHost = {addOrUpdateHost}
                    />
                    : null
                }

                {isOpen.newHostFromSROpen ? 
                    <AddNewHostFromServiceRegistryPopup
                        togglenewHostFromSRPopupOpen = {toggles.togglenewHostFromSRPopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        addHost = {addOrUpdateHost}
                    />
                    : null
                }

                {isOpen.ViewResourcePopupOpen ? 
                    <ViewResourcePopup
                        toggleViewResourcePopupOpen = {toggles.toggleViewResourcePopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        getAndAddFile = {getAndAddFile}
                    />
                    : null
                }

                {isOpen.processOverviewPopupOpen ?
                    <ProcessOverviewPopup
                        toggleProcessOverviewPopupOpen = {toggles.toggleProcessOverviewPopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        setComponentUpdaterFunction = {set.setComponentUpdaterFunction}
                        openInformationPrompt = {openInformationPrompt}
                    />
                    : null
                }

                {isOpen.uploadManualChangesPopup ? 
                    <UploadManualChangesPopup
                        toggleUploadManualChangesPopup = {toggles.toggleUploadManualChangesPopup}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        getAndAddFile = {getAndAddFile}
                        saveFileAndUpdate = {saveFileAndUpdate}
                    />
                    : null
                }

                {isOpen.shadowPopupOpen ?
                    <ShadowPopup
                        toggleShadowPopupOpen = {toggles.toggleShadowPopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        addOrUpdateHost = {addOrUpdateHost}
                    />
                    : null
                }

                {isOpen.isInformationPromptOpen ?
                    <InformationPrompt
                        text = {promptText}
                        title= {promptTitle}
                        closeButtonText = {"Close"}
                        onClosePrompt = {toggles.toggleIsInformationPromptOpen}
                        disabled = {false}
                        primary = {true}
                        setTimeoutClose = {setTimeoutClosePrompt}
                    />
                    : null
                }
                
            </div>
        </div>
    );
}

export default Home;
