import './Visualizations.scss';
import {useState, useEffect, useCallback} from 'react';
import Tabs from '../Widgets/Tabs/Tabs';
import BPMNVisualizer from './BPMNVisualizer/BPMNVisualizer';
import HistogramVisualizer from './HistogramVisualizer/HistogramVisualizer';
import PNMLVisualizer from './PNMLVisualizer/PNMLVisualizer';
import ResourceGraph from './ResourceGraph/ResourceGraph';
import ImageVisualizer from './ImageVisualizer/ImageVisualizer';
import { getFileDescription, getFileExtension, getFileResourceLabel, getFileResourceType } from '../../Utils/FileUnpackHelper';
import LoadingSpinner from '../Widgets/LoadingSpinner/LoadingSpinner';
import {config, getVisalizations} from '../../config';

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
        if(file) return getVisalizations(getFileResourceType(file).toUpperCase(), getFileExtension(file).toUpperCase());       
    }

    if(isLoading){
        return (
            <div className="Visualizations-loader">
                <div className='Spinner-container-l'>
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
            <div className='Visualizations-header'>
                <b>{`${getFileResourceLabel(file)}:`}</b>{`${getFileDescription(file)}`}
            </div>
            {selectedTab &&
                <div className='Visualizations-VisualizerContainer'>
                    {(selectedTab.ResourceType === "BPMN")      && <BPMNVisualizer file = {fileToDisplay}/>}
                    {(selectedTab.ResourceType === "HISTOGRAM") && <HistogramVisualizer file = {fileToDisplay}/>}
                    {(selectedTab.ResourceType === "PNML")      && <PNMLVisualizer file = {fileToDisplay}/>}
                    {(selectedTab.ResourceType === "DOT")       && <ResourceGraph file = {fileToDisplay}/>}
                    {(selectedTab.ResourceType === "IMAGE")     && <ImageVisualizer file = {fileToDisplay}/>}
                </div>
            }
        </div>
    );
}

export default Visualizations;
