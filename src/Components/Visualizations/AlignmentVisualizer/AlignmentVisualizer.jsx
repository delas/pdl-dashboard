import './AlignmentVisualizer.scss';
import {useState, useEffect} from 'react';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';
import { getFileLocal } from '../../../Store/LocalDataStore';
import { getFileContent } from '../../../Utils/FileUnpackHelper';
import AlignmentVisualizerItem from './AlignmentVisualizerItem';

// -------------------------------------------------
// This visualizer is temporary. It is neither ideal, or flexible. It was made only to show the functionality of the application.

function AlignmentVisualizer(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    let fileContent = getFileContent(file);
    
    if(isLoading || Array.isArray(fileContent) === false || fileContent.length === 0){
        return (
            <div className="AlignmentVisualizer-loading">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
            </div>
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
