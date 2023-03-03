import './App.css';
import {useState, useEffect} from 'react';
import Home from './Pages/Home/Home';
import AddFilePopup from './Components/Popup/AddfilePopup/AddfilePopup';
import Page1 from './Pages/Page1/Page1';
import Page2 from './Pages/Page2/Page2';

function App(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarHostsOpen, setSidebarHostsOpen] = useState(true);
    const [filePopupOpen, setFilePopupOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    const toggleSidebarHosts = () => {
        setSidebarHostsOpen(!sidebarHostsOpen);
    }

    const toggleFilePopupOpen = () => {
        setFilePopupOpen(!filePopupOpen);
    }

    useEffect(() => {
        setIsLoading(false);
    });

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
                // sidebarOpen = {sidebarOpen}
                // sidebarHostsOpen = {sidebarHostsOpen}
                // filePopupOpen = {filePopupOpen}
                toggles = {{
                    toggleSidebar: toggleSidebar,
                    toggleSidebarHosts: toggleSidebarHosts,
                    toggleFilePopupOpen: toggleFilePopupOpen,
                }}
                isOpen = {{
                    sidebarOpen: sidebarOpen,
                    sidebarHostsOpen: sidebarHostsOpen,
                    filePopupOpen: filePopupOpen,
                }}
                // toggleSidebarHosts = {toggleSidebarHosts}
                // toggleFilePopupOpen = {toggleFilePopupOpen}
            /> : null}
            {props.page === "Page1" ? <Page1/> : null}
            {props.page === "Page2" ? <Page2/> : null}
        </div>
    );
}

export default App;
