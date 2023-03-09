import './FileInput.scss';
import { FaCloudUploadAlt } from 'react-icons/fa';

function FileInput(props) {

    const {
        onChange,
    } = props;

    return (
        <form id="file-upload-form" className="fileInput-body">
            <input id="file-upload" type="file" name="fileUpload" accept="image/*" className='fileInput-fileinput' onChange={onChange}/>

            <label htmlFor="file-upload" id="file-drag" className='fileInput-fileinput-label'>
                <FaCloudUploadAlt id="file-image" src="#" alt="Preview" className='fileInput-fileinput-icon'/>

                <div className='fileInput-fileinput-selectFile'>
                    <div>Select a file or drag here</div>
                    <span id="file-upload-btn" className="fileInput-fileinput-button">Select a file</span>
                </div>

            </label>
        </form>

    );
}

export default FileInput;
