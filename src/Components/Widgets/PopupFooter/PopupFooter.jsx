import './PopupFooter.scss';
import DefaultButton from '../Buttons/DefaultButton/DefaultButton';

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

                <DefaultButton
                    click = {onCancelClick}
                    text = {cancelText}
                    disabled = {false}
                    primary =  {false}
                />
                <DefaultButton
                    click = {onNextClick}
                    text = {nextText}
                    disabled = {nextButtonDisabled}
                    primary =  {true}
                />

            </div>
        </footer>
    );
}

export default PopupFooter;
