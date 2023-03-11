import './Visualizations.scss';
import {useState, useEffect} from 'react';
import Tabs from '../Tabs/Tabs';
import BPMNVisualizer from './BPMNVisualizer/BPMNVisualizer';
import HistogramVisualizer from './HistogramVisualizer/HistogramVisualizer';
import PNMLVisualizer from './PNMLVisualizer/PNMLVisualizer';

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
                    tablist = {[{title: 'BPMN'}, {title: 'Histogram'}, {title: 'PNML'}]}
                />
            </div>
            <div className='Visualizations-VisualizerContainer'>
                {(selectedTab === 0 && file.FileExtension.toUpperCase() === "BPMN") && <BPMNVisualizer file = {file}/>}
                {(selectedTab === 1 && file.FileExtension.toUpperCase() === "XES") && <HistogramVisualizer file = {file}/>}
                {(selectedTab === 2 && file.FileExtension.toUpperCase() === "PNML") && <PNMLVisualizer file = {file}/>}
            </div>
        </div>
    );
}

export default Visualizations;
