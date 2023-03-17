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
    const [filesMetadata, setFilesMetadata] = useState(null);
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
            GetVisFilesMetadata(repositoryUrl).then(res => setFilesMetadata(res.data));
        }
        if(selectedRepository){
            const repositoryUrl = selectedRepository.label;//getRepositories().filter((repository) => repository.id === selectedRepository.value)[0]?.name;
            GetLogFilesMetadata(repositoryUrl).then(res => {setLogFilesMetadata(res.data)});
        }
    }, [selectedRepository]);

    useEffect(() => {
        if(filesMetadata !== null)
        setFilesForDropdown(
            filesMetadata.map((file) => {
                return ({label: `${file.FileExtension} ${file.FileLabel}`, value: file.FileId})
            })
        );
        if(logFilesMetadata !== null)
        setLogFilesForDropdown(
            logFilesMetadata.map((file) => {
                return ({label: `${file.FileExtension} ${file.FileLabel}`, value: file.FileId})
            })
        );
    }, [filesMetadata, logFilesMetadata]);

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
            fileToSave = filesMetadata.filter((file) => file.FileId === selectedFile.value);
        } else if(selectedLogFile !== null){
            fileToSave = logFilesMetadata.filter((file) => file.FileId === selectedLogFile.value);
        }
        if(fileToSave && fileToSave.length === 1){
            addFile(fileToSave[0].FileId, fileToSave[0]);
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
                    label = {`Select visualized file`}
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
