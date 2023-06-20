import {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import './Visualizations.scss';
import Tabs from '../Widgets/Tabs/Tabs';
import { getFileDescription, getFileExtension, getFileRepositoryUrl, getFileResourceLabel, getFileResourceType, getFileResourceId, getFileDynamic, getFileContent, fileBuilder } from '../../Utils/FileUnpackHelper';
import LoadingSpinner from '../Widgets/LoadingSpinner/LoadingSpinner';
import {getVisalizations, pingDynamicResourceInterval} from '../../config';
import Dropdown from '../Widgets/Dropdown/Dropdown';
import {getChildrenFromFile, GetSingleFileMetadata} from '../../Services/RepositoryServices';
import DefaultButton from '../Widgets/Buttons/DefaultButton/DefaultButton';
import { getFileLocal, saveFileLocal } from '../../Store/LocalDataStore';
import AlignmentVisualizer from './AlignmentVisualizer/AlignmentVisualizer';
import BPMNVisualizer from './BPMNVisualizer/BPMNVisualizer';
import HistogramVisualizer from './HistogramVisualizer/HistogramVisualizer';
import PNMLVisualizer from './PNMLVisualizer/PNMLVisualizer';
import DotVisualizer from './DotVisualizer/DotVisualizer';
import ImageVisualizer from './ImageVisualizer/ImageVisualizer';
import ResourceGraphVisualizer from './ResourceGraphVisualizer/ResourceGraphVisualizer';

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
    const [children, setChildren] = useState([]);
    const [childrenForDropdown, setChildrenForDropdown] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [hasCalledChildren, setHasCalledChildren] = useState(null);
    const [error, setError] = useState(null);
    const file = getFileLocal(selectedFileId);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() =>{ updateState({}); }, []);

    const generateTabList = (file) => {
        const defaultTabs = [ // These are the tabs that are always present
            {
                ResourceType: "RELATIONGRAPH",
                Title: "Related resources"
            }
        ];

        if(file && getFileResourceType(file) && getFileExtension(file)) {
            const visualizations = getVisalizations(getFileResourceType(file).toUpperCase(), getFileExtension(file).toUpperCase());
            return visualizations ? visualizations.concat(defaultTabs) : defaultTabs;  // If there are visualizations for the file, add them to the default tabs
        } else {
            return defaultTabs;
        }
    }

    const selectedTabList = useMemo(() => generateTabList(file), [file]);
    const updateFileInterval = useRef(null);

    useEffect(() => {
        setComponentUpdaterFunction("Visualizations", {update: forceUpdate})
        setSelectedChild(null);
        setSelectedTab(null);
        setError(null);

        if(file && hasCalledChildren !== getFileResourceId(file)){ // prevents children being requested repeatedly
            getAndSaveChildren();
        } else {
            setIsLoading(false);
        }

        getAndSaveVisualizationForFile();

    }, [selectedFileId]);    

    useEffect(() => {
        const tabList = generateTabList(file);
        if(tabList && tabList.length > 0 && !selectedTab)
        setSelectedTab(generateTabList(file)[0] ? generateTabList(file)[0] : null);
        file && getFileDynamic(file) === false && clearInterval(updateFileInterval.current); // Inline if-statement without else clause 
    }, [file]);

    const onTabChange = (tab) => {
        setSelectedTab(tab);
    }

    const getAndSaveChildren = () => {
        getChildrenFromFile(getFileRepositoryUrl(file), getFileResourceId(file))
            .then((res) => {setChildren(res.data); generateChildren(res.data)} )
            .then(() => {setHasCalledChildren(getFileResourceId(file))})
            .then(() => {setIsLoading(false)})
            .catch((err) => {setError(err); console.log(err)} );
    }

    const getAndSaveVisualizationForFile = () => {
        clearInterval(updateFileInterval.current);
        if(file && getFileDynamic(file)){
            updateFileInterval.current = setInterval(() => {
                const internalFile = getFileLocal(selectedFileId);
                if(!internalFile || !getFileRepositoryUrl(internalFile) || !getFileResourceId(internalFile)) return clearInterval(updateFileInterval.current);
                getSingleFileMetadataHandler(internalFile);
                forceUpdate();
            }, pingDynamicResourceInterval);
        }
        else if(file && getFileDynamic(file) === false && !getFileContent(file)){
            getSingleFileMetadataHandler(file);
        }
    }

    const getSingleFileMetadataHandler = (file) => {
        GetSingleFileMetadata(getFileRepositoryUrl(file), getFileResourceId(file))
            .then((res) => {
                const metadata = res.data;
                metadata["repositoryUrl"] = getFileRepositoryUrl(file);
                getAndAddFile(metadata);
            }).catch((err) => saveFileLocal(getFileResourceId(file), fileBuilder(file, {Dynamic: false})));
    }

    const generateChildren = (children) => {
        if(children);
        setChildrenForDropdown(
            children.filter((childMetadata) => {
                return !!getVisalizations(getFileResourceType(childMetadata).toUpperCase(), getFileExtension(childMetadata).toUpperCase());
            }).map((childMetadata) => {
                return ({label: getFileResourceLabel(childMetadata), value: getFileResourceId(childMetadata)})
            })
        );
    }

    const onChildDropdownChange = (value) => {
        setSelectedChild(value);
    }

    const onDropdownButtonClick = () => {
        if(selectedChild){
            const metadata = children.find((child) => getFileResourceId(child) === selectedChild.value);
            metadata["repositoryUrl"] = getFileRepositoryUrl(file);
            getAndAddFile(metadata);
        }
    }

    const uploadEditedFile = (xml, originalMetadata) => { // Option to update a BPMN file with manual changes - save button in the bottom right
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

    if(error){
        return (
            <div className="Visualizations-error">
                <h2>An error has occured</h2>
                {/* <div>Please varify that the repository is available for the requested file and try again.</div> */}
                <div className='Visualizations-error-message'>
                    {`Error: ${error}`}
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
                    {(selectedTab.ResourceType === "DOT")       && <DotVisualizer fileContent = {getFileContent(file)} />}
                    {(selectedTab.ResourceType === "RELATIONGRAPH")      && <ResourceGraphVisualizer selectedFileId = {selectedFileId}/>}
                    {(selectedTab.ResourceType === "IMAGE")     && <ImageVisualizer file = {file}/>}
                    {(selectedTab.ResourceType === "ALIGNMENT")     && <AlignmentVisualizer file = {file}/>}
                </div>
            }
        </div>
    );
}

export default Visualizations;
