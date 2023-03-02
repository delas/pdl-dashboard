import './Home.scss';
import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import Topbar from '../../Components/Topbar/Topbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import SidebarHosts from '../../Components/SidebarHosts/SidebarHosts';

function Home(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarHostsOpen, setSidebarHostsOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    const toggleSidebarHosts = () => {
        setSidebarHostsOpen(!sidebarHostsOpen);
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
                        toggleSidebar = {toggleSidebar}
                        toggleSidebarHosts = {toggleSidebarHosts}
                    />
                </div>
                <div className={`Home-Page-below-topbar`}>
                    <div className={`Home-Sidebar Home-Sidebar${sidebarOpen ? "-sidebaropen" : "-sidebarclosed"}`}>
                        <Sidebar/>
                    </div>

                    <div className={`Home-Content Home-Content${sidebarOpen ? "-sidebaropen" : "-sidebarclosed"}`}>
                        <Link to="/Page1">
                            <div>Hello world from home page</div>
                        </Link>    
                    </div>
                </div>

                <div className={`Home-SidebarHosts Home-SidebarHosts${sidebarHostsOpen ? "-sidebarHostsopen" : "-sidebarHostsclosed"}`}>
                    <SidebarHosts/>
                </div>
            
            
            </div>
        </div>
    );
}

export default Home;
