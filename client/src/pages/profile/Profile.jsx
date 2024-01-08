import React, { useEffect, useState } from 'react';
import { Container, Navbar, NavDropdown, Modal, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Profile() {
    const [currentUser, setCurrentUser] = useState([]);
    const [openModal, setOpenModal] = useState(false)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isModalFille, setIsModalFilled] = useState(false);
    let token = localStorage.accessToken;
    let userName = `${currentUser.firstName} ${currentUser.lastName}`;

    useEffect(() => {
        profile();
    })

    // Get the current user's information to display in the profile page, and the user's name will also be placed at the banner.
    const profile = async () => { 
        try {
          await fetch('http://localhost:4000/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(res => res.json()).then(data => {  
          setCurrentUser(data)
        })
        } catch (error) {
          console.log(error)
        }    
      }

    // Event handler for the the logout function. User will be redirected to  login page after log out.
    const logout = () => {
        localStorage.clear();
        window.location.href="/chatApp/login";
      }

      // Create modal where the user can edit his profile
    const showModal = async () => {
      setOpenModal(true)
    }
    const closeModal = async () => {
      setOpenModal(false)
    }

    // Event handler for edit button.
    const editProfile = async () => {
      await fetch(`http://localhost:4000/user/profile/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName
        })
      }).then(res => res.json()).then(newUpdate => {
        if(newUpdate) {
          alert("Your profile information is successfully updated.")
        }
        window.location.href="/chatApp/profile"
      })
    }

    // Event handler for delete option.
    const deactProfile = async () => {
      if (window.confirm("Are you sure you want to delete your account? You won't be able to revert this!")) {
        alert("You clicked OK");
        await fetch(`http://localhost:4000/user/profile/delete/${currentUser._id}`, {
            method: 'DELETE'
          })
        localStorage.clear();
        window.location.href="/chatApp/login"
      } else {
        alert("You clicked Cancel");
      }
    }

    // useEffect hook for the form to update the customer informaton. 
    useEffect(() => {
      if (firstName !== '' && lastName !== '') {
        setIsModalFilled(true)
      } else {
        setIsModalFilled(false)
      }
    }, [firstName, lastName])

    return(
      <>
      {/* Large Screen */}
      <Container className='prflCntainer'>
        
        <Navbar className="pfltopCard">
          <Navbar.Collapse className="navItems">
          <NavDropdown title={userName} className="navigation">
            <NavDropdown.Item href="chatApp/profile">Profile</NavDropdown.Item>
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown >
          </Navbar.Collapse>
        </Navbar>

        <Link className='returnArrow' to="/chatApp/chat" >&larr;</Link><span className='returnChat'>Return to Chat</span>
        <div className='profileCard'>
            <span className='accntOwner'>Account Owner: <h3>{userName}</h3></span>
            <span className='email'>Email: <h4>{currentUser.email}</h4></span>
        </div>
        <div className='accFunction'>
          <Button className='edit' onClick={(e) => showModal(e)}>Edit Info</Button>
          <Button className='delete' onClick={(e) => deactProfile(e)} >Delete Account</Button>
        </div>
        
      </Container>

      <Modal show={openModal} className="profileModal">
        <Modal.Body className="editModal">
          <Form>
            <Form.Group className='modalGrp'>
              <Form.Label className='namesModal'>First Name</Form.Label>
              <Form.Control type='text' placeholder='e.g, Tom' required value={firstName} onChange={e => setFirstName(e.target.value)} />
              <Form.Label className='namesModal'>Last Name</Form.Label>
              <Form.Control type='text' placeholder='e.g, Holland' required value={lastName} onChange={e => setLastName(e.target.value)} />
            </Form.Group>
          </Form>
          <Button className='cancel' variant='success' onClick={closeModal}>Cancel</Button>
          {
            isModalFille ?
            <Button className='save' variant='success' onClick={(e) => editProfile(e)}>Save</Button>
            :
            <Button className='save' variant='success'  disabled>Save</Button>

          }
          
        </Modal.Body>
      </Modal>      

      {/* Small Screen */}
      <Container className='smprflCntainer'>
        
        <Navbar className="smpfltopCard">
          <Navbar.Collapse className="smnavItems">
          <NavDropdown title={userName} className="smnavigation">
            <NavDropdown.Item href="/chatApp/profile">Profile</NavDropdown.Item>
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown >
          </Navbar.Collapse>
        </Navbar>

        <Link className='smreturnArrow' to="/chatApp/chat" >&larr;</Link><span className='smreturnChat'>Return to Chat</span>
        <div className='smprofileCard'>
            <span className='smaccntOwner'>Account Owner: <h3>{userName}</h3></span>
            <span className='smemail'>Email: <h4>{currentUser.email}</h4></span>
        </div>
        <div className='smaccFunction'>
          <Button className='smedit' onClick={(e) => showModal(e)}>Edit Info</Button>
          <Button className='smdelete' onClick={(e) => deactProfile(e)} >Delete Account</Button>
        </div>
        
      </Container>

      <Modal show={openModal} className="smprofileModal">
        <Modal.Body className="editModal">
          <Form>
            <Form.Group className='modalGrp'>
              <Form.Label className='namesModal'>First Name</Form.Label>
              <Form.Control type='text' placeholder='e.g, Tom' required value={firstName} onChange={e => setFirstName(e.target.value)} />
              <Form.Label className='namesModal'>Last Name</Form.Label>
              <Form.Control type='text' placeholder='e.g, Holland' required value={lastName} onChange={e => setLastName(e.target.value)} />
            </Form.Group>
          </Form>
          <Button className='cancel' variant='success' onClick={closeModal}>Cancel</Button>
          {
            isModalFille ?
            <Button className='save' variant='success' onClick={(e) => editProfile(e)}>Save</Button>
            :
            <Button className='save' variant='success'  disabled>Save</Button>

          }
          
        </Modal.Body>
      </Modal>      
      </>
    )
}