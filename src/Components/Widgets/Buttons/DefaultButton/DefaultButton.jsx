import React from 'react';
import './DefaultButton.scss';

function DefaultButton(props) {

    const {
        click,
        text,
        disabled = false,
        primary = false,
    } = props;

    return (
        <button 
            className={`Default-button Default-button-primary-${primary} Default-button-primary-${primary}-disabled-${disabled}`} 
            onClick={() => { click(); }} 
            disabled = {disabled}
        >
            {text}
        </button>
    )
}

export default DefaultButton;