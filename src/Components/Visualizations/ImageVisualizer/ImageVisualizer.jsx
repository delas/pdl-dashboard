import './ImageVisualizer.scss';
import {useState, useEffect} from 'react';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';
import { GetFileImage } from '../../../Services/RepositoryServices';
import { getFileContent, getFileHost, getFileResourceId } from '../../../Utils/FileUnpackHelper';

function ImageVisualizer(props) {
    const {
        file
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const resourceId = getFileResourceId(file);
        const host = getFileHost(file);
        if(file && getFileContent(file)){
            setImage(file.fileContent);
            setIsLoading(false);
        } else {
            GetFileImage(host, resourceId).then((res) => {
                setImage(res.data);
                setIsLoading(false);
            }).catch((err) => {
                setIsLoading(false);
            });
        }
        
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
            <img src={image} alt="Image"/>
        </div>
    )
}

export default ImageVisualizer;
