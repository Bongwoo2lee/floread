import React from "react";
import "./index.css";
import App from "./App";
import Login from "./Login";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { Typography, Box} from "@mui/material";
import SocialLogin from "./SocialLogin";
import Mypage from "./Mypage";
import Upload from "./Upload";
import Viewer from "./Viewer";
    
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
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
                    <Route path="mypage" element={<Mypage />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="viewer" element={<Viewer />} />
                    
                </Routes>
            </BrowserRouter>
            <Box mt={5}>
                <Copyright />
            </Box>
        </div>
    );
};

export default AppRouter;