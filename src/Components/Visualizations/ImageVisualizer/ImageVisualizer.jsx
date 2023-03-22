import './ImageVisualizer.scss';
import {useState, useEffect} from 'react';

function ImageVisualizer(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if(isLoading){
        return (
            <div className="ImageVisualizer">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className="ImageVisualizer">
            <img src="" alt=""/>
        </div>
    )
}

export default ImageVisualizer;
