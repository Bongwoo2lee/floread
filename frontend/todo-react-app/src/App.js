import React, { useState, useEffect } from 'react';
import { call, signout } from "./service/ApiService";
import { color, height } from '@mui/system';
import { Link } from 'react-router-dom';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [titles, setTitles] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [bookData, setBookData] = useState('');
  const [user, setUser] = useState({ loggedIn: false });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [isBarOpen, setIsBarOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  
  return (
    <div>
    <div>
    <nav style={{ backgroundColor:'rgba(255, 244, 233)', top: 0, height: '80px' }}>
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
      <div>
        <p style={{ fontSize: '6.5em' }}>Floread</p>
        <p style={{ lineHeight: '0px' }}>Music stuck on the bookshelf</p>
        <p style={{ color: 'rgba(255, 244, 233)', fontSize: '3em', fontFamily: 'Gothic A1, san-serif' }}>
      <b>당신의 독서를 돕는 음악과 함께 하세요</b>
    </p>
      </div>
    </div>
  </div>
  );
}

export default App;
