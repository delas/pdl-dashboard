import './Radiobuttons.scss';

function Radiobuttons(props) {

    const {
        onChange = () => {},
        options = [], // {label: "name_of_type_string", value: {output_of_any_type} }
        title = '',
    } = props;


    return (
        <div className='Radiobuttons-component'>
            <span className='Radiobutton-title'>{title}</span>
            <div className='Radiobuttons-container'>
                {options.map((option, index) => {
                    return  (
                        <label className="Radiobutton-label" key={index}>
                            <input className='Radiobutton-button' type="radio" name="radiobutton" onClick={() => {onChange(option)}}/>
                            {option.label}
                        </label>
                    )
                })}
            </div>
        </div>
    );
}

export default Radiobuttons;
