import './Home.scss';
import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import Topbar from '../../Components/Topbar/Topbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import SidebarHosts from '../../Components/SidebarHosts/SidebarHosts';
import AddFilePopup from '../../Components/Popup/AddfilePopup/AddfilePopup';

function Home(props) {

    const {
        toggles,
        isOpen,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    

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
                            toggleFilePopupOpen = {toggles.toggleFilePopupOpen}
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
                    />
                </div>

                {isOpen.filePopupOpen ?
                    <AddFilePopup
                        toggleFilePopupOpen = {toggles.toggleFilePopupOpen}
                    />
                    : null
                }
            
            </div>
        </div>
    );
}

export default Home;
