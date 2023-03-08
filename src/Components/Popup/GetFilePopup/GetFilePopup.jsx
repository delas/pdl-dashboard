import './GetFilePopup.scss';
import {useState, useEffect} from 'react';
import PopupFooter from '../../Widgets/PopupFooter/PopupFooter';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import {getRepositories} from '../../../Store/LocalDataStore';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import { GetFiles } from '../../../Services/RepositoryServices';

function GetFilePopup(props) {

    const {
        toggleGetFilePopupOpen,
        repository = {},
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [selectedRepository, setSelectedRepository] = useState({});
    const [filesMetadata, setFilesMetadata] = useState(null);
    const [filesForDropdown, setFilesForDropdown] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        setIsLoading(false);
        setSelectedRepository(repository);
    }, []);

    useEffect(() => {
        const repositoryUrl = getRepositories().filter((repository) => repository.id === selectedRepository)[0]?.name;
        GetFiles(repositoryUrl).then(res => setFilesMetadata(res.data));
    });

    useEffect(() => {
        if(filesMetadata !== null)
        setFilesForDropdown(
            filesMetadata.map((file) => {
                return ({label: `${file.FileExtension} ${file.FileLabel}`, value: file.FileId})
            })
        );
    }, [filesMetadata]);

    const onRepositoryChange = (value) => {
        setSelectedRepository(value)
    }

    const onFileValueChange = (value) => {
        setSelectedFile(value);
    }

    const repositories = getRepositories().map((repository, index) => {
        return {label: repository.name, value: repository.id}
    })

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
                    title = {`Upload file`}
                    closePopup = {toggleGetFilePopupOpen}
                />

                <Dropdown
                    options = {repositories}
                    onValueChange = {onRepositoryChange}
                    label = {`Select repository`}
                    value = {selectedRepository}
                    loading = {repositories === null}
                />

                <Dropdown
                    options = {filesForDropdown}
                    onValueChange = {onFileValueChange}
                    label = {`Select file`}
                    value = {selectedFile}
                    loading = {filesForDropdown === null}
                />

                <PopupFooter
                    onCancelClick = {toggleGetFilePopupOpen}
                    onNextClick = {() => {}}
                    cancelText = {`Cancel`}
                    nextText = {`Confirm`}
                />

            </div>
        </BackdropModal>
    );
}

export default GetFilePopup;
