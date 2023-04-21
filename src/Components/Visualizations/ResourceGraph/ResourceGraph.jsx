import './ResourceGraph.scss';
import {useState, useEffect} from 'react';
import { Graphviz } from 'graphviz-react';
import {GetResourceGraph} from '../../../Services/RepositoryServices';
import { getFileHost, getFileResourceId } from '../../../Utils/FileUnpackHelper';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';
import { getFileLocal } from '../../../Store/LocalDataStore';

function ResourceGraph(props) {
    const {
        // file,
        selectedFileId

    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [graph, setGraph] = useState(null);
    const [error, setError] = useState(null);

    let file = getFileLocal(selectedFileId);

    // const file = getFileLocal(selectedFileId);

    useEffect(() => {
        setIsLoading(true);
        GetResourceGraph(getFileHost(file), getFileResourceId(file))
            .then((res) => {
                setGraph(res.data);
            })
            .then(() => {
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err);
                setIsLoading(false);
            });
    }, [selectedFileId]);

    const options = {
        fit: true,
        zoom: true,
        tooltip: true,
        height: "95%",
        width: "95%",
        aspectRatio: 1,
        boxSizing: "border-box",
        overflow: "hidden",
        "tooltip.class": "graphviz-tooltip",
        "tooltip.delay": 0,
        "tooltip.fade": false,
        "tooltip.fontcolor": "#000000",
        "tooltip.fontsize": "12px",
        "tooltip.fontfamily": "sans-serif",
        "tooltip.fontweight": "normal",
        "tooltip.color": "#ffffff",
        "tooltip.background-color": "#000000",
        "tooltip.border": "1px solid #000000",
        "tooltip.border-radius": "4px",
        "tooltip.opacity": 0.8,
        "tooltip.offset": 10,
        "tooltip.arrow": true,
        "tooltip.arrow.color": "#000000",
        "tooltip.arrow.size": 10,
        "tooltip.multiline": true,
        "tooltip.adjust": true,
        "tooltip.adjust.x": 0,
        "tooltip.adjust.y": 0,
        "tooltip.adjust.scale": 1,
        "tooltip.adjust.rotate": 0,
        "tooltip.adjust.flip": "none",
        "tooltip.adjust.scroll": true,
        "tooltip.adjust.resize": true,
        "tooltip.adjust.resize.width": 0,
        "tooltip.adjust.resize.height": 0,
        "tooltip.adjust.resize.keep": "none",
        "tooltip.adjust.resize.maxwidth": 0,
        "tooltip.adjust.resize.maxheight": 0,
        "tooltip.adjust.resize.minwidth": 0,
        "tooltip.adjust.resize.minheight": 0,
        "tooltip.adjust.resize.scale": 1,
        "tooltip.adjust.resize.rotate": 0,
        "tooltip.adjust.resize.flip": "none",
        "tooltip.adjust.resize.scroll": true,
    }
    
    if(isLoading){
        return (
            <div className="ResourceGraph-loading">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
            </div>
        )
    }

    if(error){
        return (
            <div className="ResourceGraph">
                <div>Error loading graph</div>
                <div>{`${error.response.statusText} ${error.response.status}`}</div>
            </div>
        )
    }

    const getAllNodes = () => {   
        document.getElementsByClassName("node");
    }

    return (
        <div className="ResourceGraph" onClick = {() => {getAllNodes()}}>
            <Graphviz dot={graph} className="ResourceGraph-graphviz"
                options={options}
            />
        </div>
    )
}

export default ResourceGraph;
