import './ResourceGraph.scss';
import {useState, useEffect} from 'react';
import { Graphviz } from 'graphviz-react';
import {GetResourceGraph} from '../../../Services/RepositoryServices';
import { getFileHost, getFileResourceId } from '../../../Utils/FileUnpackHelper';

function ResourceGraph(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [graph, setGraph] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
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
    }, []);
    
    if(isLoading){
        return (
            <div className="ResourceGraph">
                <div>Loading ...</div>
            </div>
        )
    }

    if(error){
        return (
            <div className="ResourceGraph">
                <div>Error loading graph</div>
                <div>{error}</div>
            </div>
        )
    }

    const getAllNodes = () => {   
        document.getElementsByClassName("node");
        // console.log(document.getElementsByClassName("node"));
    }

    return (
        <div className="ResourceGraph" onClick = {() => {getAllNodes()}}>
            <Graphviz dot={graph} className="ResourceGraph-graphviz"/>
        </div>
    )
}

export default ResourceGraph;
