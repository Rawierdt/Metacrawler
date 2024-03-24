const { ipcRenderer } = require('electron');
const fs = require('fs');
const { exiftool } = require('exiftool-vendored');
const Swal = require('sweetalert2')

let filePath;

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.add('active');
    dropzone.style.boxShadow = '0 0 10px #000';
  });
  
  dropzone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.remove('active');
    dropzone.style.boxShadow = 'none';
  });
  
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.classList.remove('active');
    dropzone.style.boxShadow = 'none';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // se Procesa el archivo
      removeMetadata(files[0]);
      document.getElementById('downloadButton').disabled = false;
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "¡A ocurrido un error!",
      });
    }
  });
  

fileInput.addEventListener('change', (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    // se Procesa el archivo
    removeMetadata(files[0]);
    document.getElementById('downloadButton').disabled = false;
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "¡A ocurrido un error!",
    });
  }
});

document.getElementById('fileInput').addEventListener('change', (event) => {
    filePath = event.target.files[0].path;
    removeMetadata(filePath);
});

function removeMetadata(filePath) {
    const originalFilePath = filePath + '_original';

    exiftool
        .write(filePath, { all: '' })
        .then(() => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "¡Metadatos eliminados!",
            showConfirmButton: false,
            timer: 1500
          });
            ipcRenderer.send('download-file', filePath);

            fs.unlink(originalFilePath, err => {
                if (err) {
                    console.error(err);
                }
            });
        })
        .catch(err => console.error(err));
}

document.getElementById('downloadButton').addEventListener('click', () => {
    ipcRenderer.send('download-file', filePath);
});
