import { Button, Card } from "react-bootstrap"
import {useState, useEffect} from 'react'

export default function Contacts({contactsProp, socket}) {
    const [currentProfile, setCurrentProfile] = useState([]);
    let token = localStorage.accessToken;

    // Get the information of the current user.
    useEffect(() => {
        const currentUser = async () => {
            await fetch('http://localhost:4000/user/profile', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }).then(res => res.json()).then(data => {  
                setCurrentProfile(data)
            })   
          }
          currentUser()
    },[token])

    // Once a person is selected a connection will be created.
    const connectHandler = async() => {        
        await fetch(`http://localhost:4000/user/profile/${contactsProp._id}`).then(res => res.json()).then(profile => {
        let friendId = profile._id
        if (profile) {
            fetch(`http://localhost:4000/conversations/connect/${currentProfile._id}/${friendId}`,{
                method: "POST",
            }).then(res => res.json()).then(connect => {              
            })            
        } else {
            return false
        }    
        alert("A new connection is added.")
        window.location.href = "/chat";  
        })      
      }
    

    return(
        <>  
            {/* Large Screen */}
            <Card id='cntctsDiv' >     
                <Card.Body id="cntctCard">          
                    {contactsProp.firstName} {contactsProp.lastName}
                    <Button onClick={e => connectHandler(e)} className="connectBtn">Connect</Button>
                </Card.Body> 
            </Card>  

            {/* Small Screen */}
            <Card id='smcntctsDiv' >     
                <Card.Body id="smcntctCard">          
                    {contactsProp.firstName} {contactsProp.lastName}
                    <Button onClick={e => connectHandler(e)} className="connectBtn">Connect</Button>
                </Card.Body> 
            </Card>                
        </>
    )
}