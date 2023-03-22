import './Visualizations.scss';
import {useState, useEffect} from 'react';
import Tabs from '../Tabs/Tabs';
import BPMNVisualizer from './BPMNVisualizer/BPMNVisualizer';
import HistogramVisualizer from './HistogramVisualizer/HistogramVisualizer';
import PNMLVisualizer from './PNMLVisualizer/PNMLVisualizer';
import ResourceGraph from './ResourceGraph/ResourceGraph';
import ImageVisualizer from './ImageVisualizer/ImageVisualizer';

function Visualizations(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [fileExtension, setFileExtension] = useState(file.FileInfo.FileExtension.toUpperCase());

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
                    tablist = {[{title: 'BPMN'}, {title: 'Histogram'}, {title: 'PNML'}, {title: 'Resource Graph'}, {title: 'Image'}]}
                />
            </div>
            <div className='Visualizations-VisualizerContainer'>
                {(selectedTab === 0 && fileExtension === "BPMN") && <BPMNVisualizer file = {file}/>}
                {(selectedTab === 1 && fileExtension === "XES") && <HistogramVisualizer file = {file}/>}
                {(selectedTab === 2 && fileExtension === "PNML") && <PNMLVisualizer file = {file}/>}
                {(selectedTab === 3 && fileExtension === "DOT") && <ResourceGraph file = {file}/>}
                {(selectedTab === 4 && (fileExtension === "PNG" || fileExtension === "JPG" ||  fileExtension === "SVG")) && <ImageVisualizer file = {file}/>}
            </div>
        </div>
    );
}

export default Visualizations;
