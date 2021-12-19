const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll(".commentDelete");

const addComment = (text, json) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = json.newCommentId;
  newComment.classList = "video__comment";
  const firstColumn = document.createElement("div");
  firstColumn.classList = "video__comment__column";
  const avatarA = document.createElement("a");
  avatarA.href = `/users/${json.ownerId}`;
  const avatar = document.createElement(json.ownerAvatarUrl ? "img" : "i");
  if (json.ownerAvatarUrl) {
    avatar.src = "/" + json.ownerAvatarUrl;
    avatar.classList = "avatar";
  } else {
    avatar.classList = "fas fa-user-circle fa-3x";
  }
  avatarA.appendChild(avatar);
  firstColumn.appendChild(avatarA);
  const secondColumn = document.createElement("div");
  secondColumn.classList = "video__comment__column";
  const name = document.createElement("a");
  name.href = `/users/${json.ownerId}`;
  name.innerText = json.ownerName;
  const span = document.createElement("span");
  span.innerText = text;
  secondColumn.appendChild(name);
  secondColumn.appendChild(span);
  const lastColumn = document.createElement("div");
  lastColumn.classList = "video__comment__column";
  const deleteIcon = document.createElement("i");
  deleteIcon.classList = "fas fa-times commentDelete";
  deleteIcon.addEventListener("click", handleDelete);
  lastColumn.appendChild(deleteIcon);
  newComment.appendChild(firstColumn);
  newComment.appendChild(secondColumn);
  newComment.appendChild(lastColumn);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const id = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${id}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const json = await response.json();
    addComment(text, json);
  }
};

const handleDelete = async (event) => {
  const commentNode = event.target.parentNode.parentNode;
  const id = commentNode.dataset.id;
  const response = await fetch(`/api/comment/${id}/delete`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    const comments = commentNode.parentNode;
    comments.removeChild(commentNode);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
deleteBtns.forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", handleDelete);
});
