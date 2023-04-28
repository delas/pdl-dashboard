import './Checkbox.scss';

function Checkbox(props) {

    const {
        onChange = () => {},
        title,
        value = false,
        labelPosition = 'top', // 'left', 'top'
    } = props;


    return (
        <div className={`Checkbox-component Checkbox-component-${labelPosition}`}>
            <span className='Checkbox-title'>{title}</span>
            <div className='Checkbox-container'>
                <input type="checkbox" checked={value} onChange = {() => onChange()}>
                </input>
            </div>
        </div>
    );
}

export default Checkbox;
