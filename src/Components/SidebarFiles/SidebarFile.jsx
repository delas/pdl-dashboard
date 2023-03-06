import './SidebarFile.scss';
import {useState, useEffect} from 'react';
import { FaTrash } from 'react-icons/fa';

function SidebarFile(props) {

    const {
        filename,
        filetype,
        openPopup,
        popups,
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    });

    if(isLoading){
        return (
            <div className="SidebarFile">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className="SidebarFile">
            <div className='SidebarFile-flexContainer'>
                <div className='SidebarFile-flexContainer-left'>
                    <div className='SidebarFile-filetype'>
                        {filetype}
                    </div>
                    <div className='SidebarFile-filename' 
                        // onClick = {() => { openPopup(popups.AddNewHostPopup, {repository: {}}) }}
                    >
                        {filename}
                    </div>
                </div>
                <div className='SidebarFile-delete'>
                    <FaTrash/>
                </div>
            </div>
        </div>
    );
}

export default SidebarFile;
