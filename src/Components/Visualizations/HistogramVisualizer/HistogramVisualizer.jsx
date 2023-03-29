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

    const convertFileContentToHistogramData = (fileContent) => {
        let data = [["Events", "Occurances"]];
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
        return (
            <div className="ResourceGraph">
                <div>Error loading histogram</div>
                <div>{`${error.response.statusText} ${error.response.status}`}</div>
            </div>
        )
    }

    const convertFileToHistogramOptions = (file) => {
        return {chart: {
            title: `${getFileResourceLabel(file)}`,
            subtitle: "Occurances of events"
        }}
    }

    return (
        <div className="HistogramVisualizer">
            <Chart
                chartType="Bar"
                width="100%"
                height="400px"
                data={fileContent}
                options={convertFileToHistogramOptions(file)}
            />
        </div>
    )
}

export default HistogramVisualizer;
