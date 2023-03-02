import './Button.scss';
import {useState, useEffect} from 'react';

function Button(props) {

    const {
        className,
        disabled,
        icon,
        text,
    } = props;

    return (
        <button className={`Button ${className}`} type="button" disabled = {disabled}>
            <div className={`Button-icon`}>
                {icon}
            </div>
            <div className={`Button-text`}>
                {text}
            </div>
        </button>
    );
}

export default Button;
