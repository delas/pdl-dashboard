import './AlignmentVisualizerItem.scss';

function AlignmentVisualizerItem(props) {
    const {
        alignmentItem
    } = props;

    if(!alignmentItem || Array.isArray(alignmentItem.alignment) === false){
        return <div>The provided data is not compliant for this visualizer</div>;
    }

    const sequence = alignmentItem.alignment;
    const sequenceLength = sequence.length;

    return (
        <div className="AlignmentVisualizerItem">
            <div className='AlignmentVisualizerItem-sequence'>
                {sequence.map((item, index) => {
                    return (
                        <div className='AlignmentVisualizerItem-sequence-item'>
                            {index < sequenceLength -1 ? `${item[0]} ->` : item[1]}
                        </div>
                    )
                })}
            </div>
            <div className='AlignmentVisualizerItem-stats-container'>
                <div className='AlignmentVisualizerItem-stats'>
                    {Object.keys(alignmentItem).map((key, index) => {
                        if(key !== 'alignment'){
                            return (
                                <div className='AlignmentVisualizerItem-stats-item'>
                                    <div className='AlignmentVisualizerItem-stats-item-title'>{key.replace("_", " ")} </div>
                                    <div className='AlignmentVisualizerItem-stats-item-value'>{alignmentItem[key]}</div>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        </div>
    )
}

export default AlignmentVisualizerItem;
