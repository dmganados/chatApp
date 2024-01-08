import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function ChatBanner({activeChat, myId}) {
    // Get id of the friend, then get its profile information to diplay the name 
    const [currentChat, setCurrentChat] = useState(null)
    let friendId = activeChat?.find((f) => f !== myId)

    useEffect(() =>{ 
        let getUser = async () => {
            fetch(`http://localhost:4000/user/profile/${friendId}`).then(res => res.json()).then(friend => {
                setCurrentChat(friend)
            });
        };       
        getUser();
    },[friendId])

    return(
        <>
            <div className="lgbanner"><span className="fullName">{currentChat?.firstName} {currentChat?.lastName}</span></div>
            <div className="smbanner">
                <Container>
                    <Row>
                        <Col style={{backgroundColor: "whitesmoke"}}>
                        <span className="d-flex justify-content-center smfullName">{currentChat?.firstName} {currentChat?.lastName}</span>
                        </Col>
                    </Row> 
                </Container>
            </div>
        </>
    )
}