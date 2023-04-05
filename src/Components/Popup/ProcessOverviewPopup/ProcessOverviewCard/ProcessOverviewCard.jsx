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

    // const [isLoading, setIsLoading] = useState(true);
    
    // useEffect(() => {
    //     setIsLoading(false);
    // }, []);

    // if(isLoading){
    //     return (
    //         <div className="ProcessOverviewPopup">
    //             <div>Loading ...</div>
    //         </div>
    //     )
    // }

    return (
        <div className='ProcessOverviewCard'>
            <div className={`ProcessOverviewCard-status ProcessOverviewCard-status-${true}`}>
                <div className={`ProcessOverviewCard-status-icon ProcessOverviewCard-status-icon-${process.processStatus}`}>
                    {process.processStatus === 'Running' && <GiWarPick/>}
                    {process.processStatus === 'Paused' && <GiPauseButton/>}
                    {process.processStatus === 'Stopped' && <FaStop/>}
                    {process.processStatus === 'Complete' && <FaCheck/>}
                </div>
                <div className='ProcessOverviewCard-status-text'>
                    <div className='ProcessOverviewCard-status-text-title'>
                        {process.processStatus}
                    </div>
                </div>
            </div>

            <div className={`ProcessOverviewCard-host ProcessOverviewCard-host-${true}`}>
                <div className={`ProcessOverviewCard-host-name ProcessOverviewCard-host-name-${true}`}>
                    {process.hostName}
                </div>
                <div className={`ProcessOverviewCard-host-processName ProcessOverviewCard-host-processName-${true}`}>
                    {process.processName}
                </div>
            </div>

            <div className={`ProcessOverviewCard-change-process-status`}>
                <div className={`ProcessOverviewCard-pause-resume ProcessOverviewCard-pause-resume-${process.processStatus}`}>
                    {process.processStatus === 'Running' && <GiPauseButton onClick = {() => {pauseProcess(process.processId)}}/>}
                    {process.processStatus === 'Paused' && <GiPlayButton onClick = {() => {resumeProcess(process.processId)}}/>}
                </div>

                <div className={`ProcessOverviewCard-endProcess ProcessOverviewCard-endProcess-${true}`}>
                    <FaStopCircle onClick = {() => {stopProcess(process.processId)}}/>
                </div>
            </div>
        </div>
    );
}

export default ProcessOverviewCard;
