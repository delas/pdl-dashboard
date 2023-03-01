import './Home.scss';
import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";

function Home(props) {
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    });

    if(isLoading){
        return (
            <div className="Home">
                <div>Loading ...</div>
            </div>
        )
    }

    return (
        <div className="Home">
            <Link to="/Page1">
                <div>Hello world from home page</div>
            </Link>
        </div>
    );
}

export default Home;
