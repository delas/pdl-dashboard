import './Dropdown.scss';
import {useState, useEffect} from 'react';
import SelectSearch from 'react-select-search';

function Dropdown(props) {

    const [selected, setSelected] = useState(null);

    const {
        options,
        placeholder = "select from list",
        onValueCHange = () => {},
    } = props;

    

    const handleValueChange = (value) => {
        setSelected(value);
        onValueCHange(value);
    }

    return (
        <div className='Dropdown'>
            <SelectSearch 
                options={options} 
                value={selected} 
                onChange={handleValueChange} 
                name="Dropdown" 
                search={true} 
                placeholder={placeholder} />
        </div>
    );
}

export default Dropdown;
