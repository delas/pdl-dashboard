import './PopupHeader.scss';
import { FaRegWindowClose } from 'react-icons/fa';

function PopupHeader(props) {

    const {
        closePopup,
        title,
    } = props;

    return (
        <header className='Popup-header'>
            <h4>{title}</h4>
            <div className='ClosePopup'>
                <FaRegWindowClose
                    onClick = {() => {closePopup()}}
                />
            </div>
        </header>
    );
}

export default PopupHeader;
