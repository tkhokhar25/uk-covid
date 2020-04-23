import React, { useState } from "react";
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';

const ForgotPassword = ( { setDisplayForgotPassword, setLoggedIn } ) => {
    const [isCodeSent, setCodeSent] = useState(false);
    const [isVerify, setVerify] = useState(false);

    const handleVerificationCode = () => {
        setVerify(true);
    };

    const sendVerificationCode = () => {
        setCodeSent(true);
    };

    return (
        <Container style={{margin: 50}}>
            <Button style={{marginBottom: 50}} color='primary' onClick={() => setDisplayForgotPassword(false)}><h4>Back</h4></Button>
            {isVerify ?
            <div/>
            :
            isCodeSent ?
                <Form>
                    <FormGroup>
                        <Label for="code">A verification code has been sent.</Label>
                        <Input type="text" name="code" id="code" placeholder="Verification Code" />
                    </FormGroup>
                    <Button color='primary' onClick={ev => { ev.preventDefault(); handleVerificationCode() }}>Verify</Button>
                </Form>
                :
                <Form>
                    <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Input type="email" name="email" id="exampleEmail" placeholder="example@example.com" />
                    </FormGroup>
                    <Button color='primary' onClick={ev => { ev.preventDefault(); sendVerificationCode(); }}>Send Verification Code</Button>
                </Form>
            }
        </Container>
    );
};

export default ForgotPassword;