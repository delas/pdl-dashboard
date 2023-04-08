import './ActionPopupPage1Miner.scss';
import Dropdown from '../../../../Widgets/Dropdown/Dropdown' 

function ActionPopupPage1Miner(props) {

    const {
        miners,
        onMinerHostChange,
        minerHostDropdownValue,
        minerHostMinersDropdownOptions,
        onMinerDropdownChange,
        selectedMinerHostMiner,
    } = props;

    return (
        <div className='ActionPopup-wizard-step1'>
            <Dropdown
                options = {miners}
                onValueChange = {onMinerHostChange}
                label = {`Select miner host`}
                value = {minerHostDropdownValue}
            />
            {(minerHostDropdownValue && minerHostMinersDropdownOptions) &&
                <Dropdown
                options = {minerHostMinersDropdownOptions}
                onValueChange = {onMinerDropdownChange}
                label = {`Select miner`}
                value = {selectedMinerHostMiner}
            />}
        </div>
    );
}

export default ActionPopupPage1Miner;
