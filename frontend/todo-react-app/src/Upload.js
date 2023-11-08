import React, { Component } from "react";
import { Link } from 'react-router-dom';
const access_token = localStorage.getItem('ACCESS_TOKEN');
class Upload extends Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      selectedFile: null,
      access_token: localStorage.getItem('ACCESS_TOKEN'),
    };
  }
  handleButtonClick = () => {
    this.fileInput.current.click(); // 파일 선택 상자 트리거
  };


  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  }

  fileUploadHandler = () => {
    const genre = document.querySelector("select[name=genres] option:checked").value;

    const formData = new FormData();

    formData.append('files', this.state.selectedFile);
    formData.append('genre', genre);

    const accessToken = localStorage.getItem("ACCESS_TOKEN");


    fetch('http://floread.store:8080/upload', {
      method: 'POST',
      body: formData,
      headers: {
        //'Content-Type': 'multipart/form-data',
        'Authorization': "Bearer " + localStorage.getItem("ACCESS_TOKEN")
      }
    })

      .then((response) => {
        if (response.status === 200) {
          response.text();
          alert('정상적으로 업로드되었습니다.');
        }
        else if (response.status === 403) {
          window.location.href = "/login"; //로그인페이지로 리다이렉트
        } else if (response.status === 401) {
          window.location.href = "/login";
        } else if (response.status === 406) {
          alert('파일이 존재합니다.');
        }
        else {
          //Promise.reject(response);
          throw Error(response);
        }
      })
      .then((data) => {

      })
      .catch((error) => {
        console.log(error, "dsfds")
        if (error.message === 500) {
          alert('파일을 업로드할 수 없습니다.');
          return;
        }
        else if (!access_token) {
          alert('로그인이 필요합니다.');
          window.location.href = "/login";
        }
        else if (error.message === 406) {
          alert('이미 존재하는 파일입니다.');
          //window.location.reload();
          return;
        }

      });
  }
  render() {
    return (
      <div style={{ position: 'fixed', top: 0, width: '100%', height: '100%' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '15vh' }}></div>
          <p style={{ color: 'rgb(255, 244,233)', textAlign: 'center', fontSize: '6.5em', fontFamily: 'Georgia, serif', marginTop: '0' }}>Upload</p>
          <p style={{ color: 'rgb(255, 244,233)', textAlign: 'center', fontSize: '3em', fontFamily: 'Gothic A1, san-serif' }}>
            <b>텍스트 파일을 업로드 해주세요</b>
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <label htmlFor="genre"><b style={{ color: 'rgba(255, 244, 233)', fontSize: '1em', fontFamily: 'Gothic A1, san-serif' }}>장르 선택:</b></label>
          <select style={{ width: '110px', marginLeft: '10px', padding: '6px', border: '3px solid #ccc', borderRadius: '10px' }} name="genres" id="genre">
            <option value="none">선택안함</option>
            <option value="fantasy">판타지</option>
            <option value="scienceFiction">SF</option>
            <option value="mystery">추리</option>
            <option value="scary">공포</option>
            <option value="romance">로맨스</option>
          </select>
        </div>
        <div style={{ textAlign: 'center' }}>

          <button className="custom-btn" onClick={this.handleButtonClick}><b>파일 선택</b></button>
          <input style={{ display: 'none' }} ref={this.fileInput} type="file" accept="text/plain" onChange={this.fileSelectedHandler} />
          <button className="custom-btn" onClick={this.fileUploadHandler}><b>업로드</b></button>
          <div style={{ color: 'rgba(255, 244, 233)', fontSize: '1em', fontFamily: 'Gothic A1, san-serif' }}>
            <p><b>선택한 파일: </b>
              {this.state.selectedFile && (
                <b>{this.state.selectedFile.name}</b>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Upload;
