import './IconizedButton.scss';
// import {useState, useEffect} from 'react';

function IconizedButton(props) {

    const {
        className,
        disabled,
        icon,
        text,
        onClick = null,
        theme = "secondary"
    } = props;

    return (
        <button className={`IconizedButton ${className} IconizedButton-${theme}`} type="button" disabled = {disabled} onClick = {() => {onClick()}}>
            <div className={`IconizedButton-icon IconizedButton-icon-${theme}`}>
                {icon}
            </div>
            <div className={`IconizedButton-text IconizedButton-text-${theme}`}>
                {text}
            </div>
        </button>
    );
}

export default IconizedButton;
