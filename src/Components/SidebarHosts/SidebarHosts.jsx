import './SidebarHosts.scss';
import Button from '../Button/Button';
import {useState, useEffect} from 'react';
import { FaRegWindowClose } from 'react-icons/fa';
import SidebarHostItem from './SidebarHostItem/SidebarHostItem';
// import SidebarHostsFile from '../SidebarHostsFiles/SidebarHostsFile';

function SidebarHosts(props) {

    const {
        toggleSidebarHosts
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    const hosts = [
        {
            name: "http://test.com",
            status: "online",
            type: "repository",
            addedFrom: 'http://serviceregistry1.com.net.org.com.java.lang.com',
        },
        {
            name: "http://test.com",
            status: "online",
            type: "miner",
            addedFrom: 'http://serviceregistry1.com.net.org.com.java.lang.com',
        },
        {
            name: "'http://serviceregistry1.com.net.org.com.java.lang.com'",
            status: "online",
            type: "service registry",
            addedFrom: 'locally',
        }
    ]

    const miners = hosts.filter((host) => host.type === "miner");
    const repositories = hosts.filter((host) => host.type === "repository");
    const serviceRegistries = hosts.filter((host) => host.type === "service registry");

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

            <header className='SidebarHosts-Top'>
                <strong className='SidebarHosts-title'>
                    <h1>Host configuration</h1>
                </strong>
                <div className='SidebarHosts-closeButton'>
                    <FaRegWindowClose onClick = {() => {toggleSidebarHosts()}}/>
                </div>
            </header>
            <div className='SidebarHosts-body'>
                <div className='SidebarHosts-section SidebarHosts-repository'>
                    <h5>Repositories</h5>
                    {repositories.map((repository, index) => {
                        return<SidebarHostItem key = {index}
                            hostName = {repository.name}
                            hostType = {repository.type}
                            addedFrom = {repository.addedFrom}
                            status = {repository.status}
                        />
                    })}
                    
                </div>

                <div className='SidebarHosts-section SidebarHosts-miner'>
                    <h5>Miners</h5>

                    {miners.map((miner, index) => {
                        return <SidebarHostItem key = {index}
                            hostName = {miner.name}
                            hostType = {miner.type}
                            addedFrom = {miner.addedFrom}
                            status = {miner.status}
                        />
                    })}
                </div>

                <div className='SidebarHosts-section SidebarHosts-serviceRegistry'>
                    <h5>Service Registries</h5>

                    {serviceRegistries.map((serviceRegistry, index) => {
                        return <SidebarHostItem key = {index}
                            hostName = {serviceRegistry.name}
                            hostType = {serviceRegistry.type}
                            addedFrom = {serviceRegistry.addedFrom}
                            status = {serviceRegistry.status}
                        />
                    })}
                </div>
            </div>
        </div>
    );
}

export default SidebarHosts;
