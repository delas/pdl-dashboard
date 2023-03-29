import './ImageVisualizer.scss';
import {useState, useEffect} from 'react';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';
import { GetFileImage } from '../../../Services/RepositoryServices';
import { getFileHost, getFileResourceId } from '../../../Utils/FileUnpackHelper';

function ImageVisualizer(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const resourceId = getFileResourceId(file);
        const host = getFileHost(file);
        GetFileImage(host, resourceId).then((res) => {
            setImage(res.data);
        });
        setIsLoading(false);
    }, [file]);

    if(isLoading){
        return (
            <div className="ImageVisualizer">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
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
