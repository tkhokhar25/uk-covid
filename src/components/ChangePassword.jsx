import React, { useState } from "react";
import { Container, Form, FormGroup, Label, Input, Button, FormFeedback, Spinner } from 'reactstrap';

const ChangePassword = ({ showChangePassword }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);

    const handleCreateAccount = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            body: JSON.stringify({ email, password, newPassword })
        };

        setLoading(true);

        fetch('https://virus-backend.herokuapp.com/change_password', requestOptions)
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                if (data === 'success') {
                    showChangePassword(false);
                } else {
                    setError(data.message)
                }
            })
    };

    return (
        <Container style={{margin: 50}}>
            {loading ? <div><Spinner color="primary" /></div> :
            <div>
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
            </div>
            }
        </Container>       
    );
}

export default ChangePassword;