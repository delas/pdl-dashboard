import './Visualizations.scss';
import {useState, useEffect} from 'react';
import Tabs from '../Tabs/Tabs';
import BPMNVisualizer from './BPMNVisualizer/BPMNVisualizer';
import HistogramVisualizer from './HistogramVisualizer/HistogramVisualizer';

function Visualizations(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        setIsLoading(false);
    });

    const onTabChange = (tabIndex) => {
        setSelectedTab(tabIndex);
    }

    if(isLoading){
        return (
            <div className="Visualizations">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className="Visualizations">
            <div className='Visualizations-tabsContainer'>
                <Tabs
                    onTabChange = {onTabChange}
                    selectedTab = {selectedTab}
                    tablist = {[{title: 'tab1'}, {title: 'tab2'}]}
                />
            </div>
            <div className='Visualizations-VisualizerContainer'>
                {(selectedTab === 0) && <BPMNVisualizer file = {file}/>}
                {(selectedTab === 1) && <HistogramVisualizer file = {file}/>}
            </div>
        </div>
    );
}

export default Visualizations;
