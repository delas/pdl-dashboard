import './BackdropModal.scss';

function BackdropModal(props) {

    const {
        children,
        closeModal
    } = props;

    return (
        <div className='Backdrop-modal' 
            onClick = {(e) => {
                closeModal(); 
                e.stopPropagation();
            }}
        >
            {children}
        </div>
    );
}

export default BackdropModal;
