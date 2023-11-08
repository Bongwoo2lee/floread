import React from 'react';
import { Link } from 'react-router-dom';

function App() {
  const access_token = localStorage.getItem('ACCESS_TOKEN');

  return (
    <div>
      <div>
        <nav style={{ backgroundColor: 'rgba(255, 244, 233)', top: 0, height: '80px' }}>
          <ul style={{ position: 'fixed' }}>
            <div>
              <div style={{ position: 'fixed', left: '55px' }}>
                <Link style={{ textDecoration: 'none', color: 'black', background: 'none', fontSize: '2.8em', border: 'none', fontFamily: 'Georgia' }} to="/">Floread</Link>
              </div>
              <div style={{ position: 'fixed', right: '55px', padding: '10px' }}>
                {access_token ? (
                  <Link style={{ textDecoration: 'none', color: 'black', background: 'none', fontSize: '1.2em', border: 'none' }} to="/logout">Logout</Link>
                ) : (
                  <Link style={{ textDecoration: 'none', color: 'black', background: 'none', fontSize: '1.2em', border: 'none' }} to="/login">Login</Link>
                )}
              </div>
              <div style={{ position: 'fixed', right: '255px', padding: '10px' }}>
                <Link style={{ textDecoration: 'none', color: 'black', background: 'none', fontSize: '1.2em', border: 'none' }} to="/upload">Upload</Link>
              </div>
              <div style={{ position: 'fixed', right: '155px', padding: '10px' }}>
                <Link style={{ textDecoration: 'none', color: 'black', background: 'none', fontSize: '1.2em', border: 'none' }} to="/viewer">Viewer</Link>
              </div>
            </div>
          </ul>
        </nav>
        <div style={{  display: 'flex',  flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh'}}>
          <p style={{ color: 'rgb(255, 244,233)', fontFamily: 'Georgia, serif', textAlign: 'center', fontSize: '6.5em',marginTop:'0' }}>Floread</p>
        <div className='text-container'>
          <div className='animated-text'>
          <p style={{ color: 'rgb(255, 244,233)', textAlign: 'center', fontSize: '3em', fontFamily: 'Gothic A1, san-serif' ,marginTop:'0'}}>
            <b>당신의 독서를 돕는 음악과 함께 하세요</b>
          </p>
         </div>
         <p style={{ color:'rgb(255, 244,233)', fontFamily: 'Georgia, serif',textAlign: 'center',lineHeight: '0px' }}>Music stuck on the bookshelf</p>
         </div>
         </div>
         </div>
        </div>
  );
}

export default App;
