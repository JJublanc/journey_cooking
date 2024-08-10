import {useEffect, useState} from "react";
import JourneyTable from "./JourneyTable";
import useAuth from "../../hooks/useAuth";
const JourneyList = () => {
    const [journeys, setJourneys] =  useState([]);
    const user = useAuth().user;
    const [currentUser, setCurrentUser] = useState(user);

    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/journey/user_journeys/` + currentUser.email, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + currentUser.token,
            },
        })
            .then(response => response.json())
            .then(
                data => {
                    console.log(data);
                    setJourneys(data);
                }
            )
            .catch(error => {
                console.error('An error occurred while fetching the journeys:', error);
                setJourneys([]);
            });
    }, []);

    return (
        <JourneyTable journeyList={journeys}/>
    );
}

export default JourneyList;
