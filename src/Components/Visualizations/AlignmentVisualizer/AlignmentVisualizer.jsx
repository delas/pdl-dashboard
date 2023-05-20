import './AlignmentVisualizer.scss';
import {useState, useEffect} from 'react';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';
import { getFileContent } from '../../../Utils/FileUnpackHelper';
import AlignmentVisualizerItem from './AlignmentVisualizerItem/AlignmentVisualizerItem';

// This visualizer is temporary. It is neither ideal, or flexible. It was made only to show the functionality of the application.
// It is hard structured to the data provided by PM4PY. It is not a good example of how to make a visualizer.

function AlignmentVisualizer(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    let fileContent = getFileContent(file);
    
    if(isLoading || Array.isArray(fileContent) === false){
        return (
            <div className="AlignmentVisualizer-loading">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
            </div>
        )
    }

    if(Array.isArray(fileContent) === false){
        return (
            <div className="AlignmentVisualizer">The provided data is not complaint with this visualizer.</div>
        )
    }

    return (
        <div className="AlignmentVisualizer">
            <div className='AlignmentVisualizer-container'>
                {fileContent.map((item, index) => {
                    return (
                        <div className='AlignmentVisualizer-item'>
                            <AlignmentVisualizerItem alignmentItem={item} key={index}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AlignmentVisualizer;
