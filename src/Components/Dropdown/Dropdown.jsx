import './Dropdown.scss';
import {useState, useEffect} from 'react';
import Select from 'react-select'

function Dropdown(props) {

    const [selected, setSelected] = useState(null);

    const {
        options,
        placeholder = "select from list",
        onValueCHange = () => {},
    } = props;
    
    const handleValueChange = (value) => {
        setSelected(value);
        onValueCHange(value.value);
        console.log(value);
    }

    return (
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
    );
}

export default Dropdown;
