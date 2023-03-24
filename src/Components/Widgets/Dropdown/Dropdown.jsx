import './Dropdown.scss';
import {useState, useEffect} from 'react';
import Select from 'react-select'

function Dropdown(props) {

    const {
        options,
        label,
        placeholder = "select from list",
        onValueChange = () => {},
        value = null,
        loading = false,
        extraParam = null,
    } = props;
    
    const handleValueChange = (value) => {
        if(extraParam != null) onValueChange(value, extraParam);
        else onValueChange(value);
    }

    if(loading){
        return <div>... loading</div>
    }

    return (
        <div className='Dropdown-container'>
            <span className='Dropdown-label'>{label}</span>
            <div className='Dropdown' onClick={(e) => {e.stopPropagation()}}>
                <Select 
                    options={options} 
                    value={value} 
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
