<script>
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
		onMount(() => {
		document.addEventListener('click', handleClick);
		return () => {
		  document.removeEventListener('click', handleClick);
		};
	  });
	
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