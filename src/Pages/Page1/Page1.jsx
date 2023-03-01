import './Page1.scss';
import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";

function Page1(props) {
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    });

    if(isLoading){
        return (
            <div className="Page1">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className="Page1">
            <Link to="/">
                <div>Hello world from Page1 page</div>
            </Link>
        </div>
    );
}

export default Page1;
