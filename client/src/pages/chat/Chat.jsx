import React, { useState, useEffect, useRef} from "react";
import { Form, Button, Card, Tab, Nav, Navbar, NavDropdown, Modal } from 'react-bootstrap';
import Contacts from '../../components/contacts/Contacts';
import Chatbox from '../../components/chat/Chatbox';
import Chatroom from '../../components/chat/Chatroom'
import ChatBanner from "../../components/chat/Chatbanner";
import ReactScrollableFeed from 'react-scrollable-feed';
import {io} from "socket.io-client"


export default function Chat() {

  const [contactsCollection, setContactsCollection] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState([]);
  const [isFilled, setIsFilled] = useState(false);
  const [show, setShow] = useState(false);
  const [isActive, setIsActive] = useState(false);
  let convoId = currentChat?._id;
  let token = localStorage.accessToken;
  let userName = `${currentUser.firstName} ${currentUser.lastName}`;
  const socket = useRef();

  useEffect(() => {    
    profile();
    allUsers();    
    redirect();
  },[])


  // The user will be sent back to login page if he tries to access chat page without loging in. 
  const redirect = () => {
    if (!token) {
      window.location.href ="/chatApp/login"
    }
  }

  // Get the user profile
  const profile = async () => { 
    try {
      await fetch('https://chat-server-ohlw.onrender.com/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json()).then(data => {  
      setCurrentUser(data)
      
      // Once you get the profile get the id to use as a reference of all its conversations
      let id = data._id;
      fetch(`https://chat-server-ohlw.onrender.com/conversations/connect/${id}`).then(res => res.json()).then(connect => {
        setConversation(connect)
      })
    })
    } catch (error) {
      console.log(error)
    }    
  }

  // Get all the all the users info to use as contacts 
  const allUsers = async () => {
    try {
      await fetch('https://chat-server-ohlw.onrender.com/user/all-users').then(res => res.json()).then(contactsData => {
      setContactsCollection(contactsData.map(contactList => {   
        let user = currentUser._id
        return(
          <Contacts key={contactList._id} contactsProp={contactList} currentUser={user} socket={socket} />                  
        )
      }));
    });
    } catch (error) {
      console.log(error)
    }
  }

  //  Create a section for all chat interactions of the user
  useEffect(() => {
    const getMessage = async () => {    
      try {
        await fetch(`https://chat-server-ohlw.onrender.com/message/messages/${convoId}`).then(res => res.json()).then(data => {
        setChat(data)
      })
      } catch (error) {
        console.log(error)
      }      
    } 
    getMessage()
  },[convoId])

  // Create a function that a user could not see messages to a deactivated account.
  useEffect(() => {
      let frndId = currentChat?.users.find(mate => mate !== currentUser._id);
      let getUser = async () => {
        if (frndId !== undefined) {
          await fetch(`https://chat-server-ohlw.onrender.com/user/profile/${frndId}`).then(res => res.json()).then(friend => {
              setIsActive(friend)
          });
        } else {
          return false
        }
      } 
    getUser();
  })

  // Integrate the websocket for real time chat
  useEffect(() => {
    socket.current = io("https://chat-server-ohlw.onrender.com/");
    socket.current.emit("addUser", currentUser._id); 
    // This is just to check if socket.io connection is successful
    // socket.current.on("getUsers", users => {console.log(users)})    
  },[currentUser])

  // Create send handler
  // After the user enters/submit his/her message, a new message will be created.
  const handleSendChat = async (event) => { 
    event.preventDefault() 
    if(currentChat){
      await fetch(`https://chat-server-ohlw.onrender.com/message/messages/${currentUser._id}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversationId: convoId,
        message: message
      })
    }).then(res => res.json()).then(sent => {      
      if (sent) {    
        setMessage('')
      } else {
        return false
      }
    })
    }    
    // After the send button is triggered the message will be sent to the server
    let receiver = currentChat?.users.find(mate => mate !== currentUser._id);
    socket.current.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId: receiver,
      message: message,
    })

    const msg = [...chat];
    msg.push({sender: currentUser._id, message: message})
    setChat(msg)
    }

  // This will catch the message sent by the sender
  useEffect(() => {
    socket.current.on("messageReceive", (data) => {
      setArrivalMessage({
        receiverId: data.receiverId,
        message: data.message,
        createdAt: Date.now(),
      })
    })
  },[socket.current])

  // The new message will be push to the chat hook which handles all the messages
  useEffect(() => {
    arrivalMessage && setChat((prev) => [...prev, arrivalMessage]);
  },[arrivalMessage]);

  // Send button will show if text area is filled
  useEffect(() => {
    if (message !== "") {
      setIsFilled(true)
    } else {
      setIsFilled(false)
    }
  },[message])

  // Create a logout function and redirect the user to login page if successfully loged out
  const logout = () => {
    localStorage.clear();
    window.location.href="/chatApp/login";
  }

  // Show modal. This will only display for small screen 
  const handleShow = () => {
    setShow(true);
  }

  // Close modal. This will only display for small screen 
  const handleClose = () => {
    setShow(false);
  }

  return(
    <div>
    <div className="largeScrn">        
        <Navbar className="topCard">
          <Navbar.Collapse className="navItems">
          <NavDropdown title={userName} className="navigation">
            <NavDropdown.Item href="/chatApp/profile">Profile</NavDropdown.Item>
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown >
          </Navbar.Collapse>
        </Navbar>
        <div className="bannerContainer">
          {
            // If there is no friend selected, the name will not be diplayed in the banner.
            currentChat?          
              <>
                <Card.Body className="bannerBody">
                  <ChatBanner activeChat={currentChat?.users} myId={currentUser._id} />
                </Card.Body>
              </>
            :
              <></>
          }
        </div>
       
      <Card className="leftSection">
        <Tab.Container defaultActiveKey="first">          
              <Nav className="menu">
                <Nav.Item id="chat" >
                  <Nav.Link eventKey="first" className="chatLink" >Chat</Nav.Link>
                </Nav.Item>
                <Nav.Item  id="contacts" >
                  <Nav.Link eventKey="second" className="chatLink" >Contacts</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content className="overflow-auto tabContent">
                <Tab.Pane eventKey="first">
                {conversation.map((c) => (    
                  <div className="chatRoom" onClick={() => setCurrentChat(c)} >              
                  <Chatroom conversation={c} currentUser={currentUser._id} />   
                  </div>               
                ))}
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                    {contactsCollection}
                </Tab.Pane>
                
              </Tab.Content>                       
        </Tab.Container>
      </Card>
      {/* Create section for the chatbox. 
      In this section, the user can see the name of his friend, can write message, send, edit and delete message */}
      
        <Card className="overflow-auto  chatbox">
          <>
          {          
            currentChat?
              <ReactScrollableFeed className="chatDiv">                             
                {chat.map((convo) =>(                       
                    <Chatbox chat={convo} ownMsg={convo.sender === currentUser._id} socket={socket} currentUser={currentUser._id} conversationId={convoId} socketIO={socket} />                   
                ))}               
                
              </ReactScrollableFeed>                       
            :              
              <span className="noConvo">Select a person to start a conversation</span>              
          }   
          </>
        </Card>

          {/* Text area and send button */}
      
        <Card className="buttonCard">
          {
            currentChat?
              <>
              {
                isActive?
                <Form onSubmit={handleSendChat} className="txtareaForm">
                <Form.Group className="textGrp">
                  <Form.Control
                  type="text"                
                  placeholder="Write something..." 
                  value={message}
                  onChange={event => setMessage(event.target.value)}
                  className="textarea"
                  />
                </Form.Group>
                <>
                {
                  isFilled?
                  <Button  type="submit" className="sndBtn" >Send</Button>
                  :
                  <Button  disabled className="sndBtn" >Send</Button>
                }                
                </>
              </Form>
                :
                <></>
              }
              
              </>
            :
              <></>
          }
          </Card> 
    </div>

    {/* Small Screen */}
    <div className="smallScreen">  
        <Navbar className="smtopCard">
          <Navbar.Collapse className="smnavItems">
          <NavDropdown title={userName} className="smnavigation">
            <NavDropdown.Item href="/chatApp/profile">Profile</NavDropdown.Item>
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown >
          </Navbar.Collapse>
        </Navbar>    
      <Card className="smleftSection">
        <Tab.Container className="smtabContainer" defaultActiveKey="first">          
              <Nav className="smmenu">
                <Nav.Item id="smchat" >
                  <Nav.Link eventKey="first" className="smchatLink" >Chat</Nav.Link>
                </Nav.Item>
                <Nav.Item id="smcontacts" >
                  <Nav.Link eventKey="second" className="smchatLink" >Contacts</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content className="overflow-auto smtabContent">
                <Tab.Pane eventKey="first">
                {conversation.map((c) => (    
                  <div className="smchatRoom" onClick={() => {setCurrentChat(c); handleShow()}} >              
                  <Chatroom conversation={c} currentUser={currentUser._id} />   
                  </div>               
                ))}
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                    {contactsCollection}
                </Tab.Pane>
              </Tab.Content>                       
        </Tab.Container>
      </Card>

      <Modal show={show} backdrop="static" keyboard={false} animation={false} className="chatModal" >
              <Modal.Header>
                  <Modal.Title>
                    <div className="smbnrContainer">
                    {
                      // If there is no friend selected, the name will not be diplayed in the banner.
                      currentChat?     
                      <Card.Body className="smbannerBody">     
                            <ChatBanner activeChat={currentChat?.users} myId={currentUser._id} />
                      </Card.Body>
                      :
                      <></>
                    }
                    </div>
                  </Modal.Title>
                  <span className="modalClose" variant="secondary" onClick={handleClose}>&larr;</span>
              </Modal.Header>
                  
                  <Modal.Body className="modalBody" >
                  {          
                    currentChat?
                      <ReactScrollableFeed className="smchatDiv">                             
                        {chat.map((convo) =>(                       
                            <Chatbox chat={convo} ownMsg={convo.sender === currentUser._id} socket={socket} currentUser={currentUser._id} conversationId={convoId} socketIO={socket} />                   
                        ))}               
                        
                      </ReactScrollableFeed>                       
                    :              
                      <></>             
                  }   
                  </Modal.Body>
                  <>
                  <Card className="smbuttonCard">
                  {
                    currentChat?
                      <>
                      {
                        isActive?
                        <Form onSubmit={handleSendChat} className="smtxtareaForm">
                        <Form.Group className="smtextGrp">
                          <Form.Control
                          type="text"                
                          placeholder="Write something..." 
                          value={message}
                          onChange={event => setMessage(event.target.value)}
                          className="smtextarea"
                          />
                        </Form.Group>
                        <>
                        {
                          isFilled?
                          <Button  type="submit" className="smsndBtn" >Send</Button>
                          :
                          <Button className="smsndBtn" disabled >Send</Button>
                        }                
                        </>
                      </Form>
                        :
                        <></>
                      }
                      
                      </>
                    :
                      <></>
                  }
                  </Card>
                  </>
      </Modal>  
    </div>
    </div>
  )
}
