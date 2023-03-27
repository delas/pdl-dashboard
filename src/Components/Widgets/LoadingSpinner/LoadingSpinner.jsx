import ClipLoader from "react-spinners/ClipLoader";
import './LoadingSpinner.scss';
// import {useState, useEffect, CSSProperties} from 'react';


function LoadingSpinner (props) {

    const {
        loading,
    } = props;

    if(!loading){
        return <></>
    }

    return (
        <div className='loading-spinner'>
            <ClipLoader color="#990000" />
        </div>
    );
}

export default LoadingSpinner;