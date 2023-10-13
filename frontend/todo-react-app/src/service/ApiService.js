import { API_BASE_URL } from "../api-config";

export function call(api, method, request) {
    let headers = new Headers({
        "Content-type": "application/json"
    })

    //토큰이 있을 경우 추가
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if (accessToken && accessToken != null) {
        headers.append("Authorization", "Bearer " + accessToken);
    }

    let options = {
        headers: headers, 
        url: API_BASE_URL + api,
        method: method,
        mode: 'cors'
    };
    if (request) {
        //GET일 경우
        options.body = JSON.stringify(request);
    }
    return fetch(options.url, options).then((response) => {
        console.log(response);
        if (response.status === 200) {
            return response.json();
        } else if(response.status === 403) {
            window.location.href = "/login"; //로그인페이지로 리다이렉트
        } else if(response.status === 401) {
            window.location.href = "/login";
        }
        else {
            Promise.reject(response);
            throw Error(response);
        }
    }).catch((error) => {
        console.log("http error");
        console.log(error);
    });
}

export function signin(userDTO) {
    return call("/auth/signin", "POST", userDTO)
        .then((response) => {
            //로컬 스토리지에 저장
            localStorage.setItem("ACCESS_TOKEN", response.token);
            //index로 이동
            window.location.href = "/";
        });
}

export function signout() {
    localStorage.setItem("ACCESS_TOKEN", null);
    window.href = "/login";
}

export function signup(userDTO) {
    return call("/auth/signup", "POST", userDTO);
}

export function sendFile(formData) {
    //call("/upload","POST", formData);
    fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData,
    })
        .then((response) => {
          if(response.ok===false){
            throw new Error(response.status);
          }
          response.text();
          console.log(response);
        })
        .then((data) => {
            alert('정상적으로 업로드되었습니다.');
        })
        .catch((error) => {
          if(error.message==500){
            alert('파일을 업로드할 수 없습니다.');
            return;
          }
          if(error.message==403){
            alert('로그인을 해주세요.');
            return;
          }
          alert('이미 존재하는 파일입니다.');
        });
}

export function socialLogin(provider) {
    window.location.href = API_BASE_URL + "/oauth2/authorization/" + provider;
}

export function music(emotion) {
    var emotion = "happy";
    //var emotion = emotion;
    return call("/video/"+emotion, "POST")
        .then((res) =>{
            
            console.log(typeof res.audio);
            
            var musicList = res.audio;
            var blobUrl = [];

            for(var i = 0; i < musicList.length; i++) {
                //Controller에서 통신해 받아온 값을 base64인코딩을 해제한다.
                const data = base64ToArrayBuffer(musicList[i]);

                //base64인코딩을 해제한 바이너리data를 변수에 담는다.
                const uInt8Array = new Uint8Array(data);
                
                // Blob Object 를 생성한다.
                const blob = new Blob([uInt8Array], {type: 'audio/mp3'});
                
                //blob으로 만든 객체를 재생시키기 위해 url로 주소를 만들어 객체에 담는다.
                const url = URL.createObjectURL(blob);
                blobUrl.push(url);
            }
            //해당 주소를 audio객체를 만들어 소스에 넣고 플레이시킨다.
            const audio = new Audio();
            //노래 여러개 해야함
            audio.src = blobUrl[0];
            audio.play();
            
        });
}

export function base64ToArrayBuffer(base64){
    //인코딩 해제해 바이너리 스트링으로 받기
    const binary_string = window.atob(base64);
    //해당 길이가 필요해 변수에 적재
    const len = binary_string.length;
    console.log(len);
    
    const bytes = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes.buffer;
}
