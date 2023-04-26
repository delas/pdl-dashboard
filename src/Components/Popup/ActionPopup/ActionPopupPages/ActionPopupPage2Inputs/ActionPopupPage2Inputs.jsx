import './ActionPopupPage2Inputs.scss';
import Dropdown from '../../../../Widgets/Dropdown/Dropdown' 

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
                    return(
                        <Dropdown
                            options = {filteredFilesForDropdown[resourceInput.ResourceType]}
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