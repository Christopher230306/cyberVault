const dropZone=document.getElementById('drop-zone');
const fileInput=document.getElementById('fileInput');
const progressBar=document.getElementById('progressBar');
const progressContainer=document.querySelector('.progress-container');
const resultArea=document.getElementById('result-area');
const shareLink=document.getElementById('shareLink');

['dragover','dragleave','drop'].forEach(eventName=>{
    dropZone.addEventListener(eventName,e=>{
        e.preventDefault();
        e.stopPropagation();
    });
});

dropZone.addEventListener('dragover',()=>dropZone.classList.add('dragover'));
dropZone.addEventListener('dragleave',()=>dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop',(e)=>{
    dropZone.classList.remove('dragover');
    const files=e.dataTransfer.files;
    if(files.length) handleUpload(files[0]);
});

fileInput.addEventListener('change',()=>{
    if(fileInput.files.length) handleUpload(fileInput.files[0]);
});

function handleUpload(file){
    const formData=new FormData();
    formData.append('file',file);
    progressContainer.style.display='block';
    resultArea.classList.add('hidden');
    const xhr=new XMLHttpRequest();
    xhr.open('POST','/upload',true);

    xhr.upload.onprogress=(e)=>{
        if(e.lengthComputable){
            const percent=(e.loaded/e.total)*100;
            progressBar.style.width=percent+'%';
        }
    };

    xhr.onload=function(){
        if(xhr.status===200){
            const data=JSON.parse(xhr.responseText);
            shareLink.value=data.downloadLink;
            resultArea.classList.remove('hidden');
            document.getElementById('file-name').innerText="Upload Complete!";
        }
    };

    xhr.send(formData);
}

function copyLink(){
    shareLink.select();
    document.execCommand('copy');
    const btn=document.querySelector('.btn-copy');
    btn.innerText="COPIED!";
    setTimeout(()=>btn.innerText="COPY",2000);
}
