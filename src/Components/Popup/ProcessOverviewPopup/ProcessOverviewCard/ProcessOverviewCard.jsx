import './ProcessOverviewCard.scss';
import {useState, useEffect} from 'react';
import {GiWarPick, GiPauseButton, GiPlayButton } from 'react-icons/gi';
import {FaStopCircle, FaCheck, FaStop} from 'react-icons/fa';

function ProcessOverviewCard(props) {

    const {
        process,
        stopProcess = () => {},
        pauseProcess = () => {},
        resumeProcess = () => {},
    } = props;

    const [isExpanded, setIsExpanded] = useState(false);
    const [processObject, setProcessObject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setProcessObject(process);
    }, [process]);

    useEffect(() => {
        if(processObject !== null)
        setIsLoading(false);
    }, [processObject])

    if(isLoading){
        return (
            <div className='ProcessOverviewCard'>
                <div>Loading...</div>
            </div>
        )
    }

    return (
        <div className='ProcessOverviewCard'>
            <div className={`ProcessOverviewCard-status ProcessOverviewCard-status-${true}`}>
                <div className={`ProcessOverviewCard-status-icon ProcessOverviewCard-status-icon-${processObject.status.toUpperCase()}`}>
                    {processObject.status.toUpperCase() === 'RUNNING' && <GiWarPick/>}
                    {processObject.status.toUpperCase() === 'PAUSED' && <GiPauseButton/>}
                    {processObject.status.toUpperCase() === 'STOPPED' && <FaStop/>}
                    {processObject.status.toUpperCase() === 'COMPLETE' && <FaCheck/>}
                </div>
                <div className='ProcessOverviewCard-status-text'>
                    <div className='ProcessOverviewCard-status-text-title'>
                        {processObject.status.toUpperCase()}
                    </div>
                </div>
                <span className='ProcessOverviewCard-status-runtime'>
                    {processObject.progress}
                </span>
            </div>

            <div className={`ProcessOverviewCard-host ProcessOverviewCard-host-${true}`}>
                <div className={`ProcessOverviewCard-host-name ProcessOverviewCard-host-name-${true}`}>
                    {processObject.hostname}
                </div>
                <div className={`ProcessOverviewCard-host-processName ProcessOverviewCard-host-processName-${true}`}>
                    {processObject.processName}
                </div>
            </div>

            <div className={`ProcessOverviewCard-change-process-status`}>
                <div className={`ProcessOverviewCard-pause-resume ProcessOverviewCard-pause-resume-${process.status.toUpperCase()}`}>
                    {processObject.status.toUpperCase() === 'RUNNING' && <GiPauseButton onClick = {() => {pauseProcess(processObject.processId)}}/>}
                    {processObject.status.toUpperCase() === 'PAUSED' && <GiPlayButton onClick = {() => {resumeProcess(processObject.processId)}}/>}
                </div>

                <div className={`ProcessOverviewCard-endProcess ProcessOverviewCard-endProcess-${true}`}>
                    <FaStopCircle onClick = {() => {stopProcess(processObject.processId)}}/>
                </div>
            </div>
        </div>
    );
}

export default ProcessOverviewCard;