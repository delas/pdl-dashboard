import './SidebarHostItem.scss';
import {useState, useEffect} from 'react';
import { FaTrash, FaServer, FaCogs, FaNetworkWired, FaQuestion } from 'react-icons/fa';

function SidebarHostItem(props) {

    const {
        id,
        hostName,
        hostType,
        addedFrom = 'locally', // values: ["locally", "http://...", "https://..."]
        onRemove,
        ping = null,
        openPopup,
        popups,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [icon, setIcon] = useState(null);
    const [status, setStatus] = useState('offline');
    const [isPingActive, setIsPingActive] = useState(false);

    const getStatus = (res) => {
        return res.status === 200 && res.data.toUpperCase() === "PONG";
    }

    useEffect(() => {
        if(ping !== null){
            setStatus("loading");
            ping(hostName).then((res) => {
                setStatus(getStatus(res) ? "online" : "offline");
            }).then(() => {
                setIsLoading(false);
            }).catch((e) => {
                setStatus('offline');
                setIsLoading(false);
            })

            if(!isPingActive) pingOnInterval(5000);
        } else {
            setIsLoading(false);
        }
    }, []);

    const pingOnInterval = async (timeBetweenTicks) => {
        setIsPingActive(true);
        setInterval(() => {
            ping(hostName).then((res) => {
                setStatus(getStatus(res) ? "online" : "offline");
            }).catch((e) => {
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

    const openPopupHandler = () => {
        switch(hostType){
            case 'miner': openPopup(popups.ActionPopup, {miner: {label: hostName, value: id}}); break;
            case 'repository': openPopup(popups.AddFilePopup, {repository: {label: hostName, value: id}}); break;
            case 'service registry': openPopup(popups.NewSRHostPopup, {serviceRegistry: {label: hostName, value: id}});break;
            default: break;
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
                        <div className='SidebarHostItem-filename' onClick = {() => {openPopupHandler()}}>
                            {hostName}
                        </div>
                    </div>

                    <div className='SidebarHostItem-flexContainer-bottomleft'>
                        <div className='SidebarHostItem-addedFrom'>
                            <b>Added from:</b> {addedFrom}
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
