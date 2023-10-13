let backendHost;

//현재 도메인이 로컬호스트이면 로컬호스트에서 동작
const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost") {
    backendHost = "http://localhost:8080"
}

export const API_BASE_URL = `${backendHost}`;