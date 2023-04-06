import './ProcessOverviewPopup.scss';
import {useState, useEffect, useCallback} from 'react';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import ProcessOverviewCard from './ProcessOverviewCard/ProcessOverviewCard';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';
import {getAllProcesses} from '../../../Store/LocalDataStore';

function ProcessOverviewPopup(props) {

    const {
        toggleProcessOverviewPopupOpen,
        setComponentUpdaterFunction
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [processes, setProcesses] = useState([]);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() =>{ 
        updateState({}); 
        setProcesses(sortProcesses(getAllProcesses()));
    }, []);

    useEffect (() => {
        setComponentUpdaterFunction("ProcessOverviewPopup", {update: forceUpdate})
        setProcesses(sortProcesses(getAllProcesses()));
        setIsLoading(false);
    }, [])

    const sortingOrder = {
        Running: 1,
        Paused: 2,
        Stopped: 3,
        Complete: 4,
    }

    const sortProcesses = (processes) => {
        return processes.sort((a, b) => {
            return sortingOrder[a.status] - sortingOrder[b.status];
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
                {processes.length > 0 && 
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
                }

                {processes.length === 0 && 
                    <div>
                        There are no processes to display.
                    </div>
                }
            </div>
        </BackdropModal>
    );
}

export default ProcessOverviewPopup;
