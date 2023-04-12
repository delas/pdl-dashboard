import './App.css';
import {useState, useEffect, useRef} from 'react';
import Home from './Pages/Home/Home';
import Page1 from './Pages/Page1/Page1';
import Page2 from './Pages/Page2/Page2';
import { saveHostLocal, removeHostLocal, saveFileLocal, getFileLocal, removeFileLocal, hostExitsLocal } from './Store/LocalDataStore';
import { pingAllAddedServices, pingAllProcesses, getAllDynamicResources } from './Utils/ServiceHelper';
import { GetFileImage, GetFileText } from './Services/RepositoryServices';
import { GetMinerConfig } from './Services/MinerServices';
import { GetRepositoryConfig } from './Services/RepositoryServices';
import { getFileExtension, getFileHost, getFileResourceId, getFileResourceType } from './Utils/FileUnpackHelper';
import { pingDynamicResourceInterval, pingHostInterval, pingMinerProcessInterval } from './config';

function App(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true); // Is sidebar open
    const [sidebarHostsOpen, setSidebarHostsOpen] = useState(false); // Is sidebarhost open
    const [updateComponents, setUpdateComponents] = useState([]); // force rerender child components

    // --------------- Is Popup open ----------------
    const [filePopupOpen, setFilePopupOpen] = useState(false);
    const [actionPopupOpen, setActionPopupOpen] = useState(false);
    const [newHostPopupOpen, setNewHostPopupOpen] = useState(false);
    const [newHostFromSROpen, setNewHostFromSRPopupOpen] = useState(false);
    const [GetFilePopupOpen, setGetFilePopupOpen] = useState(false); 
    const [processOverviewPopupOpen, setProcessOverviewPopupOpen] = useState(false);

    let pingInterval = useRef(null);
    let pingProcessInterval = useRef(null);
    let pingDynamicResourcesInterval = useRef(null);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    const toggleSidebarHosts = () => {
        setSidebarHostsOpen(!sidebarHostsOpen);
    }

    const toggleFilePopupOpen = () => {
        setFilePopupOpen(!filePopupOpen);
    }

    const toggleActionPopupOpen = () => {
        setActionPopupOpen(!actionPopupOpen);
    }

    const toggleNewHostPopupOpen = () => {
        setNewHostPopupOpen(!newHostPopupOpen)
    }

    const togglenewHostFromSRPopupOpen = () => {
        setNewHostFromSRPopupOpen(!newHostFromSROpen)
    }

    const toggleGetFilePopupOpen = () => {
        setGetFilePopupOpen(!GetFilePopupOpen)
    }

    const toggleProcessOverviewPopupOpen = () => {
        setProcessOverviewPopupOpen(!processOverviewPopupOpen);
    }

    useEffect(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if(pingInterval.current !== null) clearInterval(pingInterval.current);
        pingInterval.current = setInterval(() => {
            pingAllAddedServices().then(() => {
                if(updateComponents.SidebarHosts){
                    updateComponents.SidebarHosts.update();
                }
            });
        }, pingHostInterval);
    }, []);

    useEffect(() => {
        if(pingProcessInterval.current !== null) clearInterval(pingProcessInterval.current);
        pingProcessInterval.current = setInterval(() => {
            pingAllProcesses(getAndAddFile).then(() => {
                if(updateComponents.ProcessOverviewPopup){
                    setTimeout(() => {
                        updateComponents.ProcessOverviewPopup.update();
                    }, 200)
                }
            });
        }, pingMinerProcessInterval);
    }, []);

    // useEffect(() => {
    //     if(pingDynamicResourcesInterval.current !== null) clearInterval(pingDynamicResourcesInterval.current);
    //     pingDynamicResourcesInterval.current = setInterval(() => {
    //         getAllDynamicResources(getAndAddFile).then(() => {
    //             if(updateComponents.Sidebar){
    //                 updateComponents.Sidebar.update();
    //             }
    //             if(updateComponents.Visualizations){
    //                 updateComponents.Visualizations.update();
    //             }
    //         });
    //     }, pingDynamicResourceInterval);
    // })

    const setComponentUpdaterFunction = (componentName, updateFunc) => {
        let updateComponentsTemp = updateComponents;
        updateComponentsTemp[componentName] = updateFunc;
        setUpdateComponents(updateComponentsTemp);
    }

    const handleAddHostOfType = async (type, hostname) => {
        switch(type){
            case 'miner': return GetMinerConfig(hostname)
            case 'repository': return GetRepositoryConfig(hostname)
            case 'service registry': return null;
            default: return null;
        }
    }

    const addHost = (id, host) => {
        if(!hostExitsLocal(host.name)){
            handleAddHostOfType(host.type.value, host.name).then((res) => {
                host.config = res?.data;
                saveHostLocal(id, host);
                if(updateComponents.SidebarHosts){
                    updateComponents.SidebarHosts.update();
                }
            })
        }
    }

    const deleteHost = (id) => {
        removeHostLocal(id);
        if(updateComponents.SidebarHosts){
            updateComponents.SidebarHosts.update();
        }
    }

    const shouldSetFileContent = (file) => {
        if(getFileResourceType(file).toUpperCase() === "EVENTSTREAM"){
            return false;
        }

        const fileExtension = getFileExtension(file).toUpperCase();
        switch(fileExtension){
            case "XES": return false;
            case "BPMN": return true;
            case "PNG": return true;
            case "JPG": return true;
            case "DOT": return true;
            case "PNML": return true;
            default: return true;
        }
    }

    const getAndAddFile = (file, retry = false, retries = 0) => {
        if(!file || retries >= 10) return;

        const fileExtension = getFileExtension(file);
        const resourceId = getFileResourceId(file);
        const host = getFileHost(file);
        saveFileLocal(resourceId, file); // save the metadata without filecontent
        setTimeout(() => { updateComponents.Sidebar.update() }, 500);

        let responsePromise;
        const isImage = fileExtension.toUpperCase() === "PNG" 
            || fileExtension.toUpperCase() === "JPG" 
            || fileExtension.toUpperCase() === "SVG";
        if(shouldSetFileContent(file)){
            if(isImage) responsePromise = GetFileImage(host, resourceId);
            else responsePromise = GetFileText(host, resourceId); 
        }
        if(responsePromise)
            responsePromise
            .then((res) => {
                if(res.status === 200 && res.data && getFileLocal(resourceId)) { // file could have been removed before completed
                    if (isImage) {
                        saveFileLocal(resourceId, {...file, fileContent: URL.createObjectURL(res.data) })
                    } else {
                        saveFileLocal(resourceId, {...file, fileContent: res.data }); // save the filecontent
                    }
                    setTimeout(() => { updateComponents.Sidebar.update() }, 500);
                }
            })
            .catch((err) => {
                if(retry) setTimeout(() => getAndAddFile(file, true, retries + 1), 3000);
            })
    }

    const deleteFile = (id) => { //Deletes from local memory - not repository
        removeFileLocal(id);
        if(updateComponents.Sidebar){
            updateComponents.Sidebar.update();
        }
    }

    if(isLoading){
        return (
            <div className="App">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className="App">
            {props.page === "Home" ? <Home 
                addHost = {addHost}
                removeHost = {deleteHost}
                getAndAddFile = {getAndAddFile}
                deleteFile = {deleteFile}
                updateComponents = {updateComponents}
                shouldSetFileContent = {shouldSetFileContent}
                toggles = {{
                    toggleSidebar: toggleSidebar,
                    toggleSidebarHosts: toggleSidebarHosts,
                    toggleFilePopupOpen: toggleFilePopupOpen,
                    toggleActionPopupOpen: toggleActionPopupOpen,
                    toggleNewHostPopupOpen: toggleNewHostPopupOpen,
                    togglenewHostFromSRPopupOpen: togglenewHostFromSRPopupOpen,
                    toggleGetFilePopupOpen: toggleGetFilePopupOpen,
                    toggleProcessOverviewPopupOpen: toggleProcessOverviewPopupOpen
                }}
                set = {{
                    setSidebarOpen: setSidebarOpen,
                    setSidebarHostsOpen: setSidebarHostsOpen,
                    setFilePopupOpen: setFilePopupOpen,
                    setActionPopupOpen: setActionPopupOpen,
                    setNewHostPopupOpen: setNewHostPopupOpen,
                    setNewHostFromSRPopupOpen: setNewHostFromSRPopupOpen,
                    setGetFilePopupOpen: setGetFilePopupOpen,
                    setComponentUpdaterFunction: setComponentUpdaterFunction,
                    setProcessOverviewPopupOpen: setProcessOverviewPopupOpen
                }}
                isOpen = {{
                    sidebarOpen: sidebarOpen,
                    sidebarHostsOpen: sidebarHostsOpen,
                    filePopupOpen: filePopupOpen,
                    actionPopupOpen: actionPopupOpen,
                    newHostPopupOpen: newHostPopupOpen,
                    newHostFromSROpen: newHostFromSROpen,
                    GetFilePopupOpen: GetFilePopupOpen,
                    processOverviewPopupOpen: processOverviewPopupOpen
                }}
            /> : null}
            {props.page === "Page1" ? <Page1/> : null}
            {props.page === "Page2" ? <Page2/> : null}
        </div>
    );
}

export default App;
