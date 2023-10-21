import React, {Component } from "react";
import { Link } from 'react-router-dom';
class Upload extends Component { 
  constructor(props) {
        super(props);
        this.fileInput=React.createRef();
        this.state = {
          selectedFile: null,
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
        

        fetch('http://localhost:8080/upload', {
            method: 'POST',
            body: formData,
            headers: {
                //'Content-Type': 'multipart/form-data',
                'Authorization': "Bearer "+localStorage.getItem("ACCESS_TOKEN")
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    response.text();
                    console.log(response);
                }
                else if(response.status === 403) {
                    window.location.href = "/login"; //로그인페이지로 리다이렉트
                } else if(response.status === 401) {
                    window.location.href = "/login";
                }
                else {
                    Promise.reject(response);
                    throw Error(response);
                }
            })
            .then((data) => {
                alert('정상적으로 업로드되었습니다.');
            })
            .catch((error) => {
              if(error.message===500){
                alert('파일을 업로드할 수 없습니다.');
                return;
              }
              alert('이미 존재하는 파일입니다.');
            });
    }

  render() {
    return (
      <div>
        <nav style={{ backgroundColor: 'rgba(255, 244, 233)', top: 0, height: '80px' }}>
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
        <p style={{ fontSize: '6.5em' }}>Upload</p>
        <p style={{ color: 'rgba(255, 244, 233)', fontSize: '3em', fontFamily: 'Gothic A1, san-serif' }}>
      <b>텍스트 파일을 업로드 해주세요</b>
    </p>
      </div>
        <div style={{textAlign: 'center'}}>
        <label htmlFor="genre"><b style={{ color: 'rgba(255, 244, 233)', fontSize: '1em', fontFamily: 'Gothic A1, san-serif' }}>장르를 선택해주세요</b></label>
        <select style={{width:'110px',padding:'6px',border:'3px solid #ccc',borderRadius:'10px'}}  name="genres" id="genre">
          <option value="none">선택안함</option>
          <option value="fantasy">판타지</option>
          <option value="scienceFiction">SF</option>
          <option value="mystery">추리</option>
          <option value="scary">공포</option>
        </select>
        </div>
        <div style={{textAlign: 'center'}}>
        <button className="custom-btn" onClick={this.handleButtonClick}>파일 선택</button>
        <input style={{display:'none'}} ref={this.fileInput} type="file" accept="text/plain" onChange={this.fileSelectedHandler}/>
        <button className="custom-btn" onClick={this.fileUploadHandler}>업로드</button>
        </div>
      </div>
    );
  }
}

export default Upload;
