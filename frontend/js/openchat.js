const send = new Audio("/static/sounds/send.wav");
const recieve = new Audio("/static/sounds/recieve.wav");
const socket = io();
socket.emit("new-user-joined", userInfo);
const form = document.getElementById("chat-form");
const myMsg = document.getElementById("my-message");
const chatContainer = document.getElementById("chat-container");
const activeUserList = document.getElementById("active-user-list");

myMsg.focus();
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (myMsg.value !== "") {
    createMessage(myMsg.value, chatContainer, userInfo);
    socket.emit("new-message", { msg: myMsg.value, groupId: userInfo.groupId });
    myMsg.value = "";
    myMsg.focus();
  }
});

socket.on("connected", function (users) {
  updateUserList(users, activeUserList, userInfo);
});

socket.on("messege", function (data) {
  getMessage(data, chatContainer);
});

socket.on("user-leave", function (msg) {
  adminNotification(msg, chatContainer);
});

socket.on("admin-message", (message) => {
  adminNotification(message, chatContainer);
});
