<script>
	function mypage() {
		fetch('http://floread.store:8000/mypage')
		.then((response) => response.json())//읽어온 데이터를 json으로 변환
    	.then(data => {
			console.log(data)
		})
		.catch(error => {
			console.error(error);
		});
	}


	import {onMount} from 'svelte';
	let popupVisible = false;
	let popupVisible2 = false;
	let popupVisible3 = false;
	let user={loggedIn:false};
	function toggle(){
		user.loggedIn = !user.loggedIn;
	}
	function togglePopup(){
		popupVisible = !popupVisible;
	}
	function togglePopup2(){
		popupVisible2 = !popupVisible2;
	}
	function togglePopup3(){
		popupVisible3 = !popupVisible3;
		if (popupVisible3) {
			mypage();
		}
	}
	function handleClick(event) {
		if (popupVisible && !event.target.classList.contains('close-button')) {
		event.stopPropagation();
		return false;
		}
		else if (popupVisible2 && !event.target.classList.contains('close-button')) {
		event.stopPropagation();
		return false;
		}
		else if (popupVisible3 && !event.target.classList.contains('close-button')) {
		event.stopPropagation();
		return false;
		}
  	}
	let src="https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/svelte-start-app/src/1166091_ORSJPI0.jpg";
	let src2="https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/svelte-start-app/src/5542689_2866296.jpg";
	let src3="https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/svelte-start-app/src/5567275_2901224.jpg";

	onMount(() => {
    document.addEventListener('click', handleClick);
		return () => {
		document.removeEventListener('click', handleClick);
		};
 	});

	function uploadFile() {
        //event.preventDefault(); // Prevent the default form submission

        const fileInput = document.getElementById('file-input');
        const files = fileInput.files;

        if (files.length === 0) return;

        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append('files', file);
        });

        fetch('http://floread.store:8000/upload', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
				if (response.ok === false) {
					throw new Error(response.status);
				}
				response.text();
				console.log(response);
				
			})
            .then((data) => {
				alert('정상적으로 업로드되었습니다.');
				popupVisible = !popupVisible;
                // Handle the response data
            })
            .catch((error) => {
				//에러가 406이면 팝업으로 이미존재하는 파일입니다. 출력
				if(error.message == 500) {
					alert('파일을 업로드할 수 없습니다.');
					return;
				}
				alert('이미 존재하는 파일입니다.');
            });
    }
</script>
<style>
	.popup-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.2s ease;
    opacity: 0;
    z-index: -1;
  }

  .popup {
    position: relative;
    width: 350px;
    height: 300px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
    transform: translateY(100%);
    transition: transform 0.2s ease;
  }

  .popup-wrapper.visible {
    opacity: 1;
    z-index: 1;
  }

  .popup.visible {
    transform: translateY(0);
  }
  .close-button {
  float: right;
  width: 48px;
  height: 48px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-icon {
  width: 24px;
  height: 24px;
  fill: #757575;
}

.close-button:hover .close-icon {
  fill: #212121;
}
    p{
        color: rgb(255, 244,233);
        font-family: 'Georgia', serif;
        font-size: 1em;
        text-align: center;
    }
	body {
		background: linear-gradient(
		to top,	
		rgba(0,0,0,0.3)10%,
		rgba(0,0,0,0.3)25%,
		rgba(0,0,0,0.3)70%,
		rgba(0,0,0,0.3)80%,
		rgba(0,0,0,1)90%,
		rgba(0,0,0,1)100%
		),linear-gradient(
		to bottom,	
		rgba(0,0,0,0.3)10%,
		rgba(0,0,0,0.3)25%,
		rgba(0,0,0,0.3)40%,
		rgba(0,0,0,0.3)85%,
		rgba(0,0,0,0.8)95%,
		rgba(0,0,0,1)100%
		),
		url("https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/svelte-start-app/src/1511831767380871.jpg");
		background-repeat: no-repeat;
		background-size: 100%;
	}
	.btn{
	background: rgba(0,0,0,0);
	padding: 10px 25px;
	display: inline-block;
	border-radius: 25px;
	margin: 20px 0;
	color: #fff;
	position: relative;
	font-size: 1em;
	font-weight: bold;
	border-color: #fff;
}
	#wrap{
		margin: 0 auto;
		overflow: hidden;
		padding-top: 10px;
	}
	div>article{
		float: left;
		margin-left: 225px;
		margin-bottom: 150px;
	}
	img{display: block;}
	.upload-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 1rem;
  }

  .upload-btn {
    background-color: #4CAF50;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    margin-right: 1rem;
  }

  .upload-input {
    display: none;
  }

  .message {
    margin-top: 1rem;
  }
