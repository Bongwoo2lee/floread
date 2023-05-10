<script>
    export let visible;
    export let title;
    export let content;
    export let onClose;
  </script>
  
  <div class="popup-background" style="opacity: {visible ? '1' : '0'}">
    <div class="popup" style="transform: translateY({visible ? '0' : '100%'})">
      <div class="popup-header">
        <h3 class="popup-title">{title}</h3>
        <button class="popup-close" on:click={onClose}>X</button>
      </div>
      <div class="popup-body">
        {content}
      </div>
    </div>
  </div>
  
  <style>
    .popup-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      transition: opacity 0.3s ease-in-out;
    }
  
    .popup {
      width: 300px;
      background-color: white;
      border-radius: 5px;
      padding: 20px;
      transition: transform 0.3s ease-in-out;
    }
  
    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
  
    .popup-title {
      margin: 0;
    }
  
    .popup-close {
      border: none;
      background-color: transparent;
      cursor: pointer;
      font-size: 1.2rem;
      font-weight: bold;
    }
  </style>
  