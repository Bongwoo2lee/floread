import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import PageNavigation from './PageNavigation';

const access_token = localStorage.getItem('ACCESS_TOKEN');

async function fetchVideoData(title) {
    return fetch(`http://floread.store:8080/video/${encodeURIComponent(title)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("ACCESS_TOKEN")
        }
    });
}

async function fetchBookData(title) {
    return fetch(`http://floread.store:8080/book/${encodeURIComponent(title)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
            responseType: 'blob'
        }
    });
}

async function fetchImageData(title) {
    return fetch(`http://floread.store:8080/image/download/${encodeURIComponent(title)}`, {
        method: 'get',
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("ACCESS_TOKEN"),
        },
    });
}
// const srcList = [];

// async function fetchAndPlayMusic(title) {
//     console.log(title);
//     try {
//         const accessToken = localStorage.getItem("ACCESS_TOKEN");
//         if (!accessToken) {
//             throw new Error("Access token is missing.");
//         }

//         const response = await fetch(`http://floread.store:8080/download/${title}`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': "Bearer " + accessToken,
//             },
//         });

//         if (!response.ok) {
//             throw new Error(`Failed to fetch data. Status: ${response.status}`);
//         }

//         const musicData = await response.blob();

//         // Create an audio element and set the music source
//         const audio = new Audio();
//         audio.src = URL.createObjectURL(musicData);

//         srcList.push(audio.src);
//         // Play the music
//         audio.play();

//         return audio; // You can return the audio element if needed
//     } catch (error) {
//         console.error('Error:', error);
//         throw error; // You can choose to rethrow the error or handle it differently.
//     }
// }

const srcUrl = [];

