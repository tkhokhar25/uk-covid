import React, { useState } from "react";
import { Container, Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';

const CreateAccount = ( { setDisplayCreateAccount, setLoggedIn } ) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [verifyPassword, setVerifyPassword] = useState('')
    const [error, setError] = useState('')

    const handleCreateAccount = () => {
        if (password !== verifyPassword) {
            setError("Passwords don't match");
            console.log('cakked')
            return
        }
        setError('');

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({ email, password })
        };

        fetch('https://virus-backend.herokuapp.com/create_account', requestOptions)
            .then(response => response.json())
            .then(data => {
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
            <Button style={{marginBottom: 50}} color='primary' onClick={() => setDisplayCreateAccount(false)}><h4>Back</h4></Button>
            <Form>
                <FormGroup>
                    <Label for="exampleEmail">Email</Label>
                    <Input type="email" name="email" id="exampleEmail" placeholder="example@example.com" onChange={e => setEmail(e.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label for="examplePassword">Password</Label>
                    <Input type="password" name="password" id="examplePassword" placeholder="password" onChange={e => setPassword(e.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label for="exampleVerifyPassword">Password</Label>
                    <Input invalid={error !== ''}type="password" name="verifyPassword" id="verifyPassword" placeholder="Verify Password" onChange={e => setVerifyPassword(e.target.value)} />
                    <FormFeedback>{error}</FormFeedback>
                </FormGroup>
                <Button color='primary' onClick={ev => handleCreateAccount()}>Create Account</Button>
            </Form>
        </Container>
    );
};

export default CreateAccount;