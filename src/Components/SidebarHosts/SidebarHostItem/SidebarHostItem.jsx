import './SidebarHostItem.scss';
// import Button from '../Button/Button';
import {useState, useEffect} from 'react';
import { FaTrash, FaServer, FaCogs, FaNetworkWired, FaQuestion } from 'react-icons/fa';

function SidebarHostItem(props) {

    const {
        hostName,
        hostType,
        addedFrom = 'locally', // values: ["locally", "http://...", "https://..."]
        status = "offline", //Values: ["offline", "online", "loading"]
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [icon, setIcon] = useState(null);

    useEffect(() => {
        setIsLoading(false);
    });

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

                <div className='SidebarHostItem-delete'>
                    <FaTrash/>
                </div>

            </div>
        </div>
    );
}

export default SidebarHostItem;
