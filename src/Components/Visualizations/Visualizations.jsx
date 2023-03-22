import './Visualizations.scss';
import {useState, useEffect} from 'react';
import Tabs from '../Tabs/Tabs';
import BPMNVisualizer from './BPMNVisualizer/BPMNVisualizer';
import HistogramVisualizer from './HistogramVisualizer/HistogramVisualizer';
import PNMLVisualizer from './PNMLVisualizer/PNMLVisualizer';
import ResourceGraph from './ResourceGraph/ResourceGraph';

function Visualizations(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        setIsLoading(false);
    }, []);

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
                    tablist = {[{title: 'BPMN'}, {title: 'Histogram'}, {title: 'PNML'}, {title: 'Resource Graph'}]}
                />
            </div>
            <div className='Visualizations-VisualizerContainer'>
                {(selectedTab === 0 && file.FileInfo.FileExtension.toUpperCase() === "BPMN") && <BPMNVisualizer file = {file}/>}
                {(selectedTab === 1 && file.FileInfo.FileExtension.toUpperCase() === "XES") && <HistogramVisualizer file = {file}/>}
                {(selectedTab === 2 && file.FileInfo.FileExtension.toUpperCase() === "PNML") && <PNMLVisualizer file = {file}/>}
                {(selectedTab === 3 && file.FileInfo.FileExtension.toUpperCase() === "PNML") && <ResourceGraph file = {file}/>}
            </div>
        </div>
    );
}

export default Visualizations;
