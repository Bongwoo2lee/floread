import { Grid, TextField, Typography, Container, Button } from "@mui/material";
import React from "react";
import { music, signin, socialLogin } from "./service/ApiService";
import { Link } from "react-router-dom";
//로그인 
function Login() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const username = data.get("username");
        const password = data.get("password");

        //apiService signin을 사용
        signin({ username: username, password: password});
    };

    const handleSocialLogin = (provider) => {
        //console.log(provider);
        socialLogin(provider);
    }

    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography component="h1" variant="h5">
                        로그인
                    </Typography>
                </Grid>
            </Grid>
        <form noValidate onSubmit={handleSubmit}>
            {" "}
            {/* submit 버튼을 누르면 handleSubmit이 실행됨 */}
            <Grid container>
                {/* <Grid item xs={12}>
                    <Button onClick={() => music()}>
                        임시 노래
                    </Button>
                </Grid> */}
                <Grid item xs={6}>
                    <Button onClick={() => handleSocialLogin("google")} fullWidth variant="contained" style={{backgroundColor: '#FFF', color:'#000' }}>
                        google
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={() => handleSocialLogin("naver")} fullWidth variant="contained" style={{backgroundColor: '#03c75b' }}>
                        naver
                    </Button>
                </Grid>
                </Grid>
        </form>
        </Container>
    );
};

export default Login;