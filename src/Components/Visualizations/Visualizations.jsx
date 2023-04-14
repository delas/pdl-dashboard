import './Visualizations.scss';
import {useState, useEffect, useCallback, useMemo} from 'react';
import Tabs from '../Widgets/Tabs/Tabs';
import BPMNVisualizer from './BPMNVisualizer/BPMNVisualizer';
import HistogramVisualizer from './HistogramVisualizer/HistogramVisualizer';
import PNMLVisualizer from './PNMLVisualizer/PNMLVisualizer';
import ResourceGraph from './ResourceGraph/ResourceGraph';
import ImageVisualizer from './ImageVisualizer/ImageVisualizer';
import { getFileDescription, getFileExtension, getFileHost, getFileResourceLabel, getFileResourceType, getFileResourceId, getFileContent } from '../../Utils/FileUnpackHelper';
import LoadingSpinner from '../Widgets/LoadingSpinner/LoadingSpinner';
import {getVisalizations} from '../../config';
import Dropdown from '../Widgets/Dropdown/Dropdown';
import {getChildrenFromFile} from '../../Services/RepositoryServices';
import DefaultButton from '../Widgets/Buttons/DefaultButton/DefaultButton';

function Visualizations(props) {
    const {
        file,
        setComponentUpdaterFunction,
        getAndAddFile,
        openPopup,
        popups,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(null);
    const [fileToDisplay, setFileToDisplay] = useState(file);
    const [children, setChildren] = useState([]);
    const [childrenForDropdown, setChildrenForDropdown] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [hasCalledChildren, setHasCalledChildren] = useState(null);
    
    const [, updateState] = useState();
    const forceUpdate = useCallback(() =>{ updateState({}); }, []);

    const generateTabList = (file) => {
        if(file) return getVisalizations(getFileResourceType(file).toUpperCase(), getFileExtension(file).toUpperCase()); 
    }

    const selectedTabList = useMemo(() => generateTabList(file), [file]);

    useEffect(() => {
        setComponentUpdaterFunction("Visualizations", {update: forceUpdate})
        setFileToDisplay(file);
        setIsLoading(false);
        setSelectedChild(null);
        if(getFileResourceId(file) !== getFileResourceId(fileToDisplay)) setSelectedTab(null);

        if(hasCalledChildren !== getFileResourceId(file)){
        getChildrenFromFile(getFileHost(file), getFileResourceId(file))
            .then((res) => {setChildren(res.data); generateChildren(res.data)} )
            .then(() => {setHasCalledChildren(getFileResourceId(file))})
            .catch((err) => {console.log(err)} );
        }
    }, [file]);

    useEffect(() => {
        // if(selectedTabList) {
            // setSelectedTab(selectedTabList[0] ? selectedTabList[0] : null);
            setSelectedTab(generateTabList(fileToDisplay)[0] ? generateTabList(fileToDisplay)[0] : null);
        // }
    }, [fileToDisplay]);

    const onTabChange = (tab) => {
        setSelectedTab(tab);
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

    const uploadEditedFile = (xml, originalMetadata) => {
        openPopup(popups.UploadManualChangesPopup, {xml: xml, originalMetadata: originalMetadata});
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
                    tablist = {selectedTabList}
                />
            </div>
            <div className='Visualizations-header'>
                <div>
                    <b>{`${getFileResourceLabel(file)}:`}</b>
                </div>
                <div>
                    {` ${getFileDescription(file)}`}
                </div>
            </div>
            <div className='Visualizations-children-dropdown-container'>
                
                {childrenForDropdown.length > 0 && 
                    
                    <div className='Visualizations-children-dropdown'>
                        <DefaultButton
                            click = {onDropdownButtonClick}
                            text = {`Download`}
                            disabled = {!selectedChild}
                            primary =  {true}
                        />
                        <Dropdown
                            label = "Children of this resource"
                            options = {childrenForDropdown}
                            onValueChange = {onChildDropdownChange}
                            value = {selectedChild}
                        />
                    </div>
                }
                {childrenForDropdown.length === 0 &&
                    <div className='Visualizations-children-dropdown'>
                        Resource has no children
                    </div>
                }
            </div>
            {selectedTab &&
                <div className='Visualizations-VisualizerContainer'>
                    {(selectedTab.ResourceType === "BPMN")      && <BPMNVisualizer file = {fileToDisplay} uploadEditedFile = {uploadEditedFile}/>}
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
