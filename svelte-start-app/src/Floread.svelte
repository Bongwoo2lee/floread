<script>
	let src='https://github.com/Bongwoo2lee/floread/blob/frontend/svelte-start-app/src/1166091_ORSJPI0.jpg';
</script>
<style>
    p{
        color: rgb(195, 184, 173);
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
		url("https://github.com/Bongwoo2lee/floread/blob/frontend/svelte-start-app/src/1511831767380871.jpg");
		background-repeat: no-repeat;
		background-size: 100%;
	}
</style>
<body bgcolor="black">
	<div>
    <p style="line-height: 0px; font-size:6.5em;">Floread</p>
    <p style="line-height: 0px;">Music stuck on the bookshelf </p>
</div>
<div>
	<img src={src} alt='img'>
</div>
</body>
