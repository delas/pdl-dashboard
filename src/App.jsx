import './App.css';
import {useState, useEffect} from 'react';
import Home from './Pages/Home/Home';
import Page1 from './Pages/Page1/Page1';
import Page2 from './Pages/Page2/Page2';
import {PingServiceRegistry} from './Services/ServiceRegistryServices';
import {PingMiner} from './Services/MinerServices';
import {PingRepository} from './Services/RepositoryServices';
import {getMiners, getRepositories, getServiceRegistries, removeHost} from './Store/LocalDataStore';

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

    // const [hosts, setHosts] = useState

    const toggleSidebar = () => { setSidebarOpen(!sidebarOpen); }

    const toggleSidebarHosts = () => { setSidebarHostsOpen(!sidebarHostsOpen); }

    const toggleFilePopupOpen = () => { setFilePopupOpen(!filePopupOpen); }

    const toggleActionPopupOpen = () => { setActionPopupOpen(!actionPopupOpen); }

    const toggleNewHostPopupOpen = () => { setNewHostPopupOpen(!newHostPopupOpen) }

    const togglenewHostFromSRPopupOpen = () => { setNewHostFromSRPopupOpen(!newHostFromSROpen) }

    const isBeingActivelyPinged = (id) => { return isPingActiveForHosts.filter((pingHost) => pingHost.id === id) !== []; }
    
    const removeHostStatus = (id) => { setAllHostStatus(allHostStatus.filter((host) => host.id !== id)); }

    const getHostStatus = (id) => { return allHostStatus.filter((host) => host.id === id); }

    const getResponseStatus = (res) => { return res.status === 200 && res.data.toUpperCase() === "PONG"; }

    const addOrUpdateHostStatus = (id, status) => {
        const hostStatus = {id: id, status: status};
        const existsInList = allHostStatus.filter((host) => host.id === id).length > 0;
        console.log(existsInList);
        console.log(allHostStatus.filter((host) => host.id === id))
        if(existsInList === false) setAllHostStatus(allHostStatus.concat(hostStatus));
        else {
            const listWithoutHostStatus = allHostStatus.filter((host) => host.id !== id);
            setAllHostStatus(listWithoutHostStatus.concat(hostStatus));
        }
    }

    const addActivelyPing = (id, active) => {
        const newPing = {id: id, active: active}; // new object to be added
        const existsInList = isPingActiveForHosts.filter((pingHost) => pingHost.id === id).length > 0;
        if(existsInList) setIsPingActiveForHosts(isPingActiveForHosts.concat(newPing));
        else { //override if present
            const listWithoutPingHost = isPingActiveForHosts.filter((pingHost) => pingHost.id !== id);
            setIsPingActiveForHosts(listWithoutPingHost.concat(newPing));
        }
    }

    const removeActivelyPing = (id) => {
        setIsPingActiveForHosts(isPingActiveForHosts.filter((pingHost) => pingHost.id !== id));
    }

    const pingIndividualHost = (host, ping) => {
        ping(host.hostName).then((res) => {
            addOrUpdateHostStatus(host.id, getResponseStatus(res) ? "online" : "offline");
        }).catch((e) => {
            addOrUpdateHostStatus(host.id, "offline");
        })
    }

    const pingOnInterval = async (host, ping, timeBetweenTicks) => {
        addActivelyPing(host.id, true);
        setInterval(() => {
            pingIndividualHost(host, ping)
        }, timeBetweenTicks);
    }

    const removeHostHandler = (id) => {
        removeHost(id);
        removeHostStatus(id);
        removeActivelyPing(id);
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
        setIsLoading(false);
    });


    console.log(getMiners());

    useEffect(() => {
        getMiners().forEach((host) => { addOrUpdateHostStatus(host.id, "offline"); })
        getRepositories().forEach((host) => {  addOrUpdateHostStatus(host.id, "offline"); })
        getServiceRegistries().forEach((host) => { addOrUpdateHostStatus(host.id, "offline"); })
    }, []);

    useEffect(() => {
        allHostStatus.forEach((host, index) => {
            if(!isBeingActivelyPinged(host.id)){
                pingOnInterval(host, getPingFunction(host.type), 5000);
            }
        })
    }, [isBeingActivelyPinged, allHostStatus]);

    

    

    

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
                getHostStatus = {getHostStatus}
                removeHostHandler = {removeHostHandler}
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
