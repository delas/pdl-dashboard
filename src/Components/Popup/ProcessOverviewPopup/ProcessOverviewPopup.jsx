import './ProcessOverviewPopup.scss';
import {useState, useEffect, useCallback, useRef} from 'react';
import PopupHeader from '../../Widgets/PopupHeader/PopupHeader';
import BackdropModal from '../../Widgets/BackdropModal/BackdropModal';
import ProcessOverviewCard from './ProcessOverviewCard/ProcessOverviewCard';
import LoadingSpinner from '../../Widgets/LoadingSpinner/LoadingSpinner';
import {getAllProcessesLocal, getProcessLocal, setProcessKeyLocalAsync, removeProcessLocal} from '../../../Store/LocalDataStore';
import Dropdown from '../../Widgets/Dropdown/Dropdown';
import {StopMinerProcess} from '../../../Services/MinerServices';
import Popup from '../../Widgets/Popup/Popup';

function ProcessOverviewPopup(props) {

    const {
        toggleProcessOverviewPopupOpen,
        setComponentUpdaterFunction
    } = props;

    const sortingOrder = {
        Running: 1,
        Paused: 2,
        Stopped: 3,
        Complete: 4,
    }

    const sortType = {
        startTimeAsc: "sAsc",
        startTimeDsc: "sDsc",
        endTimeAsc: "eAsc",
        endTimeDsc: "eDsc",
        type: "type",
    }

    const [isLoading, setIsLoading] = useState(true);
    const [processes, setProcesses] = useState([]);
    const [selectedSorting, setSelectedSorting] = useState(null);
    const sortingRef = useRef(null);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() =>{ 
        updateState({});
        setProcesses(sortProcesses(getAllProcessesLocal(), sortingRef.current?.value ? sortingRef.current?.value : sortType.type));
    }, []);

    useEffect (() => {
        if(!selectedSorting){
            setSelectedSorting({value: sortType.endTimeDsc, label: "Finished Descending"});
        }
        setComponentUpdaterFunction("ProcessOverviewPopup", {update: forceUpdate})
        setProcesses(sortProcesses(getAllProcessesLocal(), selectedSorting?.value ? selectedSorting?.value : sortType.type));
        setIsLoading(false);
    }, []);

    // const getTestProcesses = () => {
    //     return [
    //         {
    //             endTime: 1680937438000,
    //             error: "My god, something awful has happened",
    //             hostname: "http://localhost:5000",
    //             id: "c0d5d265-a29a-4794-81df-2ffd30d49209",
    //             objectType: "process",
    //             outputDestination: "https://localhost:4000",
    //             processId: 18880,
    //             processName: "test Miner 1",
    //             progress: "15:591",
    //             resourceId: "180a4524-b116-492c-8bd4-a067f5fd6f06",
    //             saveOrUpdateFile: false,
    //             startTime: 1680937424122,
    //             status: "error",
    //         },
    //         {
    //             endTime: 1680937415000,
    //             error: "",
    //             hostname: "http://localhost:5000",
    //             id: "c0d5d265-a29a-4794-81df-2ffd30d49209",
    //             objectType: "process",
    //             outputDestination: "https://localhost:4000",
    //             processId: 18880,
    //             processName: "test Miner 2",
    //             progress: "28:129",
    //             resourceId: "180a4524-b116-492c-8bd4-a067f5fd6f06",
    //             saveOrUpdateFile: false,
    //             startTime: 1680937424122,
    //             status: "running",
    //         },
    //         {
    //             endTime: 1680937430000,
    //             error: "",
    //             hostname: "http://localhost:5000",
    //             id: "c0d5d265-a29a-4794-81df-2ffd30d49209",
    //             objectType: "process",
    //             outputDestination: "https://localhost:4000",
    //             processId: 18880,
    //             processName: "test Miner 3",
    //             progress: "19:009",
    //             resourceId: "180a4524-b116-492c-8bd4-a067f5fd6f06",
    //             saveOrUpdateFile: false,
    //             startTime: 1680937424122,
    //             status: "complete",
    //         },
    //         {
    //             endTime: 1680937430000,
    //             error: "",
    //             hostname: "http://localhost:5000",
    //             id: "c0d5d265-a29a-4794-81df-2ffd30d49209",
    //             objectType: "process",
    //             outputDestination: "https://localhost:4000",
    //             processId: 18880,
    //             processName: "test Miner 4",
    //             progress: "23:019",
    //             resourceId: "180a4524-b116-492c-8bd4-a067f5fd6f06",
    //             saveOrUpdateFile: false,
    //             startTime: 1680937424122,
    //             status: "stopped",
    //         },
    //     ];
    // }
    

    const sortingOptions = [
        {value: sortType.startTimeAsc, label: "Started Ascending"},
        {value: sortType.startTimeDsc, label: "Started Descending"},
        {value: sortType.endTimeAsc, label: "Finished Ascending"},
        {value: sortType.endTimeDsc, label: "Finished Descending"},
        {value: sortType.type, label: "Type"},
    ]

    const onSortingDropdownValueChange = (value) => {
        setProcesses(sortProcesses(getAllProcessesLocal(), value.value));
        setSelectedSorting(value);
        sortingRef.current = value;
    }

    const sortProcesses = (processes, sort) => {
        switch(sort){
            case sortType.startTimeAsc:
                return sortProcessesAsc(processes, "startTime");
            case sortType.startTimeDsc:
                return sortProcessesDsc(processes, "startTime");
            case sortType.endTimeAsc:
                return sortProcessesAsc(processes, "endTime");
            case sortType.endTimeDsc:
                return sortProcessesDsc(processes, "endTime");
            case sortType.type:
                return sortProcessesByType(processes);
            default:
                return sortProcessesByType(processes);
        }
    }

    const sortProcessesAsc = (processes, time) => {
        if(time === "startTime"){
            return processes.sort((a, b) => {
                return a.startTime - b.startTime;
            });
        }
        else if(time === "endTime"){
            return processes.sort((a, b) => {
                if(a.endTime === null && b.endTime === null) {
                    return a.startTime - b.startTime;
                }
                else if(a.endTime === null){
                    return -1;
                }
                else if(b.endTime === null){
                    return 1;
                }
                return a.endTime - b.endTime;
            });
        }  
    }

    const sortProcessesDsc = (processes, time) => {
        if(time === "startTime"){
            return processes.sort((a, b) => {
                return b.startTime - a.startTime;
            });
        }
        else if (time === "endTime"){
            return processes.sort((a, b) => {
                if(a.endTime === null && b.endTime === null) {
                    return a.startTime - b.startTime;
                }
                else if(a.endTime === null){
                    return 1;
                }
                else if(b.endTime === null){
                    return -1;
                }
                return b.endTime - a.endTime;
            });
        }
    }

    const sortProcessesByType = (processes) => {
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
        const process = getProcessLocal(processId);

        StopMinerProcess(process.hostname, process.processId).then((response) => {
            setProcessKeyLocalAsync(processId, "status", "stopped");
        }).catch((error) => {
            console.log(error);
        });
    }
    const pauseProcess = (processId) => {
        console.log(`pausing process: ${processId}`);
    }
    const resumeProcess = (processId) => {
        console.log(`resuming process: ${processId}`);
    }

    const deleteProcess = (processId) => {
        removeProcessLocal(processId);
        forceUpdate();
    }

    return (
        <BackdropModal closeModal = {toggleProcessOverviewPopupOpen}>
            <Popup
                closePopup = {toggleProcessOverviewPopupOpen}
                title = {`Process Overview`}
                showFooter = {false}
            >
                {<div className='ProcessOverviewPopup-sorting-container'>
                    <Dropdown
                        options = {sortingOptions}
                        onValueChange = {onSortingDropdownValueChange}
                        label = {`Sort By:`}
                        value = {selectedSorting}
                        labelPosition = {"left"}
                    />
                </div>}
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
                                    deleteProcess = {deleteProcess}
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
            </Popup>
        </BackdropModal>
    );
}

export default ProcessOverviewPopup;
