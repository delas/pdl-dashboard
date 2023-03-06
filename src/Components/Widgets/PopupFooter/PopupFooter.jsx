import './PopupFooter.scss';

function PopupFooter(props) {

    const {
        onCancelClick,
        onNextClick,
        cancelText,
        nextText,
    } = props;

    return (
        <footer className='Popup-footer'>
            <div className='Popup-buttonContainer'>

                <button className='Popup-button Popup-button-cancel' onClick = {() => {onCancelClick()}}>
                    {cancelText}
                </button>

                <button className='Popup-button Popup-button-confirm' onClick={() => {onNextClick()}}>
                    {nextText}
                </button>

            </div>
        </footer>
    );
}

export default PopupFooter;
