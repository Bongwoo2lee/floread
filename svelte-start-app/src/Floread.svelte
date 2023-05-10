<script>
	import Popup from "./Popup.svelte";
	let isPoupVisible = false;
	function handleOpenPopup(){
		isPoupVisible=true;
	}
	function handleClosePopup(){
		isPoupVisible=false;
	}
	let src="https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/svelte-start-app/src/1166091_ORSJPI0.jpg";
	let src2="https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/svelte-start-app/src/5542689_2866296.jpg"
	let src3="https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/svelte-start-app/src/5567275_2901224.jpg"
	let user ={loggedIn:false};
	function toggle(){
		user.loggedIn=!user.loggedIn;
	}
</script>
<style>
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
</style>
<body bgcolor="black">
	<div style="float:right">
		{#if user.loggedIn}
		<button  style="background:none" on:click={toggle}><p style="line-height: 0px;">log out</p></button>
		{:else}
		<button style="background:none" on:click={toggle}><p style="line-height: 0px;">log in</p></button>
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
		<td><img style="margin: auto;" src={src} alt="이미지" width='150px' height='150px'></td>
		<td><img style="margin: auto;" src={src2} alt="이미지" width='150px' height='150px'></td>
		<td><img style="margin: auto;" src={src3} alt="이미지" width='150px' height='150px'></td>		
	</tr>
	<tr>
		<td><button class="btn" on:click={handleOpenPopup}>UPLOAD</button><Popup 
			visible={isPoupVisible}
			title="팝업 제목"
			content="팝업 내용"
			onClose={handleClosePopup}></Popup></td>
		<td><button class="btn">VIEWER</button></td>
		<td><button class="btn">MYPAGE</button></td>		
	</tr>
</table>
</div>
</body>
