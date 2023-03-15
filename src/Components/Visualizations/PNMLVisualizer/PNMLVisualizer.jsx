import './PNMLVisualizer.scss';
import PNMLVisualizerUtil from './PNMLVisualizerUtil';
import {useState, useEffect} from 'react';
import Petrinet from './Petrinet';
// import Histogram from 'react-chart-histogram';
// import { Chart } from "react-google-charts";

function PNMLVisualizer(props) {
    const {
        histogramData,
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    });

    if(isLoading){
        return (
            <div className="PNMLVisualizer">
                <div>Loading ...</div>
            </div>
        )
    }

    console.log(PNMLVisualizerUtil.parsePnml(file.fileContent));
    // console.log(PetrinetVisualizer.convertToPetri('Petrinet'));

    return (
        <div className="PNMLVisualizer">
            <div className ='Petrinet-container'>
                <Petrinet file={file}/>
            </div>
        </div>
    )
}

export default PNMLVisualizer;
