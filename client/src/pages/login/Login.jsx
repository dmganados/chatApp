import React from "react";
import { Form, Button, Container, Card, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function Login() {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// Create a side effect that will make the page reactive.
	let dns = email.search('.com')
	let addressSign = email.search('@')
	const [isActive, setIsActive] = useState(false);

	// Create a logic/condition that will evaluate the format of the email.
	useEffect(() => {
		if (dns !== -1 && addressSign !== -1 && password !== '') {
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	},[email, password, addressSign, dns])

	// Create an effect hook to redict the usert to chat page. Current user can only access chat and profile page if logged in.
	useEffect(() => {
		if(localStorage.getItem('accessToken')) {
			window.location.href = "/chat";
		}
	})
	
	// User will be asked for credentials to log in.
	const loginUser = async (event) => {
		event.preventDefault();

		fetch('http://localhost:4000/user/login', {
			method: 'POST',
			headers: {
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify({
				email : email,
				password : password
			})
		}).then(res => res.json()).then(data => {			
			let token = data.accessToken;

			// Create a control structure to give a proper response to the user 
			if (typeof token !== 'undefined') {
				localStorage.setItem('accessToken' ,token);

				fetch('http://localhost:4000/user/profile', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}).then(res => res.json()).then(convertedData => {
					if (typeof convertedData._id !== "undefined") {
						window.location.href = "/chat";						
					} else {
						return null
					}
				})				
			} else {
				alert("Oops... Your email or password is incorrect")
			}
		})
	};

  return (	
    <>
      <Container>
        <Form id="lgnForm" onSubmit={e => loginUser(e)}>
			<Row>
			<Card id="lgnCard">
          	<Form.Group className="lgnGroup">
            	<Form.Label className="lgnLabel">Email:</Form.Label>
            	<Form.Control className="textArea" type="email" placeholder="Enter Email Here" required value={email} onChange={event => {setEmail(event.target.value)}} />
          	</Form.Group>

          	<Form.Group className="lgnGroup">
				<Form.Label className="lgnLabel">Password:</Form.Label>
				<Form.Control className="textArea" type="password" placeholder="Enter Password Here" required value={password} onChange={e => {setPassword(e.target.value)}} />
			</Form.Group>
					
			{
				isActive ?
				<Button className="loginBtn" variant="success" type="submit">Login</Button>
				:
				<Button className="loginBtn" variant="success" type="submit" disabled>Login</Button>
			}
			<span className="regStament">No account? <Link to="/" className="regLink">Register</Link></span>
			</Card>		
			</Row>							
        </Form>
      </Container>	  
    </>
  )
}

export default Login;