import React, {Component } from "react";

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
          selectedFile: null,
        };
    }

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
                <label for="genre">장르</label>
                <select name="genres" id="genre">
                    <option value="none">선택안함</option>
                    <option value="fantasy">판타지</option>
                    <option value="scienceFiction">SF</option>
                    <option value="mystery">추리</option>
                    <option value="scary">공포</option>
                    <option value="romance">로맨스</option>
                </select>
                <input type="file" accept="text/plain" onChange={this.fileSelectedHandler} />
                <button onClick={this.fileUploadHandler}>업로드</button>
            </div>
        );
    }
}

export default Upload;