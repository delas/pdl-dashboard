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
        openPopup,
        popups,
        status,
        allowClick = true,
    } = props;

    const [icon, setIcon] = useState(null);

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
            case 'repository': openPopup(popups.GetFilePopupOpen, {repository: {label: hostName, value: id}}); break;
            case 'service registry': openPopup(popups.NewSRHostPopup, {serviceRegistry: {label: hostName, value: id}});break;
            default: break;
        }
    }

    useEffect(() => {
        setIconForItem();
    }, []);

    return (
        <div className="SidebarHostItem">
            <div className='SidebarHostItem-flexContainer'>

                <div className='SidebarHostItem-flexContainer-left'>
                    <div className='SidebarHostItem-flexContainer-topleft'>
                        <div className={`SidebarHostItem-filetype SidebarHostItem-filetype-${status}`}>
                            {icon}
                        </div>
                        <div className='SidebarHostItem-filename' onClick={allowClick ? openPopupHandler : undefined}>
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
