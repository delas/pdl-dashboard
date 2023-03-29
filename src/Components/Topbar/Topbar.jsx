import './Topbar.scss';
import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import Logo from '../../Assets/logo';
import dtuImg from '../../Assets/dtu.png';
import Button from '../Widgets/Button/Button';
import {FaAngleRight, FaAngleLeft} from 'react-icons/fa';

function Topbar(props) {
    const {
        toggleSidebar,
        toggleSidebarHosts,
        sidebarOpen,
        sidebarHostsOpen
    } = props;

  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    });

    if(isLoading){
        return (
            <div className="Topbar">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className="Topbar">
            <div className='Topbar-flexContainer'>
                <div className='Topbar-flexContainer-left'>
                    <div className='Images'>
                    
                        <div className='Topbar-logo Logo'>
                            <Link className='Topbar-Logo-link' to="/">
                                <Logo/>
                            </Link>
                        </div>
                        
                        <div className='Topbar-logo DtuLogo'> 
                            <img src={dtuImg} alt=" dtu logo"/>
                        </div>
                    </div>
                    
                    <div className='Topbar-title'>Process dry lab</div>
                    
                </div>
                
                <div className='Topbar-flexContainer-right'>
                    <div className='Topbar-button-container'>

                        <Button
                            text = {`Configure hosts`}
                            icon = {sidebarHostsOpen ? <FaAngleLeft/> : <FaAngleRight/>}
                            disabled = {false}
                            className = {``}
                            onClick = {toggleSidebarHosts}
                            theme = {"primary"}
                        />

                        <Button
                            text = {`Open sidebar`}
                            icon = {sidebarOpen ? <FaAngleLeft/> : <FaAngleRight/>}
                            disabled = {false}
                            className = {``}
                            onClick = {toggleSidebar}
                            theme = {"primary"}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Topbar;
