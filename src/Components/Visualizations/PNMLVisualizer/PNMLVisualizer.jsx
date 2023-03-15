import './PNMLVisualizer.scss';
import {useState, useEffect} from 'react';
import Petrinet from './Petrinet';

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
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className="PNMLVisualizer">
            <div className ='Petrinet-container'>
                <Petrinet file={file}/>
            </div>
        </div>
    )
}

export default PNMLVisualizer;
