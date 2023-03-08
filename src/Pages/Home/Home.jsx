import './Home.scss';
import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import Topbar from '../../Components/Topbar/Topbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import SidebarHosts from '../../Components/SidebarHosts/SidebarHosts';
import AddFilePopup from '../../Components/Popup/AddfilePopup/AddfilePopup';
import ActionPopup from '../../Components/Popup/ActionPopup/ActionPopup';
import AddNewHostPopup from '../../Components/Popup/AddNewHostPopup/AddNewHostPopup';
import AddNewHostFromServiceRegistryPopup from '../../Components/Popup/AddNewHostFromServiceRegistryPopup/AddNewHostFromServiceRegistryPopup';

function Home(props) {

    const {
        toggles,
        isOpen,
        set,
        getHostStatus,
        removeHostHandler,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [popupProps, setPopupProps] = useState({});

    const popups = {
        AddNewHostPopup: 'AddNewHostPopup',
        AddFilePopup: 'AddFilePopup',
        ActionPopup: 'ActionPopup',
        NewSRHostPopup: 'NewSRHostPopup',
    }
    
    const openPopup = (popup, props = {}) => {
        console.log(popup)
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
            default: (() => {})(); break; // Do nothing. Produces empty lambda expression call
        }
    }

    useEffect(() => {
        setIsLoading(false);
    });

    if(isLoading){
        return (
            <div className="Home">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className="Home">
            <div className='Home-PageLayout'>
                <div className='Home-Topbar'>
                    <Topbar
                        toggleSidebar = {toggles.toggleSidebar}
                        toggleSidebarHosts = {toggles.toggleSidebarHosts}
                    />
                </div>
                <div className={`Home-Page-below-topbar`}>
                    <div className={`Home-Sidebar Home-Sidebar${isOpen.sidebarOpen ? "-sidebaropen" : "-sidebarclosed"}`}>
                        <Sidebar
                            openPopup = {openPopup}
                            popups = {popups}
                        />
                    </div>

                    <div className={`Home-Content Home-Content${isOpen.sidebarOpen ? "-sidebaropen" : "-sidebarclosed"}`}>
                        <Link to="/Page1">
                            <div>Hello world from home page</div>
                        </Link>    
                    </div>
                </div>

                <div className={`Home-SidebarHosts Home-SidebarHosts${isOpen.sidebarHostsOpen ? "-sidebarHostsopen" : "-sidebarHostsclosed"}`}>
                    <SidebarHosts
                        toggleSidebarHosts = {toggles.toggleSidebarHosts}
                        openPopup = {openPopup}
                        popups = {popups}
                        getHostStatus = {getHostStatus}
                        removeHostHandler = {removeHostHandler}
                    />
                </div>

                {isOpen.filePopupOpen ?
                    <AddFilePopup
                        toggleFilePopupOpen = {toggles.toggleFilePopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                    />
                    : null
                }

                {isOpen.actionPopupOpen ?
                    <ActionPopup
                        toggleActionPopupOpen = {toggles.toggleActionPopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                    />
                    : null
                }

                {isOpen.newHostPopupOpen ? 
                    <AddNewHostPopup
                        toggleNewHostPopupOpen = {toggles.toggleNewHostPopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                    />
                    : null
                }

                {isOpen.newHostFromSROpen ? 
                    <AddNewHostFromServiceRegistryPopup
                        togglenewHostFromSRPopupOpen = {toggles.togglenewHostFromSRPopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                    />
                    : null
                }
            
            </div>
        </div>
    );
}

export default Home;
