import './Sidebar.scss';
import Button from '../Button/Button';
import {useState, useEffect} from 'react';
import { FaCircle, FaCog, FaFileUpload, FaBuffer } from 'react-icons/fa';
import SidebarFile from '../SidebarFiles/SidebarFile';

function Sidebar(props) {

    const {
        toggleFilePopupOpen,
        toggleActionPopupOpen,
        toggleNewHostPopupOpen
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    const files = [
        {
            filename: "file 1",
            filetype: "xes",
        },
        {
            filename: "file 2",
            filetype: "png",
        }
    ]

    useEffect(() => {
        setIsLoading(false);
    });

    if(isLoading){
        return (
            <div className="Sidebar">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className={`Sidebar`}>
            <div className='Sidebar-flexContainer'>
                <div className='Sidebar-flexContainer-top'>
                    <div className='Sidebar-flexContainer-buttons'>
                        <Button
                            text = {`Upload file`}
                            icon = {<FaFileUpload/>}
                            disabled = {false}
                            className = {``}
                            onClick = {toggleFilePopupOpen}
                        />
                        <Button
                            text = {`Execute action`}
                            icon = {<FaCog/>}
                            disabled = {false}
                            className = {``}
                            onClick = {toggleActionPopupOpen}
                        />
                        <Button
                            text = {`Add new host`}
                            icon = {<FaBuffer/>}
                            disabled = {false}
                            className={``}
                            onClick = {toggleNewHostPopupOpen}
                        />
                    </div>
                    <div className='Sidebar-flexContainer-files'>
                        {
                            files.map((file, index) => {
                                return(
                                    <SidebarFile key={index}
                                        filename = {file.filename}
                                        filetype = {file.filetype}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
                <div className='Sidebar-flexContainer-actions'>

                </div>
                <div className='Sidebar-flexContainer-status'>
                    <div className='Sidebar-status'>
                        <div className='Sidebar-status-icon'>
                            <FaCircle/>
                        </div>
                        <div className='Sidebar-status-text'>
                            All systems online
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
