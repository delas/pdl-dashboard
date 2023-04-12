import './Popup.scss';
import PopupHeader from '../PopupHeader/PopupHeader';
import PopupFooter from '../PopupFooter/PopupFooter';

function Popup(props) {

    const {
        children,
        showFooter = true,
        closePopup,
        title,
        onCancelClick,
        onNextClick,
        cancelText,
        nextText,
        nextButtonDisabled,
    } = props;

    return (
        <div className='Popup'>
            <PopupHeader
                title = {title}
                closePopup = {closePopup}
            />

            {children}

            {showFooter && <PopupFooter
                onCancelClick = {onCancelClick}
                onNextClick = {onNextClick}
                cancelText = {cancelText}
                nextText = {nextText}
                nextButtonDisabled = {nextButtonDisabled}
            />}
        </div>
    );
}

export default Popup;
