import './SidebarHostItem.scss';
// import Button from '../Button/Button';
import {useState, useEffect} from 'react';
import { FaTrash, FaServer, FaCogs, FaNetworkWired, FaQuestion } from 'react-icons/fa';
// import {PingServiceRegistry} from '../../../Services/ServiceRegistryServices';

function SidebarHostItem(props) {

    const {
        id,
        hostName,
        hostType,
        addedFrom = 'locally', // values: ["locally", "http://...", "https://..."]
        onRemove,
        ping,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [icon, setIcon] = useState(null);
    const [status, setStatus] = useState('offline');
    const [isPingActive, setIsPingActive] = useState(false);

    const getStatus = (res) => {
        return res.status === 200 && res.data.toUpperCase() === "PONG";
    }

    useEffect(() => {
        setStatus("loading");
        ping(hostName).then((res) => {
            setStatus(getStatus(res) ? "online" : "offline");
        }).then(() => {
            setIsLoading(false);
        }).catch((e) => {
            console.log(e);
            setStatus('offline');
        })

        if(!isPingActive) pingOnInterval(5000);
    }, []);

    const pingOnInterval = async (timeBetweenTicks) => {
        setIsPingActive(true);
        setInterval(() => {
            ping(hostName).then((res) => {
                setStatus(getStatus(res) ? "online" : "offline");
            }).catch((e) => {
                console.log(e);
                setStatus('offline');
            })
        }, timeBetweenTicks);
    }

    

    const setIconForItem = () => {
        switch(hostType){
            case 'miner': setIcon(<FaCogs/>); break;
            case 'repository': setIcon(<FaServer/>); break;
            case 'service registry': setIcon(<FaNetworkWired/>); break;
            default: setIcon(<FaQuestion/>);
        }
    }

    useEffect(() => {
        setIconForItem();
    }, []);

    if(isLoading){
        return (
            <div className="SidebarHostItem">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className="SidebarHostItem">
            <div className='SidebarHostItem-flexContainer'>

                <div className='SidebarHostItem-flexContainer-left'>
                    <div className='SidebarHostItem-flexContainer-topleft'>
                        <div className={`SidebarHostItem-filetype SidebarHostItem-filetype-${status}`}>
                            {icon}
                        </div>
                        <div className='SidebarHostItem-filename'>
                            {hostName}
                        </div>
                    </div>

                    <div className='SidebarHostItem-flexContainer-bottomleft'>
                        <div className='SidebarHostItem-addedFrom'>
                            {addedFrom}
                        </div>
                    </div>
                </div>

                <div className='SidebarHostItem-delete' onClick = {() => {onRemove(id)}}>
                    <FaTrash/>
                </div>

            </div>
        </div>
    );
}

export default SidebarHostItem;
