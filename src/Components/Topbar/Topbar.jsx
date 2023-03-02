import './Topbar.scss';
import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import Logo from '../../Assets/logo';
import dtuImg from '../../Assets/dtu.png';

function Topbar(props) {
    const {
        toggleSidebar,
        toggleSidebarHosts
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
                            <Link className='Topbar-Logo-link' to="/Page1">
                                <Logo/>
                            </Link>
                        </div>
                        
                        <div className='Topbar-logo DtuLogo'> 
                            <img src={dtuImg} alt=" dtu logo"/>
                        </div>
                    </div>
                    
                    <div className='Topbar-title' onClick ={() => {toggleSidebarHosts()}}>Process dry lab</div>
                    
                </div>
                <div className='Topbar-flexContainer-center'>

                </div>
                <div className='Topbar-flexContainer-right'>
                    <div className='Topbar-configure-hosts'>
                        <span onClick = {() => {toggleSidebar()}}>Configure hosts</span>
                    </div>
                </div>

                
                

            </div>
        </div>
    );
}

export default Topbar;