</style>
<body bgcolor="black">
	<div style="float:right">
		<button style="background:none" on:click={toggle} onclick="window.open('http://floread.store:8000', '_blank', 'width=500,height=500')"><p style="line-height: 0px;">log in</p></button>
	</div>
	<div>
    <p style="line-height: 0px; font-size:6.5em;">Floread</p>
    <p style="line-height: 0px;">Music stuck on the bookshelf </p>
</div>
<div style=" width:95%; margin:auto;">
	<p style="color:rgba(255, 244,233);font-size: 3em;font-family:Gothic A1, san-serif;"><b>당신의 독서를 돕는 음악과 함께 하세요</b></p>
<table style="width: 100%; text-align:center; margin:auto;">
	<tr>
		<td><img style="margin: auto;" src={src} alt="이미지" width="150px" height="150px"></td>
		<td><img style="margin: auto;" src={src2} alt="이미지" width='150px' height='150px'></td>
		<td><img style="margin: auto;" src={src3} alt="이미지" width='150px' height='150px'></td>		
	</tr>
	<tr>
		<td><button class="btn" on:click={togglePopup}>UPLOAD</button></td>
		<td><button class="btn" on:click={togglePopup2}>VIEWER</button></td>
		<td><button class="btn" on:click={togglePopup3}>MYPAGE</button></td>		
	</tr>
</table>
</div>
  <div class="popup-wrapper {popupVisible ? 'visible' : ''}">
	<div class="popup {popupVisible ? 'visible' : ''}" on:click={(e) => e.stopPropagation()}>
		<table style="width: 100%; text-align:center; margin:auto;">
			<tr>
				<td>
					<button class="close-button" aria-label="Close modal" on:click={togglePopup}>
						<svg class="close-icon" viewBox="0 0 24 24">
						  <path fill="currentColor" d="M12.7,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4l0,0c-0.4-0.4-1-0.4-1.4,0L11.3,10.6L6,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l5.3,5.3l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l5.3-5.3l5.3,5.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L12.7,12z"></path>
						</svg>
					  </button>
				</td>
			</tr>
		<tr>
			<td>
				<div>
					<form enctype="multipart/form-data">
						<div>
							<input type="file" id="file-input" name="file" accept="text/plain" multiple>
						</div>
						<div>
							<span>업로드</span>
							<input type="submit" value="전송" on:click|preventDefault={uploadFile}>
						</div>
					</form>
				</div>
			</td>
		</tr>
		</table>
	</div>
  </div>
  <div class="popup-wrapper {popupVisible2 ? 'visible' : ''}">
	<div class="popup {popupVisible2 ? 'visible' : ''}" on:click={(e) => e.stopPropagation()}>
		<table style="width: 100%; text-align:center; margin:auto;">
			<tr><td>
				<button class="close-button" aria-label="Close modal" on:click={togglePopup2}>
					<svg class="close-icon" viewBox="0 0 24 24">
					  <path fill="currentColor" d="M12.7,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4l0,0c-0.4-0.4-1-0.4-1.4,0L11.3,10.6L6,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l5.3,5.3l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l5.3-5.3l5.3,5.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L12.7,12z"></path>
					</svg>
				  </button>
			</td></tr>
			<tr><td><h2>뷰어 페이지 화면 들어올 예정</h2></td></tr>
		</table>
	</div>
  </div>
  <div class="popup-wrapper {popupVisible3 ? 'visible' : ''}">
	<div class="popup {popupVisible3 ? 'visible' : ''}" on:click={(e) => e.stopPropagation()}>
		<table style="width: 100%; text-align:center; margin:auto;">
			<tr><td>
				<button class="close-button" aria-label="Close modal" on:click={togglePopup3}>
					<svg class="close-icon" viewBox="0 0 24 24">
					  <path fill="currentColor" d="M12.7,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4l0,0c-0.4-0.4-1-0.4-1.4,0L11.3,10.6L6,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l5.3,5.3l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l5.3-5.3l5.3,5.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L12.7,12z"></path>
					</svg>
				  </button>
			</td></tr>
			<tr><td>
				<h2>마이페이지 화면 들어올 예정</h2>
			</td></tr>
		</table>
	</div>
  </div>
</body>