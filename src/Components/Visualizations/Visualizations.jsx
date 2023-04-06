import './Visualizations.scss';
import {useState, useEffect, useCallback} from 'react';
import Tabs from '../Widgets/Tabs/Tabs';
import BPMNVisualizer from './BPMNVisualizer/BPMNVisualizer';
import HistogramVisualizer from './HistogramVisualizer/HistogramVisualizer';
import PNMLVisualizer from './PNMLVisualizer/PNMLVisualizer';
import ResourceGraph from './ResourceGraph/ResourceGraph';
import ImageVisualizer from './ImageVisualizer/ImageVisualizer';
import { getFileDescription, getFileExtension, getFileHost, getFileResourceLabel, getFileResourceType, getFileResourceId, getFileContent } from '../../Utils/FileUnpackHelper';
import LoadingSpinner from '../Widgets/LoadingSpinner/LoadingSpinner';
import {config, getVisalizations} from '../../config';
import Dropdown from '../Widgets/Dropdown/Dropdown';
import {getChildrenFromFile} from '../../Services/RepositoryServices';

function Visualizations(props) {
    const {
        file,
        setComponentUpdaterFunction,
        getAndAddFile,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(null);
    const [tabList, setTabList] = useState([]);
    const [fileToDisplay, setFileToDisplay] = useState(file);
    const [children, setChildren] = useState([]);
    const [childrenForDropdown, setChildrenForDropdown] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [hasCalledChildren, setHasCalledChildren] = useState(null);
    
    const [, updateState] = useState();
    const forceUpdate = useCallback(() =>{ updateState({}); }, []);

    useEffect(() => {
        setComponentUpdaterFunction("Visualizations", {update: forceUpdate})
        setFileToDisplay(file);
        setIsLoading(false);
        setTabList(generateTabList(file));
        setSelectedChild(null);
        if(getFileResourceId(file) !== getFileResourceId(fileToDisplay)) setSelectedTab(null);

        if(hasCalledChildren !== getFileResourceId(file)){
        getChildrenFromFile(getFileHost(file), getFileResourceId(file))
            .then((res) => {setChildren(res.data); generateChildren(res.data)} )
            .then(() => {setHasCalledChildren(getFileResourceId(file))})
            .catch((err) => {console.log(err)} );
        }
    }, [file]);

    const onTabChange = (tab) => {
        setSelectedTab(tab);
    }

    const generateTabList = (file) => {
        if(file) return getVisalizations(getFileResourceType(file).toUpperCase(), getFileExtension(file).toUpperCase()); 
    }

    const generateChildren = (children) => {
        if(children);
        setChildrenForDropdown(
            children.map((childMetadata) => {
                const isVisualizable = !!getVisalizations(getFileResourceType(childMetadata).toUpperCase(), getFileExtension(childMetadata).toUpperCase());
                if(isVisualizable)
                return ({label: getFileResourceLabel(childMetadata), value: getFileResourceId(childMetadata)})
                })
                .filter((child) => { if(child) return child })
        );
    }

    const onChildDropdownChange = (value) => {
        setSelectedChild(value);
    }

    const onDropdownButtonClick = () => {
        if(selectedChild){
            const child = children.find((child) => getFileResourceId(child) === selectedChild.value);
            getAndAddFile(child);
        }
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

    if(!fileToDisplay){
        return <div></div>
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
                <b>{`${getFileResourceLabel(file)}:`}</b>{` ${getFileDescription(file)}`}
            </div>
            <div className='Visualizations-children-dropdown-container'>
                <button className={`Visualizations-children-button Visualizations-children-button${selectedChild ? `-disabled-false` : `-disabled-true`}`}  
                        onClick = {onDropdownButtonClick} >
                    Download
                </button>
                <div className='Visualizations-children-dropdown'>
                    <Dropdown
                        label = "Children of this resource"
                        options = {childrenForDropdown}
                        onValueChange = {onChildDropdownChange}
                        value = {selectedChild}
                    />
                </div>
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
