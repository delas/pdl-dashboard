import './Visualizations.scss';
import {useState, useEffect, useCallback} from 'react';
import Tabs from '../Tabs/Tabs';
import BPMNVisualizer from './BPMNVisualizer/BPMNVisualizer';
import HistogramVisualizer from './HistogramVisualizer/HistogramVisualizer';
import PNMLVisualizer from './PNMLVisualizer/PNMLVisualizer';
import ResourceGraph from './ResourceGraph/ResourceGraph';
import ImageVisualizer from './ImageVisualizer/ImageVisualizer';
import { getFileExtension } from '../../Utils/FileUnpackHelper';

function Visualizations(props) {
    const {
        file,
        setComponentUpdaterFunction,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [fileExtension, setFileExtension] = useState(getFileExtension(file).toUpperCase());
    const [fileToDisplay, setFileToDisplay] = useState(file);
    
    const [, updateState] = useState();
    const forceUpdate = useCallback(() =>{ updateState({}); setFileToDisplay(file); }, []);

    useEffect(() => {
        setComponentUpdaterFunction("Visualizations", {update: forceUpdate})
        setFileToDisplay(file);
        setIsLoading(false);
    }, [file]);

    const onTabChange = (tabIndex) => {
        setSelectedTab(tabIndex);
    }

    console.log("rerender visualizations");
    console.log(fileToDisplay);

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
                {(selectedTab === 0 && fileExtension === "BPMN") && <BPMNVisualizer file = {fileToDisplay}/>}
                {(selectedTab === 1 && fileExtension === "XES") && <HistogramVisualizer file = {fileToDisplay}/>}
                {(selectedTab === 2 && fileExtension === "PNML") && <PNMLVisualizer file = {fileToDisplay}/>}
                {(selectedTab === 3 && fileExtension) && <ResourceGraph file = {fileToDisplay}/>}
                {(selectedTab === 4 && (fileExtension === "PNG" || fileExtension === "JPG" ||  fileExtension === "SVG")) && <ImageVisualizer file = {fileToDisplay}/>}
            </div>
        </div>
    );
}

export default Visualizations;
