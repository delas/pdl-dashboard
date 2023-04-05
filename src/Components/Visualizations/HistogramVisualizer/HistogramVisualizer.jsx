import './HistogramVisualizer.scss';
import {useState, useEffect, useCallback} from 'react';
// import Histogram from 'react-chart-histogram';
import { Chart } from "react-google-charts";
import {GetFileText, GetHistogramOfLog} from '../../../Services/RepositoryServices';
import { getFileResourceLabel, getFileResourceType, getFileResourceId, getFileHost, getFileContent } from '../../../Utils/FileUnpackHelper';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';

function HistogramVisualizer(props) {
    const {
        file,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [fileContent, setFileContent] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(getFileResourceType(file) === 'EventStream'){
            setInterval(() => {
                setHistogramOfLog();
            }, 500)
        }
        else{
            setHistogramOfLog();
        }
    }, [file]);

    const setHistogramOfLog = async () => {
        GetHistogramOfLog(getFileHost(file), getFileResourceId(file))
            .then((res) => {
                setFileContent(convertFileContentToHistogramData(res.data));
                setIsLoading(false);
            })
            .catch((err) => { 
                setError(err); 
                setIsLoading(false);
            })
    }

    // const generateColors = () => { // didn't work
    //     let colors = {}
    //     if(fileContent);
    //     fileContent.forEach((event, index) => {
    //         colors[index] = {color: "#990000"};
    //     });
    //     return colors;
    // }

    const convertFileContentToHistogramData = (fileContent) => {
        let data = [["Events", "Event"]];
        return data.concat(fileContent);
    }

    if(isLoading){
        return (
            <div className="HistogramVisualizer">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
            </div>
        )
    }

    if(error){
        console.log(error);
        const errorStatusText = error?.response?.statusText;
        const errorStatusCode = error?.response?.status;
        const errorStatusData = error?.response?.data;
        return (
            <div className="ResourceGraph">
                <div>Error loading histogram</div>
                <div>{`${errorStatusText ? errorStatusText : "Unexpected problem occured while trying to get resource."} 
                    Status code: ${errorStatusCode ? errorStatusCode : "unknown"}`}</div>
            </div>
        )
    }

    const convertFileToHistogramOptions = (file) => {
        return {chart: {
            title: `${getFileResourceLabel(file)}`,
            subtitle: "Occurances of events",
            // series: generateColors(), // didn't work
        }}
    }

    return (
        <div className="HistogramVisualizer">
            <Chart
                chartType="Bar"
                width="100%"
                height="500px"
                data={fileContent}
                options={convertFileToHistogramOptions(file)}
            />
        </div>
    )
}

export default HistogramVisualizer;
