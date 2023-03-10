import './Radiobuttons.scss';

function Radiobuttons(props) {

    const {
        onChange = () => {},
        options = [],
        title = '',
    } = props;


    return (
        <div className='Radiobuttons-container'>
            <span className='Radiobutton-title'>{title}</span>
            {options.map((option, index) => {
                return  (
                    <label className="Radiobutton-label" key={index}>
                        <input className='Radiobutton-button' type="radio" name="radiobutton" onClick={() => {onChange(option)}}/>
                        {option.label}
                    </label>
                )
            })}
        </div>
    );
}

export default Radiobuttons;
