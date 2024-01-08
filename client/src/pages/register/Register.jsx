import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {Container, Form, Button, Card, Row} from 'react-bootstrap';
import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";

function Register() {

  const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isCorrect, setIsCorrect]= useState(false);

  // Create conditions for the form. The Save button will be enabled if the conditions are true.
  useEffect(() => {
      if (password1 === password2 && password1 !=='' && password2 !== '') {
        setIsCorrect(true);
        if (firstName !=='' && lastName !=='' && email !== '') {          
          setIsActive(true);
        } else {          
          setIsActive(false);
        }
      } else {
        setIsCorrect(false)       
        setIsActive(false);
      }

  },[firstName, lastName, email, password1, password2])

  // All users who are logged in can't go to register page. Successful logins will be redirected to chatroom
  useEffect(() => {
		if(localStorage.getItem('accessToken')) {
			window.location.href = "/chat";
		}
	})

  // Event handler for register button. Once the user clicks this button after meeting all the conditions, an account will be created. 
  const registerUser = async (eventSubmit) => {
    eventSubmit.preventDefault()

    const isRegistered = fetch('http://localhost:4000/user/register', {      
			method: 'POST',			
			headers: {
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email,				
				password: password1,				
			})
    }).then(res => res.json()).then(resData => {
      console.log(resData)
      if (resData.email) {
        return true;
      } else {
        return false;
      }
    });

    if (isRegistered) {
      alert('Account has been created')

			setFirstName('');
			setLastName('');
			setEmail('');
			setPassword1('');
			setPassword2('');

			window.location.href = "/login";

		}else {
			alert('Please check your inputs')
		}	    
  }

  

  return (
    <>
     <Container className="regContainer">      
        <Form className="regForm" onSubmit={e => registerUser(e)}>   
        <Row>
        <Card id="regCard"> 
          <Form.Group className="regGroup">
            <Form.Label className="regLabel">First Name</Form.Label>
            <Form.Control className="textArea" type="text" placeholder="Enter your first name" required id="frstNmInput" value={firstName} onChange={e => setFirstName(e.target.value)} />
          </Form.Group>

          <Form.Group className="regGroup">
            <Form.Label className="regLabel">Last Name</Form.Label>
            <Form.Control className="textArea" type="text" placeholder="Enter your last name" required id="lstNmInput" value={lastName} onChange={e => setLastName(e.target.value)} />
          </Form.Group>

          <Form.Group className="regGroup">
            <Form.Label className="regLabel">Email</Form.Label>
            <Form.Control className="textArea" type="email" placeholder="Enter your email address" required id="emlInput" value={email} onChange={e => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group className="regGroup">
						<Form.Label className="regLabel">Password:</Form.Label>
						<Form.Control className="textArea" type="password" placeholder="Enter your password" required id="pssInput" value={password1} onChange={e => setPassword1(e.target.value)} />
					</Form.Group>

          <Form.Group className="regGroup">
						<Form.Label className="regLabel">Confirm password:</Form.Label>
						<Form.Control className="textArea" type="password" placeholder="Confirm your password" required id="cnfrmPssInput" value={password2} onChange={e => setPassword2(e.target.value)} />

            {
							isCorrect ?
							<span className="psswrdAlert">Passwords Matched!</span>
							:
							<span className="psswrdAlert">Passwords should match.</span>
						}
					</Form.Group>

          {
            isActive ?
              <Button variant="success" className="btn-block regBtn" type="submit">Register</Button>
            :
              <Button variant="success" className="btn-block regBtn" disabled>Register</Button>
          }
          <span id="lgnStatement">Already have an account? <Link to="/login" id="lgnLink">Login</Link> </span>
        </Card> 
        </Row> 
        </Form>               
     </Container>
    </>
  )
}

export default Register;