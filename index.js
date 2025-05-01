const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector("#browseBtn");

const bgProgress = document.querySelector(".bg-progress");
const progressPercent = document.querySelector("#progressPercent");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar");
// const status = document.querySelector(".status");

const sharingContainer = document.querySelector(".sharing-container");
const copyURLBtn = document.querySelector("#copyURLBtn");
const fileURL = document.querySelector("#fileURL");
const emailForm = document.querySelector("#emailForm");

// const toast = document.querySelector(".toast");

const baseURL = "https://shareease-x802.onrender.com";
const uploadURL = `${baseURL}/api/files`;
const emailURL = `${baseURL}/api/files/send`;

const maxAllowedSize = 100 * 1024 * 1024; //100mb


browseBtn.addEventListener("click", () => {
  fileInput.click();
});


copyURLBtn.addEventListener("click", () => {
  fileURL.select();
  document.execCommand("copy");
  // showToast("Copied to clipboard");
});




dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  //   console.log("dropped", e.dataTransfer.files[0].name);
  const files = e.dataTransfer.files;
  if (files.length === 1) {
    if (files[0].size < maxAllowedSize) {
      fileInput.files = files;
      uploadFile();
    } else {
      showToast("Max file size is 100MB");
    }
  } else if (files.length > 1) {
    showToast("You can't upload multiple files");
  }
  dropZone.classList.remove("dragged");
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragged");

  // console.log("dropping file");
});

dropZone.addEventListener("dragleave", (e) => {
  dropZone.classList.remove("dragged");

  console.log("drag ended");
});

// file input change and uploader
fileInput.addEventListener("change", () => {
  // if (fileInput.files[0].size > maxAllowedSize) {
  //   showToast("Max file size is 100MB");
  //   fileInput.value = ""; // reset the input
  //   return;
  // }
  uploadFile();
});

// // sharing container listenrs
// copyURLBtn.addEventListener("click", () => {
//   fileURL.select();
//   document.execCommand("copy");
//   showToast("Copied to clipboard");
// });

// fileURL.addEventListener("click", () => {
//   fileURL.select();
// });

const uploadFile = () => {
  progressContainer.style.display = "block";

  console.log("file added uploading");

  files = fileInput.files;
  const formData = new FormData();
  formData.append("myfile", files[0]);
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      // showLink(xhr.responseText);
      console.log(xhr.responseText);
      showLink(JSON.parse(xhr.responseText));

    }
  };
  xhr.upload.onprogress = updateProgress;

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const updateProgress = (e) => {
  const percent = Math.round((e.loaded / e.total) * 100);
  console.log(percent);
  bgProgress.style.width = `${percent}%`;
  progressPercent.innerText = percent;
  progressBar.style.transform = `scaleX(${(percent) / 100})`
};

const showLink = ({ File: url }) => {
  console.log(url);
  fileInput.value = "";
  emailForm[2].removeAttribute("disabled");
  progressContainer.style.display = "none";
  sharingContainer.style.display = "block";
  fileURL.value = url;
}



emailForm.addEventListener("submit", (e) => {
  e.preventDefault(); // stop submission
  console.log("submit form");
  // disable the button

  // emailForm[2].innerText = "Sending";

  const url = fileURL.value;

  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };
  emailForm[2].setAttribute("disabled", "true");
  console.table(formData);
  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then(({ success }) => {
      if (success) {
        // showToast("Email Sent");
        sharingContainer.style.display = "none"; // hide the box
      }
      //  
    });
});