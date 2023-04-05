import './App.css';
import {useState, useEffect, useRef} from 'react';
import Home from './Pages/Home/Home';
import Page1 from './Pages/Page1/Page1';
import Page2 from './Pages/Page2/Page2';
import { saveHost, removeHost, saveFile, getFile, removeFile, hostExits } from './Store/LocalDataStore';
import { pingAllAddedServices, pingAllProcesses } from './Utils/ServiceHelper';
import { GetFileImage, GetFileText } from './Services/RepositoryServices';
import { GetMinerConfig } from './Services/MinerServices';
import { GetRepositoryConfig } from './Services/RepositoryServices';
import { getFileExtension, getFileHost, getFileResourceId } from './Utils/FileUnpackHelper';

function App(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Is sidebar open
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
                if(updateComponents.Sidebar){
                    updateComponents.Sidebar.update();
                }
            });
        }, 10000);
    }, []);

    useEffect(() => {
        if(pingProcessInterval.current !== null) clearInterval(pingProcessInterval.current);
        pingProcessInterval.current = setInterval(() => {
            pingAllProcesses().then(() => {
                if(updateComponents.SidebarHosts){
                    updateComponents.SidebarHosts.update();
                }
                if(updateComponents.Sidebar){
                    updateComponents.Sidebar.update();
                }
            });
        }, 3000);
    }, []);

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
        if(!hostExits(host.name)){
            handleAddHostOfType(host.type.value, host.name).then((res) => {
                host.config = res?.data;
                saveHost(id, host);
                if(updateComponents.SidebarHosts){
                    updateComponents.SidebarHosts.update();
                }
            })
        }
    }

    const deleteHost = (id) => {
        removeHost(id);
        if(updateComponents.SidebarHosts){
            updateComponents.SidebarHosts.update();
        }
    }

    const shouldSetFileContent = (file) => {
        const fileExtension = getFileExtension(file);
        switch(fileExtension.toUpperCase()){
            case "XES": return false;
            case "BPMN": return true;
            case "PNG": return true;
            case "JPG": return true;
            case "DOT": return true;
            case "PNML": return true;
            default: return true;
        }
    }

    const getAndAddFile = (file, retries = 0) => {
        const fileExtension = getFileExtension(file);
        const resourceId = getFileResourceId(file);
        const host = getFileHost(file);

        saveFile(resourceId, file); // save the metadata without filecontent
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
                if(res.status === 200 && res.data && getFile(resourceId)) { // file could have been removed before completed
                    if (isImage) { 
                        console.log(res.data);
                        saveFile(resourceId, {...file, fileContent: URL.createObjectURL(res.data) })
                    } else {
                        saveFile(resourceId, {...file, fileContent: res.data }); // save the filecontent
                    }
                    setTimeout(() => { updateComponents.Sidebar.update() }, 1000);
                }
                else if(retries < 10)
                    setTimeout(() => { getAndAddFile(file, retries + 1); updateComponents.Sidebar.update() }, 6000);
            })
            .catch((e) => {
                if(retries < 10)
                    setTimeout(() => { getAndAddFile(file, retries + 1); updateComponents.Sidebar.update() }, 6000);
            });
    }

    const deleteFile = (id) => { //Deletes from local memory - not repository
        removeFile(id);
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
