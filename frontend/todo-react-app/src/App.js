import React, { useState, useEffect } from 'react';
import { call, signout } from "./service/ApiService";
import { useNavigate } from 'react-router-dom';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupVisible2, setPopupVisible2] = useState(false);
  const [popupVisible3, setPopupVisible3] = useState(false);

  const [src] = "https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/frontend/todo-react-app/public/1166091_ORSJPI0.jpg";
  const [src2] = "https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/frontend/todo-react-app/public/5542689_2866296.jpg";
  const [src3] = "https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/frontend/todo-react-app/public/5567275_2901224.jpg";
  
  const [viewData, setViewData] = useState([]);
  const [titles, setTitles] = useState([]);
  const [popupData, setPopupData] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [bookData, setBookData] = useState('');
  const [user, setUser] = useState({ loggedIn: false });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [isBarOpen, setIsBarOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  

  const movePage = useNavigate();

  function moveLogin(){
    movePage('/login');
  };

  function moveUpload(){
    movePage('/upload');
  };

  function moveMypage(){
    movePage('/mypage');
  };

  function moveViewer(){
    movePage('/viewer');
  };

  // function togglePopup() {
  //   setPopupVisible(!popupVisible);
  // }

  // function togglePopup2() {
  //   if (!popupVisible2) {
  //     showviewDataTitles();
  //   }
  //   setPopupVisible2(!popupVisible2);
  // }

  // function togglePopup3() {
  //   if (!popupVisible3) {
  //     fetchData();
  //   }
  //   setPopupVisible3(!popupVisible3);
  //   updatePopupVisibility();
  // }

  // // 컴포넌트가 마운트될 때와 viewData가 변경될 때 titles를 업데이트
  // useEffect(() => {
  //   const updatedTitles = showviewDataTitles();
  //   setTitles(updatedTitles);
  // }, [viewData]);

  // function showviewDataTitles() {
  //   // 새로운 배열을 생성하고, 중복된 항목을 제외한 항목만 추가
  //   const newTitles = viewData.reduce((accumulator, current) => {
  //     if (!accumulator.some(item => item.title === current.title)) {
  //       accumulator.push({ title: current.title, index: accumulator.length });
  //     }
  //     return accumulator;
  //   }, []);

  //   console.log(newTitles);
  //   return newTitles;
  // }
  // const fetchData = () => {
  //   fetch('http://localhost:8080/mypage')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       setPopupData(data);
  //       setViewData(data);
  //       console.log(viewData[0].emotions[0]); // 이 부분을 사용하려면 useEffect에서 처리해야 합니다.
  //       updatePopupVisibility();
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []); // 컴포넌트가 처음 마운트될 때 데이터를 가져옵니다.
  //   // 팝업 가시성을 업데이트하는 함수

  //   const updatePopupVisibility = () => {
  //     // 팝업 가시성 상태에 따라 클래스 추가/제거
  //     const popupWrapper = document.querySelector('.popup-wrapper3');
  //     const popup = document.querySelector('.popup3');
  //     const popupContent = document.querySelector('.popup3 .popup-content');
  
  //     if (popupVisible3) {
  //       popupWrapper.classList.add('visible');
  //       popup.classList.add('visible');
  
  //       if (popupData.length > 0) {
  //         // 팝업 내용을 설정
  //         const content = popupData.map((item) => `${item.title} - ${item.emotions}`).join('<br>');
  //         popupContent.innerHTML = content;
  //       } else {
  //         popupContent.textContent = '';
  //       }
  //     } else {
  //       popupWrapper.classList.remove('visible');
  //       popup.classList.remove('visible');
  //       popupContent.textContent = '';
  //     }
  //   };
  //   const uploadFile = (event) => {
  //     event.preventDefault(); // 기본 폼 제출 방지
  
  //     const fileInput = document.getElementById('file-input');
  //     const files = fileInput.files;
  
  //     if (files.length === 0) return;
  
  //     const formData = new FormData();
  //     Array.from(files).forEach((file) => {
  //       formData.append('files', file);
  //     });
  
  //     fetch('http://localhost:8080/upload', {
  //       method: 'POST',
  //       body: formData,
  //     })
  //       .then((response) => {
  //         if (response.ok === false) {
  //           throw new Error(response.status);
  //         }
  //         response.text();
  //         console.log(response);
  //       })
  //       .then((data) => {
  //         alert('정상적으로 업로드되었습니다.');
  //         setPopupVisible(false); // 팝업 가시성 변경
  //       })
  //       .catch((error) => {
  //         if (error.message === '500') {
  //           alert('파일을 업로드할 수 없습니다.');
  //           return;
  //         }
  //         if (error.message === '403') {
  //           alert('로그인을 해주세요.');
  //           return;
  //         }
  //         alert('이미 존재하는 파일입니다.');
  //       });
  //   };
  //    // selectviewDataIndex 함수는 필요에 따라 상태를 업데이트하는 방식으로 변환
  // const selectviewDataIndex = (index) => {
  //   const selectedviewData = viewData[index];
  //   // 상태를 업데이트
  //   // setSelectedViewData(selectedviewData);
  // };

  // // receiveMusicUrl 함수도 비슷한 방식으로 변환
  // const receiveMusicUrl = (index) => {
  //   if (viewData && viewData[index] && viewData[index].emotions) {
  //     console.log(viewData[index].emotions[0]);
  //     fetch('http://localhost:8080/music/' + viewData[index].emotions[0])
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(data);
  //         // 상태를 업데이트
  //         // setAudioFiles(data);
  //         console.log(audioFiles[0].url);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // };

  // // receiveBook 함수도 비슷한 방식으로 변환
  // const receiveBook = (title) => {
  //   fetch('http://localhost:8080/book/' + title)
  //     .then((response) => response.text())
  //     .then((data) => {
  //       console.log(data);
  //       // 상태를 업데이트
  //       // setBookData(data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  // // handleClick 함수는 상태를 업데이트하지 않음
  // const handleClick = (event) => {
  //   if (popupVisible && !event.target.classList.contains('close-button')) {
  //     event.stopPropagation();
  //     return false;
  //   } else if (popupVisible2 && !event.target.classList.contains('close-button')) {
  //     event.stopPropagation();
  //     return false;
  //   } else if (popupVisible3 && !event.target.classList.contains('close-button')) {
  //     event.stopPropagation();
  //     return false;
  //   }
  // };

  // // toggleBar 함수는 상태를 업데이트하는 방식으로 변환
  // const toggleBar = () => {
  //   // 상태를 업데이트
  //   setIsBarOpen(!isBarOpen);
  //   if (!isBarOpen && isMusicPlaying) {
  //     //audioElement.play();
  //   }
  // };

  // // playMusic 함수는 상태를 업데이트하는 방식으로 변환
  // const playMusic = () => {
  //   // 상태를 업데이트
  //   setIsMusicPlaying(true);
  //   //audioElement.play();
  // };

  // // stopMusic 함수는 상태를 업데이트하는 방식으로 변환
  // const stopMusic = () => {
  //   // 상태를 업데이트
  //   setIsMusicPlaying(false);
  //   //audioElement.pause();
  //   //audioElement.currentTime = 0;
  // };

  // // playNextMusic 함수는 상태를 업데이트하는 방식으로 변환
  // const playNextMusic = () => {
  //   // 상태를 업데이트
  //   setCurrentMusicIndex((prevIndex) => (prevIndex + 1 >= audioFiles.length ? 0 : prevIndex + 1));

  //   const audioElements = document.getElementsByTagName('audio');
  //   for (let i = 0; i < audioElements.length; i++) {
  //     const audioElement = audioElements[i];
  //     if (i === currentMusicIndex) {
  //       audioElement.play();
  //     } else {
  //       audioElement.pause();
  //       audioElement.currentTime = 0;
  //     }
  //   }
  // };

  return (
    <div>
    <div>
      <div style={{ float: 'right' }}>
        <button
          style={{ background: 'none' }}
          onClick={moveLogin}
        >
          <p style={{ lineHeight: 'normal' }}>login</p>
        </button>
      </div>
      <div>
        <p style={{ lineHeight: '0px', fontSize: '6.5em' }}>Floread</p>
        <p style={{ lineHeight: '0px' }}>Music stuck on the bookshelf</p>
      </div>
    </div>
    <div style={{ width: '95%', margin: 'auto' }}>
    <p style={{ color: 'rgba(255, 244, 233)', fontSize: '3em', fontFamily: 'Gothic A1, san-serif' }}>
      <b>당신의 독서를 돕는 음악과 함께 하세요</b>
    </p>
    <table style={{ width: '100%', textAlign: 'center', margin: 'auto' }}>
      <tr>
        <td><img style={{ margin: 'auto' }} src={src} alt="이미지" width="150px" height="150px" /></td>
        <td><img style={{ margin: 'auto' }} src={src2} alt="이미지" width='150px' height='150px' /></td>
        <td><img style={{ margin: 'auto' }} src={src3} alt="이미지" width='150px' height='150px' /></td>
      </tr>
      <tr>
        <td><button className="btn" onClick={moveUpload}>UPLOAD</button></td>
        <td><button className="btn" onClick={moveViewer}>VIEWER</button></td>
        <td><button className="btn" onClick={moveMypage}>MYPAGE</button></td>
      </tr>
    </table>
  </div>
  <div className={`popup-wrapper ${popupVisible ? 'visible' : ''}`}>
      <div className={`popup ${popupVisible ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
        <table style={{ width: '100%', textAlign: 'center', margin: 'auto' }}>
          <tr>
            <td>
              <button className="close-button" aria-label="Close modal" >
                <svg className="close-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.7,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4l0,0c-0.4-0.4-1-0.4-1.4,0L11.3,10.6L6,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l5.3,5.3l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l5.3-5.3l5.3,5.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L12.7,12z"
                  ></path>
                </svg>
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div>
      <div className={`popup-wrapper2 ${popupVisible2 ? 'visible' : ''}`}>
        <div className={`popup2 ${popupVisible2 ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
          <table style={{ width: '100%', textAlign: 'center', margin: 'auto' }}>
            <tbody>
              <tr>
                <td>
                  <pre id="fileContent"></pre>
                </td>
              </tr>
              <tr>
                <td>
                  <button className="close-button" aria-label="Close modal" >
                    <svg className="close-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12.7,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4l0,0c-0.4-0.4-1-0.4-1.4,0L11.3,10.6L6,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l5.3,5.3l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l5.3-5.3l5.3,5.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L12.7,12z"></path>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <div className={`bar ${isBarOpen ? 'open' : ''}`} ></div>
                  <button className="button" >펼치기/접기</button>
                  <button className="button">펼치기/접기</button>
                  <button onClick>Next</button>
                  <div id="audio-container">
                    {audioFiles.map((audioSrc, index) => (
                      <audio key={index} controls>
                        <source src={audioSrc} type="audio/mpeg" />
                      </audio>
                    ))}
                  </div>
                  <ul>
                    {titles.map((item) => (
                      <li key={item.index} onClick>
                        {item.title}
                      </li>
                    ))}
                  </ul>
                  {bookData && (
                    <div>{bookData}</div>
                  )}
                  {isBarOpen && (
                    <div className={`music-ui ${isMusicPlaying ? 'open' : ''}`}>
                      <button onClick>
                        {isMusicPlaying ? '음악 일시정지' : '음악 재생'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div className={`popup-wrapper3 ${popupVisible3 ? 'visible' : ''}`}>
      <div className={`popup3 ${popupVisible3 ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
        <table style={{ width: '100%', textAlign: 'center', margin: 'auto' }}>
          <tbody>
            <tr>
              <td>
                <button className="close-button" aria-label="Close modal" onClick>
                  <svg className="close-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.7,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4l0,0c-0.4-0.4-1-0.4-1.4,0L11.3,10.6L6,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l5.3,5.3l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l5.3-5.3l5.3,5.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L12.7,12z"></path>
                  </svg>
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <div className="popup-content">
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
}

export default App;
