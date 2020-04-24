import React, { useState } from "react";
import { Container, Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import ForgotPassword from "./ForgotPassword.jsx";

const Login = ( { showLogin, setLoggedIn } ) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [displayForgotPassword, setDisplayForgotPassword] = useState(false);

    const handleLogin = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({ email, password })
        };

        fetch('https://virus-backend.herokuapp.com/login', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    showLogin(false);
                    setLoggedIn(true);
                } else {
                    setError(data.message)
                }
            })
    };

    return (
        <Container style={{margin: 50}}>
            {displayForgotPassword ? <ForgotPassword setDisplayForgotPassword={setDisplayForgotPassword} setLoggedIn={setLoggedIn} showLogin={showLogin} /> :
            <div>
                <Button style={{marginBottom: 50}} color='primary' onClick={() => showLogin(false)}><h4>Back</h4></Button>
                <Form>
                    <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Input type="email" name="email" id="exampleEmail" placeholder="example@example.com" onChange={e => setEmail(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <Input invalid={error !== ''} type="password" name="password" id="examplePassword" placeholder="password" onChange={e => setPassword(e.target.value)} />
                        <FormFeedback>{error}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Button color='primary' onClick={ev => handleLogin()}>Login</Button>
                    </FormGroup>
                    <FormGroup>
                        <Button color='primary' onClick={ev => setDisplayForgotPassword(true)}>Forgot Password</Button>
                    </FormGroup>
                </Form>
            </div>
            }
        </Container>
    );
};

export default Login;