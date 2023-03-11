import './HistogramVisualizer.scss';
import {useState, useEffect} from 'react';
import Histogram from 'react-chart-histogram';
import { Chart } from "react-google-charts";

function HistogramVisualizer(props) {
    const {
        histogramData
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    });

    if(isLoading){
        return (
            <div className="HistogramVisualizer">
                <div>Loading ...</div>
            </div>
        )
    }
    
    const data = [
        ["Event", "Occurances",],
        ["Event1", 1000,],
        ["Event2", 1170,],
        ["Event3", 660,],
        ["2017", 1030],
    ];

    const options = {
        chart: {
            title: "<fileName>.<fileExtension>",
            subtitle: "Occurance chart of events",
        },
    };

    return (
        <div className="HistogramVisualizer">
            <Chart
                chartType="Bar"
                width="100%"
                height="400px"
                data={data}
                options={options}
            />
        </div>
    )
}

export default HistogramVisualizer;
