import {
    VStack, 
    ButtonGroup,  
    Button, 
    Heading,
    Text

} from "@chakra-ui/react"

import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextField from "./TextField";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Helmet } from 'react-helmet';
const SignUp = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
        
    return (
        <div>
            <Helmet>
            <title>SignUp</title>
          <link rel="canonical" href="https://p2w.pro/register}/" />
        </Helmet>
        <Formik
            initialValues={{username: "", password: ""}}
            validationSchema={Yup.object({
                username: Yup.string()
                .required("Username required!")
                .min(1, "Username too short!")
                .max(28, "Username too long!"),
                password: Yup.string()
                .required("Password required!")
                .min(6, "Password too short!")
                .max(28, "Password too long!"),
            })}
            onSubmit={(values, actions) => {
                const vals = {...values}
                actions.resetForm();
                //fetch("http://localhost:4000/auth/signup", {
                fetch("https://p2w.pro/api/auth/signup/", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(vals),
                })
                .catch(err => {
                    return;
                })
                .then (res => {
                    if (!res || !res.ok || res.status >= 400){
                        return;
                    }
                    return res.json();
                })
                .then(data => {
                    if (!data) return;
                    if(data.status){
                        setError(data.status);
                    } else if (data.loggedIn) {
                        navigate("/");
                        window.location.reload();
                    };
                });
            }}
        >
            <VStack 
            as ={Form}
            w={{base: "90%", md: "500px"}} 
            m ="auto"
            justify="center"
            h="100vh"
            >
                <Heading>Sign Up</Heading>
            <Text as="p" color="red.500">
                {error}
            </Text>
            <TextField 
                name="username" 
                placeholder="Enter username" 
                autocomplete="off"
                label="Username"
            />
            <TextField 
                name="password" 
                placeholder="Enter password" 
                autocomplete="off"
                label="Password"
                type="password"
            />
                <ButtonGroup pt="lrem">
                    <Button colorScheme="teal" type="submit">Create Account</Button>
                    <Button  onClick={() => navigate("/login")}>Back</Button>
                </ButtonGroup>
            </VStack>  
        </Formik>
        <footer className='App-footer'>
        <p>© 2024 PAMYATKI TWO WEB</p>
      </footer>
      </div>
    );
};

export default SignUp;