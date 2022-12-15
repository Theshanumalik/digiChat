// create messege that client / user has sent
function createMessage(text, container, userInfo) {
  msg = safeText(text);
  let time = moment(Date.now()).format("hh:mm a");
  chatbox = document.createElement("div");
  chatbox.setAttribute("class", "my-msg");
  chatbox.innerHTML = `<div class="msg-info"><p>${msg}</p><small>You at ${time}</small> </div><img src="/static/img/${
    userInfo.gender === "male" ? "man.png" : "woman.png"
  }" alt="Hello">`;
  container.appendChild(chatbox);
  container.scrollTop = container.scrollHeight;
  send.play();
}

// recieve messege
function getMessage(data, container) {
  chatbox = document.createElement("div");
  chatbox.setAttribute("class", "others-msg");
  chatbox.innerHTML = formatMessage(data);
  container.appendChild(chatbox);
  container.scrollTop = container.scrollHeight;
  recieve.play();
}

// update active user list
function updateUserList(users, container, currentUserInfo) {
  container.innerHTML = "";
  users.forEach((element) => {
    container.innerHTML += `<li><img src="/static/img/${
      element.gender === "male" ? "man.png" : "woman.png"
    }" alt="Hello">${
      element.id == currentUserInfo.id ? `${element.name} (YOU)` : element.name
    }</li>`;
  });
}

// admin notification
function adminNotification(message, container) {
  chatbox = document.createElement("div");
  chatbox.setAttribute("class", "others-msg");
  chatbox.innerHTML = announceAdmin({ message, date: Date.now() });
  container.appendChild(chatbox);
  container.scrollTop = container.scrollHeight;
  recieve.play();
}

function safeText(text) {
  lessThan = /</gi;
  greaterThan = />/gi;
  newText = text.replace(lessThan, "&lt;");
  newText = newText.replace(greaterThan, "&gt;");
  return newText;
}

function formatMessage({ gender, msg, name, date, id }) {
  let time = moment(date).format("hh:mm a");
  return `<img src="/static/img/${
    gender === "male" ? "man.png" : "woman.png"
  }" alt=${name}><div class="msg-info"><p>${msg}</p><small>${
    id == userInfo.id ? "YOU (AI)" : name
  } at ${time}</small> </div>`;
}

function announceAdmin({ message, date }) {
  let time = moment(date).format("hh:mm a");
  return `<img src="/static/img/admin.png" alt="admin.png"><div class="msg-info"><p>${message}</p><small>Admin at ${time}</small> </div>`;
}
