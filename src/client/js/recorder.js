/***************************************
 *
 *  I removed ffmpeg because of errors.
 *
 **************************************/

//import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { async } from "regenerator-runtime";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;
let recorderTimeoutId = null;

// const files = {
//   input: "recording.webm",
//   output: "output.mp4",
//   thumb: "thumbnail.jpg",
// };

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleRestart = () => {
  actionBtn.removeEventListener("click", handleRestart);
  video.src = null;
  video.srcObject = stream;
  video.play();
  actionBtn.innerText = "Start recording";
  actionBtn.addEventListener("click", handleStart);
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  // const ffmpeg = createFFmpeg({
  //   log: true,
  //   corePath: "/convert/ffmpeg-core.js",
  // });
  // await ffmpeg.load();

  // ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

  // await ffmpeg.run("-i", files.input, "-r", "60", files.output);

  // await ffmpeg.run(
  //   "-i",
  //   files.input,
  //   "-ss",
  //   "00:00:01",
  //   "-frames:v",
  //   "1",
  //   files.thumb
  // );

  // const mp4File = ffmpeg.FS("readFile", files.output);
  // const thumbFile = ffmpeg.FS("readFile", files.thumb);

  // const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  // const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  // const mp4Url = URL.createObjectURL(mp4Blob);
  // const thumbUrl = URL.createObjectURL(thumbBlob);

  //downloadFile(mp4Url, "wetube-video.mp4");

  //downloadFile(thumbUrl, "wetube-thumb.jpg");

  // ffmpeg.FS("unlink", files.input);
  // ffmpeg.FS("unlink", files.output);
  // ffmpeg.FS("unlink", files.thumb);

  // URL.revokeObjectURL(mp4Url);
  // URL.revokeObjectURL(thumbUrl);
  // URL.revokeObjectURL(videoFile);

  downloadFile(videoFile, "recording.webm");

  actionBtn.innerText = "Record again";
  actionBtn.disabled = false;
  actionBtn.addEventListener("click", handleRestart);
};

const handleStop = () => {
  if (recorderTimeoutId) {
    clearTimeout(recorderTimeoutId);
  }
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleStart = () => {
  actionBtn.innerText = "Stop Recording";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleStart);

  setTimeout(() => {
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleStop);
  }, 1000);

  recorderTimeoutId = setTimeout(() => {
    handleStop();
  }, 5000);

  recorder.start();
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: 1024,
      height: 576,
    },
  });
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  video.srcObject = stream;
  video.play();
  actionBtn.removeEventListener("click", init);
  actionBtn.addEventListener("click", handleStart);
  actionBtn.innerText = "Start recording";
};

actionBtn.addEventListener("click", init);
