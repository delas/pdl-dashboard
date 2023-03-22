import './ResourceGraph.scss';
import {useState, useEffect} from 'react';
import { Graphviz } from 'graphviz-react';

function ResourceGraph(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const dot = 'graph{a--b}';

    if(isLoading){
        return (
            <div className="ResourceGraph">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className="ResourceGraph">
            <Graphviz dot={dot} className="ResourceGraph-graphviz"/>
        </div>
    )
}

export default ResourceGraph;
