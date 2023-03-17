import './PopupFooter.scss';

function PopupFooter(props) {

    const {
        onCancelClick,
        onNextClick,
        cancelText,
        nextText,
        nextButtonDisabled
    } = props;

    return (
        <footer className='Popup-footer'>
            <div className='Popup-buttonContainer'>

                <button className='Popup-button Popup-button-cancel' onClick = {() => {onCancelClick()}}>
                    {cancelText}
                </button>

                <button className={`Popup-button Popup-button-confirm Popup-button-confirm-disabled-${nextButtonDisabled}`} onClick={() => {onNextClick()}} disabled = {nextButtonDisabled}>
                    {nextText}
                </button>

            </div>
        </footer>
    );
}

export default PopupFooter;
