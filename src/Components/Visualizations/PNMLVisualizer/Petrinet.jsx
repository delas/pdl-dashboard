import './Petrinet.scss';
import {useState, useEffect, useRef} from 'react';
import PNMLVisualizerUtil from './PNMLVisualizerUtil';
import config, {PlaceId, TransitionId, EdgeId, NODE_KEY} from './Petrinet-config';

import { GraphView } from 'react-digraph';

function Petrinet(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    const [figures, setFigures] = useState(null);

    const [graph, setGraph] = useState(null);
    const [selected, setSelected] = useState("{}");

    const GraphViewRef = useRef(null);

    useEffect(() => {
        setFigures(PNMLVisualizerUtil.parsePnml(file.fileContent))
        setIsLoading(false);
    }, []);

    

    const getNodes = (places, transitions) => {
        console.log(figures.figures.places)
        return places.map((place) => {
            return ({
                id: place?.id,
                title: place?.name?.text,
                x: place?.graphics?.position?.x,
                y: place?.graphics?.position?.y,
                type: `${PlaceId}`
            })
        }).concat(
        transitions.map((transition) => {
            return ({
                id: transition?.id,
                title: transition?.name?.text,
                x: transition?.graphics?.position?.x,
                y: transition?.graphics?.position?.y,
                type: `${TransitionId}`
            })
        })
        )
    }

    const getEdges = (arcs) => {
        return arcs.map((arc) => {
            return ({
                source: arc.source,
                target: arc.target,
                type: `${EdgeId}`
            })
        })
    }

    const onSelect = () => {
        console.log('select');
    }

    const onCreateNode = () => {
        console.log('create node');
    }

    const onUpdateNode = () => {
        console.log('update node');
    }

    const onDeleteNode = () => {
        console.log('delete node');
    }

    const onCreateEdge = () => {
        console.log('create edge');
    }

    const onSwapEdge = () => {
        console.log('swap edge');
    }

    const onDeleteEdge = () => {
        console.log('delete edge');
    }

    if(isLoading){
        return (
            <div className="Petrinet">
                <div>Loading ...</div>
            </div>
        )
    }

    if(figures === null || figures === {} || figures === undefined) {
        return (
            <div className='Petrinet'>
                File is empty, or something went wrong.
            </div>
        )
    }

    console.log(getNodes(figures.figures.places, figures.figures.transitions));
    console.log(getEdges(figures.figures.arcs));

    const items = {
        nodes: [
            {
            "id": 1,
            "title": "Node A",
            "x": 258.3976135253906,
            "y": 331.9783248901367,
            "type": `${PlaceId}`
            },
            {
            "id": 2,
            "title": "Node B",
            "x": 593.9393920898438,
            "y": 260.6060791015625,
            "type": `${TransitionId}`
            },
            {
            "id": 3,
            "title": "Node C",
            "x": 237.5757598876953,
            "y": 61.81818389892578,
            "type": `${PlaceId}`
            }
        ],
        edges: [
            {
            "source": 1,
            "target": 2,
            "type": `${EdgeId}`
            },
            {
            "source": 2,
            "target": 3,
            "type": `${EdgeId}`
            }
        ]
    }

    return (
        <div className="Petrinet">
            <GraphView  
                ref={GraphViewRef}
                nodeKey={NODE_KEY}
                nodes={ items.nodes }
                edges={ items.edges }
                // selected={selected}
                nodeTypes={config.NodeTypes}
                nodeSubtypes={{}}
                edgeTypes={config.EdgeTypes}
                // allowMultiselect={true} // true by default, set to false to disable multi select.
                // onSelect={onSelect}
                // onCreateNode={onCreateNode}
                // onUpdateNode={onUpdateNode}
                // onDeleteNode={onDeleteNode}
                // onCreateEdge={onCreateEdge}
                // onSwapEdge={onSwapEdge}
                // onDeleteEdge={onDeleteEdge}
                />
        </div>
    )
}

export default Petrinet;
