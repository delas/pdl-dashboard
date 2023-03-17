import './GetFilePopup.scss';
import {useState, useEffect} from 'react';
import PopupFooter from '../../Widgets/PopupFooter/PopupFooter';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import {getRepositories} from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import { GetVisFilesMetadata, GetLogFilesMetadata } from '../../../Services/RepositoryServices';

function GetFilePopup(props) {

    const {
        toggleGetFilePopupOpen,
        addFile,
        repository = {},
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [visFilesMetadata, setVisFilesMetadata] = useState(null);
    const [logFilesMetadata, setLogFilesMetadata] = useState(null);
    const [filesForDropdown, setFilesForDropdown] = useState([]);
    const [logFilesForDropdown, setLogFilesForDropdown] = useState([]);
    const [selectedRepository, setSelectedRepository] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedLogFile, setSelectedLogFile] = useState(null);

    useEffect(() => {
        setIsLoading(false);
        setSelectedRepository(repository);
    }, []);

    useEffect(() => {
        if(selectedRepository){
            const repositoryUrl = selectedRepository.label;//getRepositories().filter((repository) => repository.id === selectedRepository.value)[0]?.name;
            GetVisFilesMetadata(repositoryUrl).then(res => setVisFilesMetadata(res.data));
        }
        if(selectedRepository){
            const repositoryUrl = selectedRepository.label;//getRepositories().filter((repository) => repository.id === selectedRepository.value)[0]?.name;
            GetLogFilesMetadata(repositoryUrl).then(res => {setLogFilesMetadata(res.data)});
        }
    }, [selectedRepository]);

    useEffect(() => {
        if(visFilesMetadata !== null)
        setFilesForDropdown(
            visFilesMetadata.map((file) => {
                return ({label: `${file.FileInfo.FileExtension} ${file.ResourceLabel}`, value: file.ResourceId})
            })
        );
        if(logFilesMetadata !== null)
        setLogFilesForDropdown(
            logFilesMetadata.map((file) => {
                return ({label: `${file.FileInfo.FileExtension} ${file.ResourceLabel}`, value: file.ResourceId})
            })
        );
    }, [visFilesMetadata, logFilesMetadata]);

    const onRepositoryChange = (value) => {
        setSelectedRepository(value)
    }

    const onFileValueChange = (value) => {
        setSelectedFile(value);
        setSelectedLogFile(null);
    }

    const onLogFileValueChange = (value) => {
        setSelectedLogFile(value);
        setSelectedFile(null);
    }

    const repositories = getRepositories().map((repository, index) => {
        return {label: repository.name, value: repository.id}
    })

    const onConfirmClick = () => {
        let fileToSave = null;
        if(selectedFile !== null) {
            fileToSave = visFilesMetadata.filter((file) => file.ResourceId === selectedFile.value);
        } else if(selectedLogFile !== null){
            fileToSave = logFilesMetadata.filter((file) => file.ResourceId === selectedLogFile.value);
        }
        if(fileToSave && fileToSave.length === 1){
            addFile(fileToSave[0].ResourceId, fileToSave[0]);
            toggleGetFilePopupOpen();
        }
    }

    if(isLoading){
        return (
            <div className="GetFilePopup">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
            <BackdropModal closeModal = {toggleGetFilePopupOpen}>

            <div className='GetFilePopup' 
                onClick = {(e) => {e.stopPropagation()}}
            >

                <PopupHeader
                    title = {`Download file from repository`}
                    closePopup = {toggleGetFilePopupOpen}
                />

                <Dropdown
                    options = {repositories}
                    onValueChange = {onRepositoryChange}
                    label = {`Select repository`}
                    value = {selectedRepository}
                />

                <Dropdown
                    options = {filesForDropdown}
                    onValueChange = {onFileValueChange}
                    label = {`Select visualization file`}
                    value = {selectedFile}
                    loading = {filesForDropdown === null}
                />

                <Dropdown
                    options = {logFilesForDropdown}
                    onValueChange = {onLogFileValueChange}
                    label = {`Select log file`}
                    value = {selectedLogFile}
                    loading = {logFilesForDropdown === null}
                />

                <PopupFooter
                    onCancelClick = {toggleGetFilePopupOpen}
                    onNextClick = {onConfirmClick}
                    cancelText = {`Cancel`}
                    nextText = {`Download`}
                />

            </div>
        </BackdropModal>
    );
}

export default GetFilePopup;
