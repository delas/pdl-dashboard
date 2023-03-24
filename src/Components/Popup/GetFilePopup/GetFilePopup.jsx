import './GetFilePopup.scss';
import {useState, useEffect} from 'react';
import PopupFooter from '../../Widgets/PopupFooter/PopupFooter';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import {getRepositories} from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import { GetRepositoryFilterMetadata } from '../../../Services/RepositoryServices';
import { getFileExtension, getFileResourceLabel } from '../../../Utils/FileUnpackHelper';
import config from '../../../config';

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
    }, []);

    const convertFilesToDropdown = (files) => {
        return files.map((file) => {
            return ({label: `${getFileExtension(file)} ${getFileResourceLabel(file)}`, value: file})
        })
    }

    useEffect(() => {
        if(selectedRepository){
            const repositoryUrl = selectedRepository.label;//getRepositories().filter((repository) => repository.id === selectedRepository.value)[0]?.name;
            const filters = config.availableVisualizations
                .map((visualization) => visualization.ResourceType)
                .filter(function (x, i, a) { 
                return a.indexOf(x) === i; 
            });
            GetRepositoryFilterMetadata(repositoryUrl, filters).then(res => {
                setFilesForDropdown(convertFilesToDropdown(res.data));
            });
        }
    }, selectedRepository);

    const onRepositoryChange = (value) => {
        setSelectedRepository(value)
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

                {selectedRepository &&
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
                />

            </div>
        </BackdropModal>
    );
}

export default GetFilePopup;
