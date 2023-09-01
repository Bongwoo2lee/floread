import React, { useState } from 'react';

function App2() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupVisible2, setPopupVisible2] = useState(false);
  const [popupVisible3, setPopupVisible3] = useState(false);
  let src = "https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/svelte-start-app/src/1166091_ORSJPI0.jpg";
  let src2 = "https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/svelte-start-app/src/5542689_2866296.jpg";
  let src3 = "https://raw.githubusercontent.com/Bongwoo2lee/floread/frontend/svelte-start-app/src/5567275_2901224.jpg";

  function togglePopup() {
    setPopupVisible(!popupVisible);
  }

  function togglePopup2() {
    if (!popupVisible2) {
      //showviewDataTitles();
    }
    setPopupVisible2(!popupVisible2);
  }

  function togglePopup3() {
    if (!popupVisible3) {
      //fetchData();
    }
    setPopupVisible3(!popupVisible3);
    //updatePopupVisibility();
  }

  return (
    <div style={{ width: '95%', margin: 'auto' }}>
      <p style={{ color: 'rgba(255, 244, 233)', fontSize: '3em', fontFamily: 'Gothic A1, sans-serif' }}>
        <b>당신의 독서를 돕는 음악과 함께 하세요</b>
      </p>
      <table style={{ width: '100%', textAlign: 'center', margin: 'auto' }}>
        <tr>
          <td><img style={{ margin: 'auto' }} src={src} alt="이미지" width="150px" height="150px" /></td>
          <td><img style={{ margin: 'auto' }} src={src2} alt="이미지" width="150px" height="150px" /></td>
          <td><img style={{ margin: 'auto' }} src={src3} alt="이미지" width="150px" height="150px" /></td>
        </tr>
        <tr>
          <td><button className="btn" onClick={togglePopup}>UPLOAD</button></td>
          <td><button className="btn" onClick={togglePopup2}>VIEWER</button></td>
          <td><button className="btn" onClick={togglePopup3}>MYPAGE</button></td>
        </tr>
      </table>
    </div>
  );
}

export default App2;