function ReadBook() {
    const { title } = useParams();
    const [isExpanded, setIsExpanded] = useState(false);
    const [textData, setTextData] = useState(''); // 상태로 데이터를 저장
    const [imageURL, setImageURL] = useState(null);
    const [musicList, setMusicList] = useState([]);
    const [srcList, setSrcList] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(null);
    const audioPlayerRef = useRef(null);
    const [textPages, setTextPages] = useState([]);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // 현재 재생 중인 곡의 인덱스
    const [audio, setAudio] = useState(null); // audio 객체를 상태로 저장
    const playMusic = (url) => {
        if (currentTrack === url) {
            audioPlayerRef.current.pause();
            setCurrentTrack(null);
        } else {
            audioPlayerRef.current.src = url;
            audioPlayerRef.current.play().then(() => {
                audioPlayerRef.current.muted = false;
            });
            setCurrentTrack(url);
        }
    };

    useEffect(() => {

        // 비디오 데이터를 가져오는 함수 호출
        fetchVideoData(title)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error('Video POST request failed');
                }
            })
            .then(data => {
                setMusicList(data);

                // 여기서 musicList에 데이터가 제대로 설정될 때까지 기다린 후 처리해야 합니다.
                // 아래 코드는 musicList에 데이터가 할당된 후에 작동합니다.
                console.log(data);
                return data;
            })
            .then(data1 => {
                for (let i = 0; i < data1.length; i++) {
                    srcList.push("http://floread.store:8080/download/" + data1[i]);
                }
                console.log("srcList: ", srcList);
                return srcList;
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // 텍스트 데이터를 가져오는 함수 호출
        fetchBookData(title)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    alert("감성 분석 중입니다.");
                    window.location.href = "/viewer";
                    throw new Error('Book POST request failed');
                }
            })
            .then(data => {
                data = data.replace(/\\n/g, '\n');
                setTextData(data);
                return data;
            })
            .then(text => {
                console.log(text);
                const splitStrings = text.split('\n\n');
                setTextPages(splitStrings);
                console.log(textPages);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // 이미지 데이터를 가져오는 함수 호출
        fetchImageData(title)
            .then(response => {
                if (response.ok) {
                    return response.arrayBuffer();
                } else {
                    throw new Error('Image GET request failed');
                }
            })
            .then(data => {
                // 이미지 데이터를 사용하여 이미지를 생성
                const imageBlob = new Blob([data], { type: 'image/jpeg' });
                const imageURL = URL.createObjectURL(imageBlob);//Blob을 URL로 변환
                setImageURL(imageURL);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }, [title]);

    //const audioPlayerRef = useRef();
    const currentTrackRef = useRef(0);

    // 현재 곡의 인덱스를 기록
    useEffect(() => {
        const player = audioPlayerRef.current;
        if (player) {
            player.addEventListener('ended', playNextTrack);
        }
        return () => {
            if (player) {
                player.removeEventListener('ended', playNextTrack);
            }
        };
    }, []);

    // 다음 곡을 재생하는 함수
    const playNextTrack = () => {
        currentTrackRef.current = (currentTrackRef.current + 1) % srcList.length;
        const nextTrack = srcList[currentTrackRef.current];
        audioPlayerRef.current.src = nextTrack;
        audioPlayerRef.current.play();
    };



    // async function fetchAndPlayMusic(title) {
    //     try {
    //         const accessToken = localStorage.getItem("ACCESS_TOKEN");
    //         if (!accessToken) {
    //             throw new Error("Access token is missing.");
    //         }

    //         const response = await fetch(`http://floread.store:8080/download/${title}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': "Bearer " + accessToken,
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Failed to fetch data. Status: ${response.status}`);
    //         }

    //         const musicData = await response.blob();
    //         const musicURL = URL.createObjectURL(musicData);
    //         // Create an audio element and set the music source
    //         const newAudio = new Audio();
    //         newAudio.src = URL.createObjectURL(musicData);

    //         // Play the music
    //         //newAudio.play();

    //         // 저장된 audio 객체 업데이트
    //         setAudio(newAudio);
    //         // tmpSrcList.push(URL.createObjectURL(musicData));
    //         return musicURL;
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // }




    const displayText = isExpanded ? textData : textData.slice(0,);

    // // base64 디코딩 함수를 정의합니다.
    // function base64ToArrayBuffer(base64) {
    //     const binaryString = window.atob(base64);
    //     const byteArray = new Uint8Array(binaryString.length);
    //     for (let i = 0; i < binaryString.length; i++) {
    //         byteArray[i] = binaryString.charCodeAt(i);
    //     }
    //     return byteArray;
    // }


    return (
        <div style={{ position: 'fixed', top: 0, backgroundColor: 'rgb(255,255,255)', width: '100%', height: '100%' }}>
            <div style={{ position: 'fixed', top: 0, backgroundColor: 'rgba(245,244,222,60%)', width: '100%', height: '100%' }}>
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
                            <div style={{ position: 'fixed', right: '555px', padding: '10px' }}>
                                <div className="App">
                                </div>
                            </div>
                        </div>
                    </ul>
                </nav>
                <div className="container">
                    <div className="scroll-box">
                        {/* <PageNavigation textPages={textPages} /> */}
                        <p style={{ margin: '100px', marginBottom: '200px', marginTop: '50px', fontSize: '18px', fontFamily: 'Century Gothic', fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: displayText.replace(/\n/g, '<br><br>') }}></p>
                    </div>
                    <div style={{ flexDirection: 'column', width: '20%', height: '100%' }}>
                        <div style={{ textAlign: 'center', borderTop: '5px solid #000' }}>
                            <audio controls autoPlay muted ref={audioPlayerRef} >
                                <source src={srcList[currentTrackRef.current]} type="audio/mpeg" />
                            </audio>
                        </div>
                        <div className="music-list">
                            <ul>
                                {srcList.map((url, index) => (
                                    <li style={{ top: 0, width: '100%', height: '100%', listStyleType: 'none', backgroundColor: 'rgba(245,244,222,60%)', border: '3px solid #ccc', padding: '1px', borderLeft: 'none', borderBottom: 'none' }} key={index}>
                                        <p style={{ textAlign: 'center', fontFamily: 'NPSfontBold' }}>{musicList[index]}</p>
                                        <p style={{ textAlign: 'center' }}>{currentTrack === url ? (
                                            <button style={{ background: 'none', border: '2px solid #f00', borderRadius: '7px', padding: '4px', color: '#f00' }} onClick={() => playMusic(url)}><b>ON ♫</b></button>
                                        ) : (
                                            <button style={{ background: 'none', border: '2px solid #ccc', borderRadius: '7px', padding: '4px', color: '#ccc' }} onClick={() => playMusic(url)}><b>OFF</b></button>
                                        )}</p>
                                    </li>
                                ))}

                            </ul>
                        </div>
                        <div>
                            {imageURL && <img src={imageURL} style={{ position: 'fixed', width: '20%', bottom: '0', borderTop: '5px solid #000' }} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default ReadBook;
