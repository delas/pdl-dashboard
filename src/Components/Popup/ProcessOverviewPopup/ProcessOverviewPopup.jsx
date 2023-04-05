import './ProcessOverviewPopup.scss';
import {useState, useEffect} from 'react';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import ProcessOverviewCard from './ProcessOverviewCard/ProcessOverviewCard';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';

function ProcessOverviewPopup(props) {

    const {
        toggleProcessOverviewPopupOpen,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [processes, setProcesses] = useState([]);
    
    useEffect(() => {
        const sortedProcesses = sortProcesses([
            {
                processId: '1',
                processStatus: 'Running',
                hostName: 'localhost',
                processName: 'Process 1',
            },
            {
                processId: '2',
                processStatus: 'Paused',
                hostName: 'localhost',
                processName: 'Process 2',
            },
            {
                processId: '3',
                processStatus: 'Stopped',
                hostName: 'localhost',
                processName: 'Process 3',
            },
            {
                processId: '4',
                processStatus: 'Complete',
                hostName: 'localhost',
                processName: 'Process 4',
            },
            {
                processId: '5',
                processStatus: 'Running',
                hostName: 'localhost',
                processName: 'Process 5',
            },
            {
                processId: '6',
                processStatus: 'Paused',
                hostName: 'localhost',
                processName: 'Process 6',
            },
            {
                processId: '7',
                processStatus: 'Stopped',
                hostName: 'localhost',
                processName: 'Process 7',
            },
            {
                processId: '8',
                processStatus: 'Complete',
                hostName: 'localhost',
                processName: 'Process 8',
            },

            {
                processId: '1',
                processStatus: 'Running',
                hostName: 'localhost',
                processName: 'Process 1',
            },
            {
                processId: '2',
                processStatus: 'Paused',
                hostName: 'localhost',
                processName: 'Process 2',
            },
            {
                processId: '3',
                processStatus: 'Stopped',
                hostName: 'localhost',
                processName: 'Process 3',
            },
            {
                processId: '4',
                processStatus: 'Complete',
                hostName: 'localhost',
                processName: 'Process 4',
            },
            {
                processId: '5',
                processStatus: 'Running',
                hostName: 'localhost',
                processName: 'Process 5',
            },
            {
                processId: '6',
                processStatus: 'Paused',
                hostName: 'localhost',
                processName: 'Process 6',
            },
            {
                processId: '7',
                processStatus: 'Stopped',
                hostName: 'localhost',
                processName: 'Process 7',
            },
            {
                processId: '8',
                processStatus: 'Complete',
                hostName: 'localhost',
                processName: 'Process 8',
            },
        ]);
        setProcesses(sortedProcesses);

        setIsLoading(false);
    }, []);

    const sortingOrder = {
        Running: 1,
        Paused: 2,
        Stopped: 3,
        Complete: 4,
    }

    const sortProcesses = (processes) => {
        return processes.sort((a, b) => {
            return sortingOrder[a.processStatus] - sortingOrder[b.processStatus];
        });
    }

    if(isLoading){
        return (
            <div className="ProcessOverviewPopup">
                <div className='Spinner-container-l'>
                    <LoadingSpinner loading={isLoading}/>
                </div>
            </div>
        )
    }

    const stopProcess = (processId) => {
        console.log(`stopping process: ${processId}`);
    }
    const pauseProcess = (processId) => {
        console.log(`pausing process: ${processId}`);
    }
    const resumeProcess = (processId) => {
        console.log(`resuming process: ${processId}`);
    }

    return (
            <BackdropModal closeModal = {toggleProcessOverviewPopupOpen}>

            <div className='ProcessOverviewPopup' onClick = {(e) => {e.stopPropagation()}} >
                <PopupHeader
                    title = {`Process Overview`}
                    closePopup = {toggleProcessOverviewPopupOpen}
                />
                <div className='ProcessOverviewPopup-body'>
                {processes.map((process) => {
                    return (
                        <ProcessOverviewCard
                            key = {process.processId}
                            process = {process}
                            stopProcess = {stopProcess}
                            pauseProcess = {pauseProcess}
                            resumeProcess = {resumeProcess}
                        />
                    )
                })}
                </div>
            </div>
        </BackdropModal>
    );
}

export default ProcessOverviewPopup;
