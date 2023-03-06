import './InputField.scss';

function InputField(props) {

    const {
        fieldType = "text",
        label = "",
        placeholder = "",
        className = "",
        id = "",
        onChange = () => {},
        value = null,
    } = props;

    return (
        <div className={`InputField-parent ${className}`}>
            <label className='InputField-label' for = {id ? id : `InputField-${fieldType}-${label}-${placeholder}-${className}`}>
                {label}
            </label>
            <input 
                id = {id ? id : `InputField-${fieldType}-${label}-${placeholder}-${className}`}
                className={`InputField InputField-${fieldType}`}
                type={fieldType}
                placeholder = {placeholder}
                onChange = {onChange}
                value = {value}
            />
            
        </div>

    );
}

export default InputField;
