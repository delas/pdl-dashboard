import './App.css';
import {useState, useEffect} from 'react';
import Home from './Pages/Home/Home';
import Page1 from './Pages/Page1/Page1';
import Page2 from './Pages/Page2/Page2';
import {PingServiceRegistry} from './Services/ServiceRegistryServices';
import {PingMiner} from './Services/MinerServices';
import {PingRepository} from './Services/RepositoryServices';

function App(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarHostsOpen, setSidebarHostsOpen] = useState(false);
    const [filePopupOpen, setFilePopupOpen] = useState(false);
    const [actionPopupOpen, setActionPopupOpen] = useState(false);
    const [newHostPopupOpen, setNewHostPopupOpen] = useState(false);
    const [newHostFromSROpen, setNewHostFromSRPopupOpen] = useState(false);

    const [allHostStatus, setAllHostStatus] = useState([{}]); // list of objects {id, status}
    const [isPingActiveForHosts, setIsPingActiveForHosts] = useState([{}]); // List of hosts being actively pinged {id, active}

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

    const addHostStatus = (id, status) => {
        setAllHostStatus(allHostStatus.concat({id: id, status: status}));
    }

    const removeHostStatus = (id) => {
        setAllHostStatus(allHostStatus.filter((host) => host.id !== id));
    }

    const getHostStatus = (id) => {
        return allHostStatus.filter((host) => host.id === id);
    }

    useEffect(() => {
        setIsLoading(false);
    });

    const getResponseStatus = (res) => {
        return res.status === 200 && res.data.toUpperCase() === "PONG";
    }

    const setStatus = (status, id) => {
        removeHostStatus(id);
        addHostStatus(id, status);
    }

    const pingIndividualHost = (host, ping) => {
        ping(host.hostName).then((res) => {
            setStatus(getResponseStatus(res) ? "online" : "offline");
        }).catch((e) => {
            setStatus('offline');
            setIsLoading(false);
        })
    }

    const isBeingActivelyPinged = (id) => {
        return isPingActiveForHosts.filter((pingHost) => pingHost.id === id) !== [];
    }

    const pingOnInterval = async (host, ping, timeBetweenTicks) => {
        addActivelyPing(host.id, true);
        setInterval(() => {
            pingIndividualHost(host, ping)
        }, timeBetweenTicks);
    }

    const getPingFunction = (serviceType) => {
        switch(serviceType){
            case "miner": return PingMiner;
            case "repository": return PingRepository;
            case "service registry": return PingServiceRegistry;
            default: return null;
        }
    }

    useEffect(() => {
        allHostStatus.forEach((host, index) => {
            if(!isBeingActivelyPinged(host.id)){
                pingOnInterval(host, getPingFunction(host.type), 5000);
            }
        })
    }, [isBeingActivelyPinged, allHostStatus]);

    

    const addActivelyPing = (id, active) => {
        const newPing = {id: id, active: active}; // new object to be added
        const pingHostObject = isPingActiveForHosts.filter((pingHost) => pingHost.id === id);
        if(pingHostObject === undefined || pingHostObject === null){ // add new if not already present
            setIsPingActiveForHosts(isPingActiveForHosts.concat(newPing));
        } else { //override if present
            const listWithoutPingHost = isPingActiveForHosts.filter((pingHost) => pingHost.id !== id);
            setIsPingActiveForHosts(listWithoutPingHost.concat(newPing));
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
