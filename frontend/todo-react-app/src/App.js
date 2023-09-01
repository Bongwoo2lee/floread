import React, { useState } from 'react';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const toggle = () => {
    setLoggedIn(!loggedIn);
  };

  const handleLoginClick = () => {
    toggle();
    window.open('http://floread.store:8000', '_blank', 'width=500,height=500');
  };

  return (
    <div style={{ backgroundColor: 'black' }}>
      <div style={{ float: 'right' }}>
        <button
          style={{ background: 'none' }}
          onClick={handleLoginClick}
        >
          <p style={{ lineHeight: 'normal' }}>log in</p>
        </button>
      </div>
      <div>
        <p style={{ lineHeight: '0px', fontSize: '6.5em' }}>Floread</p>
        <p style={{ lineHeight: '0px' }}>Music stuck on the bookshelf</p>
      </div>
    </div>
  );
}

export default App;
