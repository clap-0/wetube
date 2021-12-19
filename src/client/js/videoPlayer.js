const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let volumeValue = 0.5;
let timeoutId = null;
video.volume = volumeValue;

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  volumeValue = event.target.value;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-up";
  }
  video.volume = volumeValue;
};

const formatTime = (second) => {
  const isoDate = new Date(second * 1000).toISOString();
  return isoDate.substring(
    second >= 36000 ? 11 : second >= 3600 ? 12 : second >= 600 ? 14 : 15,
    19
  );
};

const handleLoadedMetadata = () => {
  const duration = Math.floor(video.duration);
  totalTime.innerText = formatTime(duration);
  timeline.max = duration;
};

const handleTimeUpdate = () => {
  const second = Math.floor(video.currentTime);
  currentTime.innerText = formatTime(second);
  timeline.value = second;
};

const handleTimelineChange = (event) => {
  video.currentTime = event.target.value;
};

const handleFullScreenClick = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

const handleFullScreenChannge = () => {
  fullScreenIcon.classList = document.fullscreenElement
    ? "fas fa-compress"
    : "fas fa-expand";
};

const hideControls = () => {
  videoControls.classList.remove("showing");
};

const handleMouseMove = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  videoControls.classList.add("showing");
  timeoutId = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  timeoutId = setTimeout(hideControls, 3000);
};

const handleKeyDown = (event) => {
  if (document.activeElement.id === "commentTextarea") {
    return;
  }
  switch (event.key) {
    case " ":
      handlePlayClick();
      break;
    case "f":
      if (!document.fullscreenElement) {
        videoContainer.requestFullscreen();
      }
      break;
    case "Escape":
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      break;
    default:
  }
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreenClick);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("click", handlePlayClick);
video.addEventListener("canplaythrough", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
document.addEventListener("fullscreenchange", handleFullScreenChannge);
document.addEventListener("keydown", handleKeyDown);
