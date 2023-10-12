import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import AppRouter from './AppRouter';

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<AppRouter tab="home"/>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();




// function playAudio() {
//     audioContainer.volume = 0.2;
//     audioContainer.loop = true;
//     audioContainer.play();  
//   }
  
//   function stopAudio() {
//     audioContainer.pause();  
//   }
  
  
//   function loadAudio() {
//     const source = document.querySelector('#audioSource');
//     source.src = blobUrl[currentAudio];
//     audioContainer.load();
//     playAudio();
//   }
  
//   function handleNextButtonClick() { 
  
//     if (currentAudio < MUSIC_COUNT) {
//       currentAudio += 1;
//     } else {
//       currentAudio = 1;
//     }
    
//     audioContainer.pause();
//     loadAudio();
//   }
  
  
  
//   playBtn.addEventListener('click', loadAudio);
//   stopBtn.addEventListener('click', stopAudio);
//   audioNextBtn.addEventListener('click', handleNextButtonClick);
  
//export default playAudio;