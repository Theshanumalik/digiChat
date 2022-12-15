const express = require("express");
const cookeiParser = require("cookie-parser");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socketio = require("socket.io");
const {
  addUser,
  users,
  getUser,
  leaveUser,
  openChatGroupId,
  getUsers,
} = require("./utils/user");
const { isLoggedIn } = require("./utils/isLoggedIn");
const dbConnection = require("./utils/DB_CON");
const io = socketio(server);
const port = process.env.PORT || 80;

// CONNECTING TO DATABASE
dbConnection();

// app settings
app.use("/static", express.static("frontend"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookeiParser());
app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/anonymous", require("./routes/anonymous"));

// INDEX ROUTE FOR USERS WHO HAVE LOGGED IN
app.get("/", isLoggedIn, (req, res) => {
  if (req.user == null) return res.redirect("/auth/login");
  const { name, gender, id } = req.user;
  res.render("dashboard", { name, gender, id });
});

// OPEN CHAT ROUTE
app.get("/open", isLoggedIn, (req, res) => {
  const { name, gender, id } = req.user;
  if (req.user !== null)
    return res.render("openChat", {
      name,
      gender,
      id,
      groupId: openChatGroupId,
    });
});

// PAGE NOT FOUND
app.get("*", (req, res) => {
  res.render("notFound");
});

// SOCKET LOGIC

io.on("connection", (socket) => {
  socket.on("new-user-joined", (data) => {
    socket.join(data.groupId);
    const alreadyConnected = addUser(data, socket.id);
    io.to(data.groupId).emit("connected", getUsers(data.groupId));
    if (alreadyConnected) {
      let welcomeMessage = `${data.name} has joined the chat!`;
      socket.broadcast.to(data.groupId).emit("admin-message", welcomeMessage);
    }
  });

  socket.on("new-message", ({ msg, groupId }) => {
    const date = Date.now();

    const userInfo = getUser(socket.id);

    if (typeof userInfo != "undefined") {
      socket.broadcast.to(groupId).emit("messege", {
        msg,
        date,
        name: userInfo.name,
        gender: userInfo.gender,
        id: userInfo.id,
      });
    }
  });

  socket.on("disconnect", () => {
    const user = leaveUser(socket.id);
    if (user !== -1) {
      let msg = `${user.name} has left the chat`;
      user.groupId.forEach((id) => {
        socket.broadcast.to(id).emit("user-leave", msg);
      });
    }
  });
});

// SOCKET LOGIC

server.listen(port, () => {
  console.log(`server is listenling at http://127.0.0.1:${port}`);
});
