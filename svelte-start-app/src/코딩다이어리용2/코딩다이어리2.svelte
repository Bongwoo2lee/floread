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
		{#if user.loggedIn}
		<button style="background:none" on:click={toggle} onclick="window.open('http://localhost:8000', '_blank', 'width=500,height=500')"><p style="line-height: 0px;">log out</p></button>
		{:else}
		<button style="background:none" on:click={toggle} onclick="window.open('http://localhost:8000', '_blank', 'width=500,height=500')"><p style="line-height: 0px;">log in</p></button>
		{/if}
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
				<form method="POST" action="http://localhost:8080" enctype="multipart/form-data">
					<div>
						<input type="file" id="file-input" name="file" accept="text/plain" multiple>
					</div>
					<div>
						<span>업로드</span>
						<input type="submit" value="전송" onclick="uploadFile()">
					</div>
				</form>
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
			<tr><td><h2>개인 페이지 화면 들어올 예정</h2></td></tr>
		</table>
	</div>
  </div>
</body>