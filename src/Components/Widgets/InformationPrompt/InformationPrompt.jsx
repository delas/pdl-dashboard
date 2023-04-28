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
        closePrimary,
        setTimeoutClose = true,
        hasAccept = false,
        onAcceptPrompt,
        acceptButtonText,
        acceptPrimary,
    } = props;

    useEffect(() => {
        if(setTimeoutClose)
        setTimeout(() => {
            onClosePrompt();
        }, 3000);
    })


    console.log({
        title,
        text,
        closeButtonText,
        onClosePrompt,
        disabled,
        closePrimary,
        setTimeoutClose,
        hasAccept,
        onAcceptPrompt,
        acceptButtonText,
        acceptPrimary,
    });

    return (
        <div className={`InformationPrompt InformationPrompt-auto-close-${setTimeoutClose}`}>
            <h4>{title}</h4>
            <div className='InformationPrompt-text'>
                {text}
            </div>
            <div className='InformationPrompt-button-container'>
                <DefaultButton
                    click = {onClosePrompt}
                    text = {closeButtonText}
                    disabled = {disabled}
                    primary =  {closePrimary}
                />

                {hasAccept && 
                    <DefaultButton
                        click = {onAcceptPrompt}
                        text = {acceptButtonText}
                        disabled = {disabled}
                        primary =  {acceptPrimary}
                    />
                }
            </div>
        </div>
    );
}

export default InformationPrompt;
