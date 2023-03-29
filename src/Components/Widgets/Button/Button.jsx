import './Button.scss';
// import {useState, useEffect} from 'react';

function Button(props) {

    const {
        className,
        disabled,
        icon,
        text,
        onClick = null,
        theme = "secondary"
    } = props;

    return (
        <button className={`Button ${className} Button-${theme}`} type="button" disabled = {disabled} onClick = {() => {onClick()}}>
            <div className={`Button-icon Button-icon-${theme}`}>
                {icon}
            </div>
            <div className={`Button-text Button-text-${theme}`}>
                {text}
            </div>
        </button>
    );
}

export default Button;
