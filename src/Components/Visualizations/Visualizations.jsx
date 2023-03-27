import './Visualizations.scss';
import {useState, useEffect, useCallback} from 'react';
import Tabs from '../Widgets/Tabs/Tabs';
import BPMNVisualizer from './BPMNVisualizer/BPMNVisualizer';
import HistogramVisualizer from './HistogramVisualizer/HistogramVisualizer';
import PNMLVisualizer from './PNMLVisualizer/PNMLVisualizer';
import ResourceGraph from './ResourceGraph/ResourceGraph';
import ImageVisualizer from './ImageVisualizer/ImageVisualizer';
import { getFileExtension } from '../../Utils/FileUnpackHelper';
import LoadingSpinner from '../Widgets/LoadingSpinner/LoadingSpinner';
import {config} from '../../config';

function Visualizations(props) {
    const {
        file,
        setComponentUpdaterFunction,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(null);
    const [tabList, setTabList] = useState([]);
    const [fileExtension, setFileExtension] = useState(getFileExtension(file).toUpperCase());
    const [fileToDisplay, setFileToDisplay] = useState(file);
    
    const [, updateState] = useState();
    const forceUpdate = useCallback(() =>{ updateState({}); setFileToDisplay(file); }, []);

    useEffect(() => {
        setComponentUpdaterFunction("Visualizations", {update: forceUpdate})
        setFileToDisplay(file);
        setIsLoading(false);
        setTabList(generateTabList(file));
    }, [file]);

    const onTabChange = (tab) => {
        setSelectedTab(tab);
    }

    const generateTabList = (file) => {
        if(file) return config[getFileExtension(file).toUpperCase()].Visualizations.map((visualization) => {
            return visualization;
        });
    }

    if(isLoading){
        return (
            <div className="Visualizations-loader">
                <div className='Spinner-container'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
            </div>
        )
    }

    return (
        <div className="Visualizations">
            <div className='Visualizations-tabsContainer'>
                <Tabs
                    onTabChange = {onTabChange}
                    selectedTab = {selectedTab}
                    tablist = {tabList}
                />
            </div>
            {selectedTab &&
                <div className='Visualizations-VisualizerContainer'>
                    {(selectedTab.ResourceType === "BPMN") && <BPMNVisualizer file = {fileToDisplay}/>}
                    {(selectedTab.ResourceType === "HISTOGRAM") && <HistogramVisualizer file = {fileToDisplay}/>}
                    {(selectedTab.ResourceType === "PNML") && <PNMLVisualizer file = {fileToDisplay}/>}
                    {(selectedTab.ResourceType === "DOT") && <ResourceGraph file = {fileToDisplay}/>}
                    {(selectedTab.ResourceType === "PNG" || selectedTab.ResourceType === "JPG" || fileExtension.ResourceType === "SVG") && <ImageVisualizer file = {fileToDisplay}/>}
                </div>
            }
        </div>
    );
}

export default Visualizations;
