import './InputField.scss';

function InputField(props) {

    const {
        fieldType = "text",
        label = "",
        placeholder = "",
        className = "",
        id = "",
        onChange = () => {},
        value = '',
        min = null,
        max = null,
        index = null,
    } = props;

    return (
        <div className={`InputField-parent ${className}`}>
            <label className='InputField-label' htmlFor = {id ? id : `InputField-${fieldType}-${label}-${placeholder}-${className}`}>
                <div className='InputField-label-text-container'>
                    {label}
                    {min !== null && max !== null ? <b>{`[${min} - ${max}]`}</b> : null}
                </div>
            </label>
            <input 
                id = {id ? id : `InputField-${fieldType}-${label}-${placeholder}-${className}`}
                className={`InputField InputField-${fieldType}`}
                type={fieldType}
                placeholder = {placeholder}
                onChange = {(e) => {onChange({value: e.target.value, index: index})}}
                value = {value}
                min = {`${min}`}
                max = {`${max}`}
            />
        </div>
    );
}

export default InputField;
