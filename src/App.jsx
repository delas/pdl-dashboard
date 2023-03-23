import './App.css';
import {useState, useEffect, useRef} from 'react';
import Home from './Pages/Home/Home';
import Page1 from './Pages/Page1/Page1';
import Page2 from './Pages/Page2/Page2';
import { saveHost, removeHost, saveFile, removeFile, hostExits } from './Store/LocalDataStore';
import { pingAllAddedServices } from './Utils/ServiceHelper';
import { GetFileImage, GetFileText } from './Services/RepositoryServices';
import { GetMinerConfig } from './Services/MinerServices';
import { GetRepositoryConfig } from './Services/RepositoryServices';

function App(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarHostsOpen, setSidebarHostsOpen] = useState(false);
    const [filePopupOpen, setFilePopupOpen] = useState(false);
    const [actionPopupOpen, setActionPopupOpen] = useState(false);
    const [newHostPopupOpen, setNewHostPopupOpen] = useState(false);
    const [newHostFromSROpen, setNewHostFromSRPopupOpen] = useState(false);
    const [GetFilePopupOpen, setGetFilePopupOpen] = useState(false);
    const [updateSidebarHosts, setUpdateSidebarHosts] = useState(null);
    const [updateSidebar, setUpdateSidebar] = useState(null);

    let pingInterval = useRef(null);

    // const [, updateState] = useState();
    // const forceUpdate = useCallback(() => updateState({}), []);

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
    }, []);

    useEffect(() => {
        if(pingInterval.current !== null) clearInterval(pingInterval.current);
        pingInterval.current = setInterval(() => {
            pingAllAddedServices().then(() => {
                if(updateSidebarHosts){
                    updateSidebarHosts.update();
                }
            });
        }, 10000);
    }, []);

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
                if(updateSidebarHosts){
                    updateSidebarHosts.update();
                }
            })
        }
    }

    const deleteHost = (id) => {
        removeHost(id);
        if(updateSidebarHosts !== null && updateSidebarHosts !== undefined){
            updateSidebarHosts.update();
        }
        // forceUpdate();
    }

    const addFile = (file, retries = 0) => {
        let responsePromise;
        const isImage = file.FileInfo.FileExtension === "png" || file.FileInfo.FileExtension === "jpg";
        // console.log(file.Host, file.ResourceId);
        // console.log(file);
        isImage ? responsePromise = GetFileImage(file.Host, file.ResourceId) 
        : responsePromise = GetFileText(file.Host, file.ResourceId);

        responsePromise
        .then((res) => {
            if(res.status === 200 && res.data) {
                isImage ? saveFile(file.ResourceId, {...file, fileContent: URL.createObjectURL(res.data) }) :
                saveFile(file.ResourceId, {...file, fileContent: res.data });
                setTimeout(() => { updateSidebar.update() }, 500);
            }
            else if(retries < 10)
                setTimeout(() => { addFile(file, retries + 1); updateSidebar.update() }, 6000);
        })
        .catch((e) => {
            if(retries < 10)
                setTimeout(() => { addFile(file, retries + 1); updateSidebar.update() }, 6000);
        });
    }

    const deleteFile = (id) => {
        removeFile(id);
        if(updateSidebar !== null && updateSidebar !== undefined){
            updateSidebar.update();
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
                    setGetFilePopupOpen: setGetFilePopupOpen,
                    setUpdateSidebarHosts: setUpdateSidebarHosts,
                    setUpdateSidebar: setUpdateSidebar
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
