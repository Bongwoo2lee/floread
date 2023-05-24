<script>
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

        fetch('http://localhost:8000/upload', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle the response data
                console.log(data);
            })
            .catch((error) => {
                // Handle the error
                console.error(error);
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