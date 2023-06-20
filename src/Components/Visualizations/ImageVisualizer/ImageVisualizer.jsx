import './ImageVisualizer.scss';
import {useState, useEffect} from 'react';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';
import { GetFileImage } from '../../../Services/RepositoryServices';
import { getFileContent, getFileDescription, getFileExtension, getFileRepositoryUrl, getFileResourceId } from '../../../Utils/FileUnpackHelper';

function ImageVisualizer(props) {
    const {
        file,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [imageType, setImageType] = useState(null);

    useEffect(() => { // Use image if it is already loaded, otherwise fetch it. Set loading to done when finished.
        const resourceId = getFileResourceId(file);
        const host = getFileRepositoryUrl(file);
        if(file && getFileContent(file)){
            setImage(file.fileContent);
            setImageType(getFileExtension(file)?.toUpperCase());
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
            {imageType === "SVG" &&
                <embed
                    alt={`${getFileDescription(file)}`}
                    src={image}
                    type="image/svg+xml"
                />
            }
            {(imageType === "PNG" || imageType === "JPG") &&
                <img src={image} alt={`${getFileDescription(file)}`}/>
            }
        </div>
    )
}

export default ImageVisualizer;
