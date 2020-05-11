import React, { useState } from "react";
import { Container, Form, FormGroup, Label, Input, Button, FormFeedback, Spinner } from 'reactstrap';

import { emailRe } from './Constants';

const ForgotPassword = ( { setDisplayForgotPassword, setLoggedIn, showLogin } ) => {
    const [isCodeSent, setCodeSent] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('')
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('')
    const [verifyPassword, setVerifyPassword] = useState('')
    const [loading, setLoading] = useState(false);

    const handleVerificationCode = () => {
        if (password === '') {
            setError("Empty Password");
            return
        }
        
        if (password.length > 20) {
            setError("Password length cannot exceed 20 characters");
            return
        }

        if (password !== verifyPassword) {
            setError("Passwords don't match");
            return
        }

        if (password !== verifyPassword) {
            setError("Passwords don't match");
            return
        }
        setError('');

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({ email, code, password })
        };

        setLoading(true);

        fetch('https://virus-backend.herokuapp.com/verify_code', requestOptions)
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                if (data === 'success') {
                    setError('');
                    showLogin(false);
                    setLoggedIn(true);
                } else {
                    setError(data.message)
                }
            })
    };

    const sendVerificationCode = () => {

        if (email === '') {
            setEmailError("Empty Email");
            return
        }

        
        if (!emailRe.test(email)) {
            setEmailError("Invalid Email");
            return
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({ email })
        };

        setLoading(true);

        fetch('https://virus-backend.herokuapp.com/forgot_password', requestOptions)
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                if (data === 'success') {
                    setCodeSent(true);
                    setError('');
                } else {
                    setError(data.message)
                }
            })
    };

    return (
        <Container style={{margin: 50}}>
            {loading ? <div><Spinner color="primary" /></div> :
            <div>
            <Button style={{marginBottom: 50}} color='primary' onClick={() => setDisplayForgotPassword(false)}><h4>Back</h4></Button>
                <Form>
                {
                isCodeSent ?
                    <div>
                        <FormGroup>
                            <Label for="codeSent">A verification code has been sent.</Label>
                            <Input type="text" name="code" id="code" placeholder="Verification Code" onChange={e => setCode(e.target.value)} />
                            <Input type="password" name="password" id="password" placeholder="New Password" onChange={e => setPassword(e.target.value)} />
                            <Input invalid={error !== ''}type="password" name="verifyPassword" id="verifyPassword" placeholder="Verify Password" onChange={e => setVerifyPassword(e.target.value)} />
                            <FormFeedback>{error}</FormFeedback>
                        </FormGroup>
                        <Button color='primary' onClick={ev => { ev.preventDefault(); handleVerificationCode() }}>Submit</Button>
                    </div>
                        :
                    <div>
                        <FormGroup>
                            <Label for="exampleEmail">Email</Label>
                            <Input invalid={emailError !== ''} type="email" name="email" id="exampleEmail" placeholder="example@example.com" onChange={e => setEmail(e.target.value)} />
                            <FormFeedback>{emailError}</FormFeedback>
                        </FormGroup>
                        <Button color='primary' onClick={ev => { ev.preventDefault(); sendVerificationCode(); }}>Send Verification Code</Button>
                    </div>
                }
                </Form>
                </div>
                }
        </Container>
    );
};

export default ForgotPassword;