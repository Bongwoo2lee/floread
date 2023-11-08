import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Viewer() {
  const access_token = localStorage.getItem('ACCESS_TOKEN');
  const [sendUserDTO, setSendUserDTO] = useState({});
  const [bookList, setBookList] = useState([]);
  const [error, setError] = useState(null);
  let bookData = '';

  const deleteBook = (title) => {
    // GET 요청을 보내고 책을 삭제합니다.
    fetch(`http://floread.store:8080/delete/${title}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('ACCESS_TOKEN')
      }
    })
      .then(response => {
        if (response.ok) {
          // 삭제가 성공한 경우 추가 작업을 수행합니다.
          alert('책이 삭제되었습니다.');
          window.location.href = '/viewer';
          // 원하는 추가 작업 수행
        } else {
          console.error('책 삭제 중 오류 발생');
        }
      })
      .catch(error => {
        console.error('오류:', error);
      });
  };

  useEffect(() => {
    fetch('http://floread.store:8080/viewer', {
      headers: {
        //'Content-Type': 'multipart/form-data',
        'Authorization': "Bearer " + localStorage.getItem("ACCESS_TOKEN")
      }
    })

      .then(response => {

        if (!response.ok) {

          throw new Error('데이터를 가져오는 중 오류가 발생했습니다.');
        }
        return response.json();
      })
      .then(data => {
        setSendUserDTO(data.sendUserDTO);
        setBookList(data.bookList);
        console.log(data.bookList);
      })
      .catch((error) => {
        if (!access_token) {
          alert('로그인이 필요합니다.');
          window.location.href = "/login";
        }

      });
  }, []);

  return (
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
      <div>
        <p style={{ position: 'fixed', color: 'white', fontSize: '1.5em', fontFamily: 'Gothic A1, san-serif', top: '60px' }}><b>{sendUserDTO.userName}({sendUserDTO.email})님 반갑습니다.</b></p>
        <table style={{ marginLeft: '100px', marginTop: '120px', borderCollapse: 'collapse',width:'85%'}}>
          <thead>
            <tr>
              <th style={{ width: '10%', backgroundColor: 'rgba(0,0,0,60%)', border: '5px solid rgb(0,0,0)', padding: '14px',textAlign:'left',borderRight:'none' }}>
                <b style={{ color: 'white', fontFamily: 'Gothic A1, sans-serif' }}>제목</b>
              </th>
              <th style={{ width: '10%', backgroundColor: 'rgba(0,0,0,60%)', border: '5px solid rgb(0,0,0)', padding: '14px',textAlign:'left',borderLeft:'none',borderRight:'none' }}>
                <b style={{ color: 'white', fontFamily: 'Gothic A1, sans-serif' }}>장르</b>
              </th>
              <th style={{ width: '30%', backgroundColor: 'rgba(0,0,0,60%)', border: '5px solid rgb(0,0,0)', padding: '14px',textAlign:'left' ,borderLeft:'none',borderRight:'none'}}>
                <b style={{ color: 'white', fontFamily: 'Gothic A1, sans-serif' }}>감성 분석</b>
              </th>
              <th style={{ width: '5%', backgroundColor: 'rgba(0,0,0,60%)', border: '5px solid rgb(0,0,0)', padding: '14px',textAlign:'left' ,borderLeft:'none',borderRight:'none'}}>
                <b style={{ color: 'white', fontFamily: 'Gothic A1, sans-serif' }}>보기</b>
              </th>
              <th style={{ width: '5%', backgroundColor: 'rgba(0,0,0,60%)', border: '5px solid rgb(0,0,0)', padding: '14px',textAlign:'left',borderLeft:'none' }}>
                <b style={{ color: 'white', fontFamily: 'Gothic A1, sans-serif' }}>삭제</b>
              </th>
            </tr>
          </thead>
          <tbody>
            {bookList.map((book, index) => (
              <tr key={index}>
                <td style={{ backgroundColor: 'rgb(35,35,35)', border: '5px solid rgb(0, 0, 0)', padding: '14px',borderRight:'none' }}>
                  <b style={{ color: 'white', fontFamily: 'Gothic A1, sans-serif', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', letterSpacing: '0.5px' }}>
                    {book.title}
                  </b>
                </td>
                <td style={{ backgroundColor: 'rgb(35,35,35)', border: '5px solid rgb(0, 0, 0)', padding: '14px',borderLeft:'none',borderRight:'none' }}>
                  <b style={{ color: 'white', fontFamily: 'Gothic A1, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', letterSpacing: '0.5px' }}>
                    {book.genre}
                  </b>
                </td>
                <td style={{ backgroundColor: 'rgb(35,35,35)', border: '5px solid rgb(0, 0, 0)', padding: '14px',textAlign: 'left',borderLeft:'none',borderRight:'none' }}>
                  <b style={{color: 'white', fontFamily: 'Gothic A1, sans-serif', letterSpacing: '0.5px' }}>
                    {book.emotions ? '완료' : '미완료'}
                  </b>
                </td>
                <td style={{ backgroundColor: 'rgb(35,35,35)', border: '5px solid rgb(0, 0, 0)', padding: '14px', textAlign: 'left',borderLeft:'none',borderRight:'none' }}>
                  <Link style={{ textDecoration: 'none', color: 'white', fontFamily: 'Gothic A1, sans-serif', letterSpacing: '0.5px' }} to={`/book/${encodeURIComponent(book.title)}`}>
                    <b>보기</b>
                  </Link>
                </td>
                <td style={{ backgroundColor: 'rgb(35,35,35)', border: '5px solid rgb(0, 0, 0)', padding: '14px', textAlign: 'left',borderLeft:'none'}}>
                  <button
                    style={{
                      color: 'white',
                      fontFamily: 'Gothic A1, sans-serif',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      letterSpacing: '0.5px'
                    }}
                    onClick={() => deleteBook(encodeURIComponent(book.title))} // 클릭 시에 함수 호출
                  >
                    <b> 삭제</b>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Viewer;
