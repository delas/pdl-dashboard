import './Dropdown.scss';
import {useState, useEffect} from 'react';
import Select from 'react-select'

function Dropdown(props) {

    const [selected, setSelected] = useState(null);

    const {
        options,
        label,
        placeholder = "select from list",
        onValueChange = () => {},
        value = null,
    } = props;

    useEffect(() => {
        if(value !== selected){
            setSelected(value);
        }
    }, [])
    
    const handleValueChange = (value) => {
        setSelected(value);
        onValueChange(value.value);
    }

    return (
        <div className='Dropdown-container'>
            <span className='Dropdown-label'>{label}</span>
            <div className='Dropdown' onClick={(e) => {e.stopPropagation()}}>
                <Select 
                    options={options} 
                    value={selected} 
                    onChange={handleValueChange} 
                    name="Dropdown" 
                    search={true} 
                    placeholder={placeholder} 
                    onClick={(e) => {e.stopPropagation()}}
                    onMouseDown={(e) => e.stopPropagation()}
                    onValueClick={(e) => {e.stopPropagation()}}
                />
            </div>
        </div>
    );
}

export default Dropdown;
