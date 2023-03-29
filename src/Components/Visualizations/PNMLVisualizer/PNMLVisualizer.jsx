import './PNMLVisualizer.scss';
import {useState, useEffect} from 'react';
import Petrinet from './Petrinet';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';

function PNMLVisualizer(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if(isLoading){
        return (
            <div className="PNMLVisualizer">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
            </div>
        )
    }

    return (
        <div className="PNMLVisualizer">
            <div className ='Petrinet-container'>
                {/* <Petrinet file={file}/> */}
                <div>
                    This feature is corrently under development.
                </div>
            </div>
        </div>
    )
}

export default PNMLVisualizer;
