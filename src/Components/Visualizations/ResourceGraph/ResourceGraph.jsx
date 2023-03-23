import './ResourceGraph.scss';
import {useState, useEffect} from 'react';
import { Graphviz } from 'graphviz-react';
import {GetResourceGraph} from '../../../Services/RepositoryServices';

function ResourceGraph(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [graph, setGraph] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        GetResourceGraph(file.Host, "fe960d94-5928-4463-b0f8-c59072b5d449")// file.ResourceId)
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

    return (
        <div className="ResourceGraph">
            <Graphviz dot={graph} className="ResourceGraph-graphviz"/>
        </div>
    )
}

export default ResourceGraph;
