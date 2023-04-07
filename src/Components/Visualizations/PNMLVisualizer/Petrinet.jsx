import './Petrinet.scss';
import {useState, useEffect, useRef} from 'react';
// import PNMLVisualizerUtil from './PNMLVisualizerUtil';
// import config, {PlaceId, TransitionId, EdgeId, NODE_KEY} from './Petrinet-config';

// import { GraphView } from 'react-digraph';
// import { getFileContent } from '../../../Utils/FileUnpackHelper';

function Petrinet(props) {
    const {
        // file
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    // const [figures, setFigures] = useState(null);
    // // const [selected, setSelected] = useState("{}");
    // const GraphViewRef = useRef(null);

    // useEffect(() => {
    //     setFigures(PNMLVisualizerUtil.parsePnml(getFileContent(file)))
    //     setIsLoading(false);
    // }, []);

    // const getNodes = (places, transitions) => {
    //     return places.map((place) => {
    //         return ({
    //             id: place?.id,
    //             title: place?.name?.text,
    //             x: place?.graphics?.position?.x * 5,
    //             y: place?.graphics?.position?.y * 5,
    //             type: `${PlaceId}`
    //         })
    //     }).concat(
    //     transitions.map((transition) => {
    //         return ({
    //             id: transition?.id,
    //             title: transition?.name?.text,
    //             x: transition?.graphics?.position?.x * 5,
    //             y: transition?.graphics?.position?.y * 5,
    //             type: `${TransitionId}`
    //         })
    //     }))
    // }

    // const getEdges = (arcs) => {
    //     return arcs.map((arc) => {
    //         return ({
    //             source: arc.source,
    //             target: arc.target,
    //             type: `${EdgeId}`
    //         })
    //     })
    // }

    // const onSelect = (select) => {
    //     // setSelected(select);
    //     console.log("select");
    // }

    // const onCreateNode = () => {
    //     console.log('create node');
    // }

    // const onUpdateNode = () => {
    //     console.log('update node');
    // }

    // const onDeleteNode = () => {
    //     console.log('delete node');
    // }

    // const onCreateEdge = () => {
    //     console.log('create edge');
    // }

    // const onSwapEdge = () => {
    //     console.log('swap edge');
    // }

    // const onDeleteEdge = () => {
    //     console.log('delete edge');
    // }

    if(isLoading){
        return (
            <div className="Petrinet">
                <div>Loading ...</div>
            </div>
        )
    }

    // if(figures === null || figures === {} || figures === undefined) {
    //     return (
    //         <div className='Petrinet'>
    //             File is empty, or something went wrong.
    //         </div>
    //     )
    // }

    return (
        <div className="Petrinet">
            {/* <GraphView  
                ref={GraphViewRef}
                nodeKey={NODE_KEY}
                nodes={ getNodes(figures.figures.places, figures.figures.transitions) }
                edges={ getEdges(figures.figures.arcs) }
                // selected={selected}
                nodeTypes={config.NodeTypes}
                nodeSubtypes={{}}
                edgeTypes={config.EdgeTypes}
                // allowMultiselect={true} // true by default, set to false to disable multi select.
                onSelect={onSelect}
                onCreateNode={onCreateNode}
                onUpdateNode={onUpdateNode}
                onDeleteNode={onDeleteNode}
                onCreateEdge={onCreateEdge}
                onSwapEdge={onSwapEdge}
                onDeleteEdge={onDeleteEdge}
                renderNodeText={data => { return (
                    <foreignObject x='-75' y='-25' width='150' height='50'>
                        <p className='job-title'>{data.title}</p>
                    </foreignObject>
                ) }}
                /> */}
        </div>
    )
}

export default Petrinet;
