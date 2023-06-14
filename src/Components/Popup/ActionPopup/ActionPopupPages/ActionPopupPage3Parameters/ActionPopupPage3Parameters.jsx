import './ActionPopupPage3Parameters.scss';
import InputField from '../../../../Widgets/InputField/InputField';

function ActionPopupPage3Paramters(props) {

    const {
        selectedParams,
        onParamValueChange,
        getInputType
    } = props;

    const getDefaultValue = (param) => {
        if(param.Default !== null && param.Default !== undefined) {
            return param.Default;
        } else {
            switch(selectedParams[0].Type) {
                case 'string': return '';
                case 'int' : return 0;
                case 'float': return 0.0;
                case 'bool': return false;
                case 'double': return 0.0;
                default:
                    return null;
            } 
        }  
    }
    
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
                                placeholder = {param.Default ? param.Default : getDefaultValue(param)}
                                min = {param.Min}
                                index = {index}
                                max = {param.Max}
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