function Logout() {
    console.log("로그아웃");

    // 로컬 스토리지에서 ACCESS_TOKEN 제거
    localStorage.removeItem('ACCESS_TOKEN');

    // 페이지를 새로 고침
    window.location.href = "/";
}

export default Logout;