function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const files = fileInput.files;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    fetch('/books/save', {
        method: 'post',
        body: formData
    }).then(response => {
        console.log('파일 업로드 완료', response);
    }).catch(error => {
        console.log('파일 업로드 실패', error);
    })
}