import './GetFilePopup.scss';
import {useState, useEffect} from 'react';
import PopupFooter from '../../Widgets/PopupFooter/PopupFooter';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import {getRepositories} from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import { GetRepositoryFilterMetadata } from '../../../Services/RepositoryServices';
import { getFileExtension, getFileHost, getFileResourceLabel } from '../../../Utils/FileUnpackHelper';
import {getAvailableResourceTypes } from '../../../config';

function GetFilePopup(props) {

    const {
        toggleGetFilePopupOpen,
        getAndAddFile,
        repository = {},
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [filesForDropdown, setFilesForDropdown] = useState(null);
    const [selectedRepository, setSelectedRepository] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        setIsLoading(false);
        setSelectedRepository(repository);
        setFilesForDropdownMetadata(repository)
    }, []);

    const convertFilesToDropdown = (files) => { // param structure = [fileMetadata1, fileMetadata2, ...]
        return files.map((file) => {
            return ({label: `${getFileExtension(file)} ${getFileResourceLabel(file)}`, value: file})
        })
    }

    const setFilesForDropdownMetadata = (repository) => { // param structure = {label: "Repository Name", value: "Repository Id"}
        if(repository && Object.keys(repository).length > 0){
            const repositoryUrl = repository.label;
            GetRepositoryFilterMetadata(repositoryUrl, getAvailableResourceTypes()).then(res => {
                setFilesForDropdown(convertFilesToDropdown(res.data));
            });
        }
    }

    const onRepositoryChange = (selectedDropdownValue) => { // param structure = {label: "Repository Name", value: "Repository Id"}
        setSelectedRepository(selectedDropdownValue);
        setFilesForDropdownMetadata(selectedDropdownValue);
    }

    const onFileValueChange = (value) => {
        setSelectedFile(value);
    }

    const repositories = getRepositories().map((repository, index) => {
        return {label: repository.name, value: repository.id}
    })

    const onConfirmClick = () => {
        if(selectedFile) {
            getAndAddFile(selectedFile.value);
            toggleGetFilePopupOpen();
        }
    }

    const handleConfirmButtonDisabled = () => {
        return !selectedFile;
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

                {(selectedRepository && Object.keys(selectedRepository).length > 0) &&
                <Dropdown
                    options = {filesForDropdown}
                    onValueChange = {onFileValueChange}
                    label = {`Select log file`}
                    value = {selectedFile}
                    loading = {filesForDropdown === null}
                />}

                <PopupFooter
                    onCancelClick = {toggleGetFilePopupOpen}
                    onNextClick = {onConfirmClick}
                    cancelText = {`Cancel`}
                    nextText = {`Download`}
                    nextButtonDisabled = {handleConfirmButtonDisabled()}
                />

            </div>
        </BackdropModal>
    );
}

export default GetFilePopup;
