import './AlignmentVisualizerItem.scss';
import {useState, useEffect} from 'react';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';
import { getFileLocal } from '../../../Store/LocalDataStore';
import { getFileContent } from '../../../Utils/FileUnpackHelper';

function AlignmentVisualizerItem(props) {
    const {
        alignmentItem
    } = props;

    if(!alignmentItem){
        return (null);
    }

    const sequence = alignmentItem.alignment;

    if(Array.isArray(sequence) === false){
        return (null);
    }

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
