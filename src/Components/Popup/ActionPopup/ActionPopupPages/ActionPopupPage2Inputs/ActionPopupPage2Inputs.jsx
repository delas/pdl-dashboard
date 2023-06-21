import './ActionPopupPage2Inputs.scss';
import Dropdown from '../../../../Widgets/Dropdown/Dropdown' 
import { getFileExtension } from '../../../../../Utils/FileUnpackHelper';

function ActionPopupPage2Inputs(props) {

    const {
        repositories, 
        onRepositoryFileOwnerDropdownChange, 
        repositoryFileOwnerDropdownSelected,
        minerObject, 
        filteredFilesForDropdown, 
        onFileDropdownChange, 
        selectedFiles
    } = props;

    if(minerObject?.ResourceInput.length <= 0){
        return (
            <div className='ActionPopup-wizard-step2'>
                <span>This mining algorithm requires no inputs.</span>
            </div>
        );
    }

    return (
        <div className='ActionPopup-wizard-step2'>
            <Dropdown
                options = {repositories}
                onValueChange = {onRepositoryFileOwnerDropdownChange}
                label = {`Select repository to search for file:`}
                value = {repositoryFileOwnerDropdownSelected}
            />

            {repositoryFileOwnerDropdownSelected && 
                minerObject?.ResourceInput?.map((resourceInput, index) => {
                    const options = (resourceInput.FileExtension && filteredFilesForDropdown[resourceInput.ResourceType]) ? // Filters on file extension if it exists otherwise only on ResourceType in ActionPopup
                        filteredFilesForDropdown[resourceInput.ResourceType].filter(dropdownValue => {
                            return getFileExtension(dropdownValue.value) === resourceInput.FileExtension;
                        }) : filteredFilesForDropdown[resourceInput.ResourceType]
                    return(
                        <Dropdown
                            options = {options}
                            onValueChange = {onFileDropdownChange}
                            label = {`Select ${resourceInput.Name} resource:`}
                            value = {selectedFiles[resourceInput.Name]}
                            extraParam = {resourceInput.Name}
                            key = {index}
                        />
                    )
                })
            }
        </div>
    );
}

export default ActionPopupPage2Inputs;