import React, { useState } from "react";
import { Container, Form, FormGroup, Label, Input, Button, FormFeedback, Spinner } from 'reactstrap';
import { emailRe } from './Constants';

const CreateAccount = ( { setDisplayCreateAccount, setLoggedIn } ) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [verifyPassword, setVerifyPassword] = useState('')
    const [error, setError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [loading, setLoading] = useState(false);

    const handleCreateAccount = () => {
        if (email === '') {
            setEmailError("Empty Email");
            return
        }

        
        if (!emailRe.test(email)) {
            setEmailError("Invalid Email");
            return
        }

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
        setError('');

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({ email, password })
        };

        setLoading(true);

        fetch('https://virus-backend.herokuapp.com/create_account', requestOptions)
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                if (data.code === 200) {
                    setDisplayCreateAccount(false);
                    setLoggedIn(true);
                } else {
                    setError(data.message)
                }
            })
    };

    return (
        <Container style={{margin: 50}}>
            {loading ? <div><Spinner color="primary" /></div> :
            <div>
                <Button style={{marginBottom: 50}} color='primary' onClick={() => setDisplayCreateAccount(false)}><h4>Back</h4></Button>
                <Form>
                    <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Input invalid={emailError !== ''} type="email" name="email" id="exampleEmail" placeholder="example@example.com" onChange={e => setEmail(e.target.value)} />
                        <FormFeedback>{emailError}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <Input type="password" name="password" id="examplePassword" placeholder="password" onChange={e => setPassword(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="exampleVerifyPassword">Password</Label>
                        <Input invalid={error !== ''} type="password" name="verifyPassword" id="verifyPassword" placeholder="Verify Password" onChange={e => setVerifyPassword(e.target.value)} />
                        <FormFeedback>{error}</FormFeedback>
                    </FormGroup>
                    <Button color='primary' onClick={ev => handleCreateAccount()}>Create Account</Button>
                </Form>
            </div>
            }
        </Container>
    );
};

export default CreateAccount;