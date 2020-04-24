import React, { useState } from "react";
import { Container, Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';

const ChangePassword = ({ showChangePassword }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [error, setError] = useState('')

    const handleCreateAccount = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({ email, password, newPassword })
        };

        fetch('https://virus-backend.herokuapp.com/change_password', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data === 'success') {
                    showChangePassword(false);
                } else {
                    setError(data.message)
                }
            })
    };

    return (
        <Container style={{margin: 50}}>
            <Button style={{marginBottom: 50}} color='primary' onClick={() => showChangePassword(false)}><h4>Back</h4></Button>
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
                    <Input invalid={error !== ''}type="password" name="newPassword" id="newPassword" placeholder="New Password" onChange={e => setNewPassword(e.target.value)} />
                    <FormFeedback>{error}</FormFeedback>
                </FormGroup>
                <Button color='primary' onClick={ev => handleCreateAccount()}>Change Password</Button>
            </Form>
        </Container>       
    );
}

export default ChangePassword;