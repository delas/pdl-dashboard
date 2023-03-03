import './Button.scss';
// import {useState, useEffect} from 'react';

function Button(props) {

    const {
        className,
        disabled,
        icon,
        text,
        onClick = null,
    } = props;

    return (
        <button className={`Button ${className}`} type="button" disabled = {disabled} onClick = {() => {onClick()}}>
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
