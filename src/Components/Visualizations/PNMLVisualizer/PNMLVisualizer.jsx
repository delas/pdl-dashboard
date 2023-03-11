import './PNMLVisualizer.scss';
import PNMLVisualizerUtil from './PNMLVisualizerUtil';
import {useState, useEffect} from 'react';
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
    // console.log(PNMLVisualizerUtil.testXMLOptions());
    // PNMLVisualizerUtil.readPnml('./running-examplePNML.pnml').then((res) => console.log(res));

    return (
        <div className="PNMLVisualizer">
            
        </div>
    )
}

export default PNMLVisualizer;
