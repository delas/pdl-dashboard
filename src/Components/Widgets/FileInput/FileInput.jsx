import './FileInput.scss';
import { FaCloudUploadAlt } from 'react-icons/fa';

function FileInput(props) {

    const {
        onChange,
        filename = null,
        filesize = null,
    } = props;

    const fileSizeConverted = () => {
        if(filesize !== null){
            if (filesize < 1000000){
                return Math.floor(filesize/1000) + 'KB'
            }else{
                return Math.floor(filesize/1000000) + 'MB';
            }
        }
        return null;
    }
    const uploadText = filename ? `${filename} ${fileSizeConverted()}` : 'Select a file or drag here';
    const uploadButtonText = filename ? 'Choose a different file' : 'Select a file';

    return (
        <form id="file-upload-form" className="fileInput-body">
            <input id="file-upload" type="file" name="fileUpload" className='fileInput-fileinput' onChange={onChange}/>

            <label htmlFor="file-upload" id="file-drag" className='fileInput-fileinput-label'>
                <FaCloudUploadAlt id="file-image" src="#" alt="Preview" className='fileInput-fileinput-icon'/>

                <div className='fileInput-fileinput-selectFile'>
                    <div>{uploadText}</div>
                    <span id="file-upload-btn" className="fileInput-fileinput-button">{uploadButtonText}</span>
                </div>

            </label>
        </form>
    );
}

export default FileInput;
