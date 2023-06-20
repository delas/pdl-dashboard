import './ResourceGraphVisualizer.scss';
import {useState, useEffect} from 'react';
import DotVisualizer from '../DotVisualizer/DotVisualizer';
// import { Graphviz } from 'graphviz-react';
import {GetResourceGraph} from '../../../Services/RepositoryServices';
import { getFileRepositoryUrl, getFileResourceId } from '../../../Utils/FileUnpackHelper';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';
import { getFileLocal } from '../../../Store/LocalDataStore';

/* 
    This visualizer is currently used primarily for visualizing the related resources of a file.
    However, it is possible to visualize all .dot files with this visualizer. To do so, simply 
    add the file extension to the config.js file in the getVisualizations() function.
*/

function ResourceGraphVisualizer(props) {
    const {
        selectedFileId
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [graph, setGraph] = useState(null);
    const [error, setError] = useState(null);

    let file = getFileLocal(selectedFileId);

    useEffect(() => {
        setIsLoading(true);
        GetResourceGraph(getFileRepositoryUrl(file), getFileResourceId(file))
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
    
    if(isLoading || !graph){
        return (
            <div className="ResourceGraphVisualizer-loading">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
            </div>
        )
    }

    return (
        <div className="ResourceGraphVisualizer">
            <DotVisualizer fileContent = {graph}/>
        </div>
    )
}

export default ResourceGraphVisualizer;
