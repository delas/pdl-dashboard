import './Tabs.scss';
import {useState, useEffect} from 'react';

function Tabs(props) {
    const {
        selectedTab = null,
        onTabChange = () => {},
        tablist = []
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if(isLoading){
        return (
            <div className="Tabs">
                <div>Loading ...</div>
            </div>
        )
    }
    
    return (
        <div className="Tabs">
            <div className='Tabs-flexContainer'>
                {tablist.map((tab, index) => {
                    return (
                        <div className={`Tab Tab-selected-${selectedTab.Title === tab.Title}`} 
                            onClick={() => {onTabChange(tab)}} key = {index}>
                            <span className='Tab-text'>{tab.Title}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Tabs;
