import './BackdropModal.scss';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

function BackdropModal(props) {

    const {
        children,
        closeModal,
        showSpinner = false,
    } = props;

    return (
        <div className='Backdrop-modal' 
            onClick = {(e) => {
                // closeModal(); 
                e.stopPropagation();
            }}
        >
            <div className={`backdrop-overlay-spinner-${showSpinner}`} onClick = {(e) => {
                e.stopPropagation();
            }}>
                <div className='Spinner-container'>
                    <LoadingSpinner
                        loading = {showSpinner}
                    />
                </div>
            </div>
            {children}
        </div>
    );
}

export default BackdropModal;
