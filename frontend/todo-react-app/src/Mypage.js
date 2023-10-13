import { Grid, TextField, Typography, Container, Button } from "@mui/material";
import React from "react";
import { music, signin, socialLogin } from "./service/ApiService";
import { Link } from 'react-router-dom';

function Mypage() {

    return(
        <div>
        <nav style={{ backgroundColor: 'white', top: 0, height: '80px' }}>
        <ul style={{ position: 'fixed'}}>
          <div>
            <div style={{ position: 'fixed', left: '15px' }}>
              <Link style={{ textDecoration: 'none', color: 'black', background: 'none', fontSize: '2.8em', border: 'none', fontFamily: 'Georgia' }} to = "/">Floread</Link>
            </div>
            <div style={{ position: 'fixed', right: '55px',padding: '10px' }}>
              <Link style={{ textDecoration: 'none', color: 'black', background: 'none', fontSize: '1.2em', border: 'none' }} to = "/login">Login</Link>
            </div>
            <div style={{ position: 'fixed', right: '355px' ,padding: '10px'}}>
              <Link style={{ textDecoration: 'none', color: 'black', background: 'none', fontSize: '1.2em', border: 'none' }} to = "/upload">Upload</Link>
            </div>
            <div style={{ position: 'fixed', right: '255px' ,padding: '10px'}}>
              <Link style={{ textDecoration: 'none', color: 'black', background: 'none', fontSize: '1.2em', border: 'none' }}to = "/viewer">Viewer</Link>
            </div>
            <div style={{position: 'fixed', right: '155px' ,padding: '10px'}}>
              <Link style={{ textDecoration: 'none', color: 'black', background: 'none', fontSize: '1.2em', border: 'none' }}to = "/mypage">Mypage</Link>
            </div>
          </div>
        </ul>
      </nav>
      </div>
    );
};

export default Mypage;