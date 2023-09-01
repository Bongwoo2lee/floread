<script>
	var viewData = [];
	var audioFiles = [];
	var titles = [];
	
	function selectviewDataIndex(index) {
		const selectedviewData = viewData[index];
		return selectedviewData;
	}

	function receiveMusicUrl(index) {
		if (viewData && viewData[index] && viewData[index].emotions) {
			console.log(viewData[index].emotions[0])
		fetch('http://floread.store:8000/music/' + viewData[index].emotions[0])
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				audioFiles = data;
				console.log(audioFiles[0].url);
			})
			.catch((error) => {
				console.error(error);
			});
		}
	}

	function showviewDataTitles() {
		if (titles){
			titles = [];
		for (var i = 0; i < viewData.length; i++) {
			var tmp = {title: viewData[i].title, index: i};
			//만약 같은 같이 존재하면 그냥 넘어가고, 존재하지 않으면 추가
			if (titles.includes(tmp)) {
				continue;
			}
			else{
				titles.push(tmp);
			}
		}
		console.log(titles)
		return titles;
		}
	}
	onMount(async () => {
  	  titles = showviewDataTitles();
 	});


	let bookData = '';

	function receiveBook(title){
		fetch('http://floread.store:8000/book/'+title)
		.then((response)=>response.text())
		.then(data=>{
		  console.log(data)
		  bookData = data;
		})
		.catch(error=>{
		  console.error(error);
		});
	}
		function viewer(){

		}

		// function playNextMusic(){
			
		// }

		import {onMount} from 'svelte';
		let popupVisible = false;
		let popupVisible2 = false;
		let popupVisible3 = false;
		let popup;
		let user={loggedIn:false};
		function toggle(){
			user.loggedIn = !user.loggedIn;
		}
		function togglePopup(){
			popupVisible = !popupVisible;
		}
		function togglePopup2(){
			if (!popupVisible2) {
				showviewDataTitles();
			}
			popupVisible2 = !popupVisible2;

		// fetch("test.txt")
		// 	.then(response => response.text())
		// 	.then(data => {
		// 	  const fileContentElement = document.getElementById("fileContent");
		// 	  fileContentElement.textContent = data;});
		}
	
	let popupData = [];
	
	function togglePopup3() {
		if (!popupVisible3) {
			fetchData();
		}
		popupVisible3 = !popupVisible3;
		updatePopupVisibility();
	}
	
	  function fetchData() {
		fetch('http://floread.store:8000/mypage')
		  .then((response) => response.json())
		  .then((data) => {
			console.log(data);
			popupData = data;
			viewData = data;
			console.log(viewData[0].emotions[0]);
			//saveData(data);
			updatePopupVisibility();
		  })
		  .catch((error) => {
			console.error(error);
		  });
	  }
	
	  function updatePopupVisibility() {
		const popupWrapper = document.querySelector('.popup-wrapper3');
		const popup = document.querySelector('.popup3');
		const popupContent = document.querySelector('.popup3 .popup-content');
	
		if (popupVisible3) {
		  popupWrapper.classList.add('visible');
		  popup.classList.add('visible');
	
		  if (popupData.length > 0) {
			const content = popupData.map((item) => `${item.title} - ${item.emotions}`).join('<br>');
			popupContent.innerHTML = content;
		  } else {
			popupContent.textContent = '';
		  }
		} else {
		  popupWrapper.classList.remove('visible');
		  popup.classList.remove('visible');
		  popupContent.textContent = '';
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
	
	  let files = [];
	  let message;
	
	  function uploadFile() {
			event.preventDefault(); // Prevent the default form submission
	
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
				  if(response.ok===false){
					throw new Error(response.status);
				  }
				  response.text();
				  console.log(response);
				})
				.then((data) => {
					alert('정상적으로 업로드되었습니다.');
					popupVisible=!popupVisible;
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
		let isBarOpen = false;
	  let isMusicPlaying = false;
	  let audioElement;
	
	  // 바를 펼치거나 접는 함수
	  function toggleBar() {
		isBarOpen = !isBarOpen;
		if (!isBarOpen && isMusicPlaying) {
		  audioElement.play();
		}
	  }
	
	  // 음악 파일 재생 함수
	  function playMusic() {
		audioElement.play();
		isMusicPlaying = true;
	  }
	
	  // 음악 정지 함수
	  function stopMusic() {
		audioElement.pause();
		audioElement.currentTime = 0;
		isMusicPlaying = false;
	  }
	
	  let currentMusicIndex = 0;
	  function playNextMusic() {
		currentMusicIndex++;
		if (currentMusicIndex >= audioFiles.length) {
		currentMusicIndex = 0;
		}

    const audioElements = document.getElementsByTagName('audio');
    for (let i = 0; i < audioElements.length; i++) {
      const audioElement = audioElements[i];
      if (i === currentMusicIndex) {
        audioElement.play();
      } else {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    }
  }	
	</script>
	
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
					<form enctype="multipart/form-data">
						<div>
							<input type="file" id="file-input" name="file" accept="text/plain" multiple>
						</div>
						<div>
							<span>업로드</span>
							<input type="submit" value="전송" on:click|preventDefault={uploadFile}>
						</div>
					</form>
				</td>
			</tr>
			</table>
		</div>
	  </div>
	  <div class="popup-wrapper2 {popupVisible2 ? 'visible' : ''}">
		<div class="popup2 {popupVisible2 ? 'visible' : ''}" on:click={(e) => e.stopPropagation()}>
			<table style="width: 100%; text-align:center; margin:auto;">
		  <tr><td><pre id="fileContent"></pre></td></tr>
				<tr><td>
					<button class="close-button" aria-label="Close modal" on:click={togglePopup2}>
						<svg class="close-icon" viewBox="0 0 24 24">
						  <path fill="currentColor" d="M12.7,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4l0,0c-0.4-0.4-1-0.4-1.4,0L11.3,10.6L6,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l5.3,5.3l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l5.3-5.3l5.3,5.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L12.7,12z"></path>
						</svg>
					  </button>
				</td></tr>
				<tr><td>
					<div class="bar {isBarOpen ? 'open' : ''}" on:click={toggleBar} ></div>
					<button class="button" on:click={toggleBar}>펼치기/접기</button>
					<button class="button" on:click={viewer}>펼치기/접기</button>
					
					<button on:click={() => receiveMusicUrl(0)}>Next</button>
					<div id="audio-container">
					{#each audioFiles as audioSrc}
						<audio controls>
						<source src={audioSrc} type="audio/mpeg">
						</audio>
					{/each}
					</div>
					<ul>
					  {#each titles as item (item.index)}
					  <!--여기에 title들 출력후 title을 클릭할수 있게 하여서 클릭하면 책 내용 나오게-->
					  <!--그리고 책을 누르는 순간 music함수 하고 위에 있는 음악 재생되게-->
						<li on:click={() => receiveBook(item.title)}>
						  {item.title}
						</li>
					  {/each}
					</ul>
					{#if bookData}
					<div>{bookData}</div>
				  	{/if}
					{#if isBarOpen}
					  <div class="music-ui {isMusicPlaying ? 'open' : ''}">
						<button on:click={isMusicPlaying ? stopMusic : playMusic}>
						  {isMusicPlaying ? '음악 일시정지' : '음악 재생'}
				
						</button>
					  </div>
					{/if}
					</td></tr>
			</table>
		</div>
	  </div>
	  <div class="popup-wrapper3 {popupVisible3 ? 'visible' : ''}">
		<div class="popup3 {popupVisible3 ? 'visible' : ''}" on:click={(e) => e.stopPropagation()}>
			<table style="width: 100%; text-align:center; margin:auto;">
				<tr><td>
					<button class="close-button" aria-label="Close modal" on:click={togglePopup3}>
						<svg class="close-icon" viewBox="0 0 24 24">
						  <path fill="currentColor" d="M12.7,12l5.3-5.3c0.4-0.4,0.4-1,0-1.4l0,0c-0.4-0.4-1-0.4-1.4,0L11.3,10.6L6,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l5.3,5.3l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l5.3-5.3l5.3,5.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L12.7,12z"></path>
						</svg>
					  </button>
				</td></tr>
				<tr><td><div class="popup-content"></div>
				</td></tr>
			</table>
		</div>
	  </div>
	</body>