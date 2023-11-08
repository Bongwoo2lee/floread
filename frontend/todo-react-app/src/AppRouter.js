import React from "react";
import "./index.css";
import App from "./App";
import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import SocialLogin from "./SocialLogin";
import Upload from "./Upload";
import Viewer from "./Viewer";
import Logout from "./Logout";
import ReadBook from "./ReadBook";

function Copyright() {
    return (
        <Typography variant="body2" style={{ color: 'white', position: 'absolute', textAlign: 'center', bottom: '30px', left:'50%',transform:'translateX(-50%)'}}>
            {"Copyright ⓒ "}
            floread, {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

function AppRouter() {

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="login" element={<Login />} />
                    <Route path="sociallogin" element={<SocialLogin />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="viewer" element={<Viewer />} />
                    <Route path="logout" element={<Logout />} />
                    <Route path="book/:title" element={<ReadBook />} />
                </Routes>
            </BrowserRouter>
            <Box mt={5}>
                <Copyright />
            </Box>
        </div>
    );
};

export default AppRouter;