import { useEffect } from 'react';
import DefaultButton from '../Buttons/DefaultButton/DefaultButton';
import './InformationPrompt.scss';

function InformationPrompt(props) {

    const {
        title,
        text,
        closeButtonText,
        onClosePrompt,
        disabled,
        primary,
        setTimeoutClose = true,
    } = props;

    useEffect(() => {
        if(setTimeoutClose)
        setTimeout(() => {
            onClosePrompt();
        }, 3000);
    })

    return (
        <div className={`InformationPrompt InformationPrompt-auto-close-${setTimeoutClose}`}>
            <h4>{title}</h4>
            <div className='InformationPrompt-text'>
                {text}
            </div>
            <DefaultButton
                click = {onClosePrompt}
                text = {closeButtonText}
                disabled = {disabled}
                primary =  {primary}
            />
        </div>
    );
}

export default InformationPrompt;
