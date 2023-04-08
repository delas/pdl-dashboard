import './ActionPopupPage3Parameters.scss';
import InputField from '../../../../Widgets/InputField/InputField';

function ActionPopupPage3Paramters(props) {

    const {
        selectedParams,
        onParamValueChange,
        getInputType
    } = props;

    return (
        <div className='ActionPopup-wizard-step3'>
            <div className='ActionPopup-wizard-parameter-inputs'>
                {selectedParams === null || selectedParams === undefined || selectedParams?.length === 0 ? 
                    <span>Miner requires no parameters</span> :
                    selectedParams.map((param, index) => {
                        const type = getInputType(param);
                        return (
                            <InputField
                                key = {index}
                                label = {param.Name}
                                fieldType = {type}
                                placeholder = {type}
                                min = {param.min}
                                index = {index}
                                max = {param.max}
                                value = {param.selectedValue}
                                onChange = {onParamValueChange}
                            />
                        )
                    })
                }
            </div>
        </div> 
    );
}

export default ActionPopupPage3Paramters;