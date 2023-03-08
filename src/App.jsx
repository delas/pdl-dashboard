import './App.css';
import {useState, useEffect, useRef} from 'react';
import Home from './Pages/Home/Home';
// import AddFilePopup from './Components/Popup/AddfilePopup/AddfilePopup';
import Page1 from './Pages/Page1/Page1';
import Page2 from './Pages/Page2/Page2';
import { saveHost, removeHost } from './Store/LocalDataStore';

import { pingAllAddedServices } from './Utils/ServiceHelper';

function App(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarHostsOpen, setSidebarHostsOpen] = useState(false);
    const [filePopupOpen, setFilePopupOpen] = useState(false);
    const [actionPopupOpen, setActionPopupOpen] = useState(false);
    const [newHostPopupOpen, setNewHostPopupOpen] = useState(false);
    const [newHostFromSROpen, setNewHostFromSRPopupOpen] = useState(false);

    let pingInterval = useRef(null);

    const [, forceUpdate] = useState();

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
    }

    const deleteHost = (id) => {
        removeHost(id);
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
                toggles = {{
                    toggleSidebar: toggleSidebar,
                    toggleSidebarHosts: toggleSidebarHosts,
                    toggleFilePopupOpen: toggleFilePopupOpen,
                    toggleActionPopupOpen: toggleActionPopupOpen,
                    toggleNewHostPopupOpen: toggleNewHostPopupOpen,
                    togglenewHostFromSRPopupOpen: togglenewHostFromSRPopupOpen
                }}
                set = {{
                    setSidebarOpen: setSidebarOpen,
                    setSidebarHostsOpen: setSidebarHostsOpen,
                    setFilePopupOpen: setFilePopupOpen,
                    setActionPopupOpen: setActionPopupOpen,
                    setNewHostPopupOpen: setNewHostPopupOpen,
                    setNewHostFromSRPopupOpen: setNewHostFromSRPopupOpen,
                }}
                isOpen = {{
                    sidebarOpen: sidebarOpen,
                    sidebarHostsOpen: sidebarHostsOpen,
                    filePopupOpen: filePopupOpen,
                    actionPopupOpen: actionPopupOpen,
                    newHostPopupOpen: newHostPopupOpen,
                    newHostFromSROpen: newHostFromSROpen
                }}
            /> : null}
            {props.page === "Page1" ? <Page1/> : null}
            {props.page === "Page2" ? <Page2/> : null}
        </div>
    );
}

export default App;
