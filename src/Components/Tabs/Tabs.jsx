import './Tabs.scss';
import {useState, useEffect} from 'react';

function Tabs(props) {
    const {
        selectedTab = 1,
        onTabChange = () => {},
        tablist = []
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    });

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
                        <div className={`Tab Tab-selected-${selectedTab === index}`} 
                            onClick={() => {onTabChange(index)}} key = {index}>
                            <span className='Tab-text'>{tab.title}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Tabs;
