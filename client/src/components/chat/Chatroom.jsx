import { Card } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function Chatroom({conversation, currentUser}) {
    const [user, setUser] = useState(null);
    const [isActive, setIsActive] = useState(false);
    let friendId = conversation.users.find((user) => user !== currentUser);

    useEffect(() =>{ 
        let getUser = async () => {
            await fetch(`http://localhost:4000/user/profile/${friendId}`).then(res => res.json()).then(friend => {
                setUser(friend)
            });
        };
        getUser();
    },[friendId])

    useEffect(() => {
        if (user !== false) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    },[user])

    return(
        <>        
        {/*Large Screen  */}
        <Card id="chtRmDiv">  
        {
            isActive?
            <Card.Body className="chtRmCard">
            {user?.firstName} {user?.lastName}
            </Card.Body>
            :
            <Card.Body className="chtRmCard">
                <i style={{backgroundColor: 'whitesmoke'}}>This person has deactivated</i>
            </Card.Body>
        }
                 
        </Card>       

        {/* Small Screen */}
        {
            isActive?
            <Card id="smchtRmDiv">  
            <Card.Body className="smchtRmCard">
            {user?.firstName} {user?.lastName}
            </Card.Body>      
            </Card>
            :
            <Card.Body className="smchtRmCard">
                <i style={{backgroundColor: 'whitesmoke'}}>This person has deactivated</i>
            </Card.Body>
        }

                 
        </>
    )
}