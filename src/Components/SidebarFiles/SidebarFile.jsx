import './SidebarFile.scss';
// import Button from '../Button/Button';
import {useState, useEffect} from 'react';
import { FaTrash } from 'react-icons/fa';

function SidebarFile(props) {

    const {
        filename,
        filetype
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
                    <div className='SidebarFile-filename'>
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
