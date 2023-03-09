import './App.css';
import {useCallback, useState, useEffect, useRef} from 'react';
import Home from './Pages/Home/Home';
import Page1 from './Pages/Page1/Page1';
import Page2 from './Pages/Page2/Page2';
import { saveHost, removeHost, saveFile, removeFile } from './Store/LocalDataStore';
import { pingAllAddedServices } from './Utils/ServiceHelper';

function App(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarHostsOpen, setSidebarHostsOpen] = useState(false);
    const [filePopupOpen, setFilePopupOpen] = useState(false);
    const [actionPopupOpen, setActionPopupOpen] = useState(false);
    const [newHostPopupOpen, setNewHostPopupOpen] = useState(false);
    const [newHostFromSROpen, setNewHostFromSRPopupOpen] = useState(false);
    const [GetFilePopupOpen, setGetFilePopupOpen] = useState(false);

    let pingInterval = useRef(null);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

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

    useEffect(() => {
        setIsLoading(false);
    });

    useEffect(() => {
        if(pingInterval.current !== null) clearInterval(pingInterval.current);
        pingInterval.current = setInterval(() => {
            pingAllAddedServices();
            forceUpdate();
        }, 15000);
    }, []);

    const addHost = (id, host) => {
        saveHost(id, host);
        forceUpdate();
    }

    const deleteHost = (id) => {
        removeHost(id);
        forceUpdate();
    }

    const addFile = (id, file) => {
        saveFile(id, file);
        setTimeout(() => {
            forceUpdate();
        }, 500);
        
    }

    const deleteFile = (id) => {
        removeFile(id);
        forceUpdate();
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
                addFile = {addFile}
                deleteFile = {deleteFile}
                toggles = {{
                    toggleSidebar: toggleSidebar,
                    toggleSidebarHosts: toggleSidebarHosts,
                    toggleFilePopupOpen: toggleFilePopupOpen,
                    toggleActionPopupOpen: toggleActionPopupOpen,
                    toggleNewHostPopupOpen: toggleNewHostPopupOpen,
                    togglenewHostFromSRPopupOpen: togglenewHostFromSRPopupOpen,
                    toggleGetFilePopupOpen: toggleGetFilePopupOpen
                }}
                set = {{
                    setSidebarOpen: setSidebarOpen,
                    setSidebarHostsOpen: setSidebarHostsOpen,
                    setFilePopupOpen: setFilePopupOpen,
                    setActionPopupOpen: setActionPopupOpen,
                    setNewHostPopupOpen: setNewHostPopupOpen,
                    setNewHostFromSRPopupOpen: setNewHostFromSRPopupOpen,
                    setGetFilePopupOpen: setGetFilePopupOpen
                }}
                isOpen = {{
                    sidebarOpen: sidebarOpen,
                    sidebarHostsOpen: sidebarHostsOpen,
                    filePopupOpen: filePopupOpen,
                    actionPopupOpen: actionPopupOpen,
                    newHostPopupOpen: newHostPopupOpen,
                    newHostFromSROpen: newHostFromSROpen,
                    GetFilePopupOpen: GetFilePopupOpen,
                }}
            /> : null}
            {props.page === "Page1" ? <Page1/> : null}
            {props.page === "Page2" ? <Page2/> : null}
        </div>
    );
}

export default App;
