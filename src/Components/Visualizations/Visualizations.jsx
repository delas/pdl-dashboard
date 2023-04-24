import './Visualizations.scss';
import {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import Tabs from '../Widgets/Tabs/Tabs';
import BPMNVisualizer from './BPMNVisualizer/BPMNVisualizer';
import HistogramVisualizer from './HistogramVisualizer/HistogramVisualizer';
import PNMLVisualizer from './PNMLVisualizer/PNMLVisualizer';
import ResourceGraph from './ResourceGraph/ResourceGraph';
import ImageVisualizer from './ImageVisualizer/ImageVisualizer';
import { getFileDescription, getFileExtension, getFileHost, getFileResourceLabel, getFileResourceType, getFileResourceId, getFileDynamic } from '../../Utils/FileUnpackHelper';
import LoadingSpinner from '../Widgets/LoadingSpinner/LoadingSpinner';
import {getVisalizations} from '../../config';
import Dropdown from '../Widgets/Dropdown/Dropdown';
import {getChildrenFromFile} from '../../Services/RepositoryServices';
import DefaultButton from '../Widgets/Buttons/DefaultButton/DefaultButton';
import { getFileLocal } from '../../Store/LocalDataStore';

function Visualizations(props) {
    const {
        selectedFileId,
        setComponentUpdaterFunction,
        getAndAddFile,
        openPopup,
        popups,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(null);
    // const [fileToDisplay, setFileToDisplay] = useState(getFileLocal(selectedFileId));
    const [children, setChildren] = useState([]);
    const [childrenForDropdown, setChildrenForDropdown] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [hasCalledChildren, setHasCalledChildren] = useState(null);
    const file = getFileLocal(selectedFileId);
    const selectedTabList = useMemo(() => generateTabList(file), [file]);

    const updateFileInterval = useRef(null);
    
    const [, updateState] = useState();
    const forceUpdate = useCallback(() =>{ updateState({}); }, []);

    const generateTabList = (file) => {
        if(file) return getVisalizations(getFileResourceType(file).toUpperCase(), getFileExtension(file).toUpperCase()); 
    }

    useEffect(() => {
        setComponentUpdaterFunction("Visualizations", {update: forceUpdate})
        setSelectedChild(null);
        setSelectedTab(null);

        if(file && hasCalledChildren !== getFileResourceId(file)){ // prevents children being requested repeatedly
        getChildrenFromFile(getFileHost(file), getFileResourceId(file))
            .then((res) => {setChildren(res.data); generateChildren(res.data)} )
            .then(() => {setHasCalledChildren(getFileResourceId(file))})
            .catch((err) => {console.log(err)} );
        }
        setIsLoading(false);

        // updates file every second if dynamic. Ref prevents multiple intervals.
        clearInterval(updateFileInterval.current);
        if(file && getFileDynamic(file)){
            updateFileInterval.current = setInterval(() => {
                const internalFile = getFileLocal(selectedFileId);
                getAndAddFile(internalFile);
                forceUpdate();
            }, 1000);
        }

    }, [selectedFileId]);

    useEffect(() => {
        const tabList = generateTabList(file);
        if(tabList && tabList.length > 0 && !selectedTab)
        setSelectedTab(generateTabList(file)[0] ? generateTabList(file)[0] : null);
    }, [file]);

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
            }).filter((child) => { if(child) return child }) // removes null values
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
            <div className="Visualizations-loading">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
            </div>
        )
    }

    if(!file){
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
                    {(selectedTab.ResourceType === "BPMN")      && <BPMNVisualizer file = {file} uploadEditedFile = {uploadEditedFile}/>}
                    {(selectedTab.ResourceType === "HISTOGRAM") && <HistogramVisualizer file = {file}/>}
                    {(selectedTab.ResourceType === "PNML")      && <PNMLVisualizer file = {file}/>}
                    {(selectedTab.ResourceType === "DOT")       && <ResourceGraph selectedFileId = {selectedFileId}/>}
                    {(selectedTab.ResourceType === "IMAGE")     && <ImageVisualizer file = {file}/>}
                </div>
            }
        </div>
    );
}

export default Visualizations;
