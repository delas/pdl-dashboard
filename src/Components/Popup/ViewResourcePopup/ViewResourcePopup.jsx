import './ViewResourcePopup.scss';
import {useState, useEffect} from 'react';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import {getRepositoriesLocal} from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import { GetRepositoryFilterMetadata } from '../../../Services/RepositoryServices';
import { getFileExtension, getFileResourceLabel } from '../../../Utils/FileUnpackHelper';
import {getAvailableResourceTypes } from '../../../config';
import Popup from '../../Widgets/Popup/Popup';

function ViewResourcePopup(props) {

    const {
        toggleViewResourcePopupOpen,
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

    const repositories = getRepositoriesLocal().map((repository, index) => {
        return {label: repository.name, value: repository.id}
    })

    const onConfirmClick = () => {
        if(selectedFile) {
            console.log("Calling getAndAddFile");
            getAndAddFile(selectedFile.value);
            toggleViewResourcePopupOpen();
        }
    }

    const handleConfirmButtonDisabled = () => {
        return !selectedFile;
    }

    if(isLoading){
        return (
            <div className="ViewResourcePopup">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <BackdropModal closeModal = {toggleViewResourcePopupOpen}>
            <Popup
                title = {`Download file from repository`}
                closePopup = {toggleViewResourcePopupOpen}
                onCancelClick = {toggleViewResourcePopupOpen}
                onNextClick = {onConfirmClick}
                cancelText = {`Cancel`}
                nextText = {`Download`}
                nextButtonDisabled = {handleConfirmButtonDisabled()}
            >

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

            </Popup>
        </BackdropModal>
    );
}

export default ViewResourcePopup;
