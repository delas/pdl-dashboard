import './SidebarHosts.scss';
import Button from '../Button/Button';
import {useState, useEffect} from 'react';
import { FaRegWindowClose } from 'react-icons/fa';
// import SidebarHostsFile from '../SidebarHostsFiles/SidebarHostsFile';

function SidebarHosts(props) {
    const [isLoading, setIsLoading] = useState(true);

    const hosts = [
        {
            name: "http://test.com",
            status: "online",
            type: "repository"
        },
        {
            name: "http://test.com",
            status: "online",
            type: "miner",
        }
    ]

    const miners = hosts.filter((host) => host.type === "miner");
    const repositories = hosts.filter((host) => host.type === "repository");

    useEffect(() => {
        setIsLoading(false);
    });

    if(isLoading){
        return (
            <div className="SidebarHosts">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className="SidebarHosts">

            <div className='SidebarHosts-Top'>
                <div className='SidebarHosts-title'>
                    <h1>Host configuration</h1>
                </div>
                <div className='SidebarHosts-closeButton'>
                    <FaRegWindowClose/>
                </div>
            </div>

            <div className='SidebarHosts-repository'>

            </div>

            <div className='SidebarHosts-miner'>
                
            </div>

            <div className='SidebarHosts-serviceRegistry'>
                
            </div>
        </div>
    );
}

export default SidebarHosts;
