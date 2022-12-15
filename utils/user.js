let users = [];
const openChatGroupId = "4r928lsdffu098rlskdf8493";

/* 
  user = {
    name: 'xyz',
    gender: 'male',
    id: 'asdfghiklkasdf',
    groupId: 'abcxyz',
    socket_id: ['dfjal', 'lsd', 'asl']
  }
*/

function addUser(data, socketId) {
  const index = users.findIndex((elem) => elem.id == data.id);
  if (index == -1) {
    userInfo = {
      name: data.name,
      gender: data.gender,
      id: data.id,
      socketId: [socketId],
      groupId: [data.groupId],
    };
    console.log("nya bnaya");
    users.push(userInfo);
    return true;
  } else {
    userInfo = {
      ...users[index],
      socketId: [...users[index].socketId, socketId],
      groupId: [...users[index].groupId, data.groupId],
    };

    users[index] = userInfo;
    return false;
  }
}

function getUsers(groupId) {
  const userList = users
    .map((user) => {
      if (user.groupId.includes(groupId)) {
        return { name: user.name, gender: user.gender, id: user.id };
      }
    })
    .filter((notDefined) => notDefined !== undefined);

  return userList;
}

function getUser(socketId) {
  const user = users.find((user) => user.socketId.includes(socketId));
  return user;
}

function leaveUser(socketId, groupId) {
  const index = users.findIndex((user) => user.socketId.includes(socketId));

  if (index != -1) {
    userInfo = {
      ...users[index],
      socketId: [...users[index].socketId.filter((elem) => elem !== socketId)],
      groupId: [...users[index].groupId.filter((elem) => elem !== groupId)],
    };
    if (userInfo.socketId.length == 0) {
      let user = users.splice(index, 1)[0];
      return user;
    }
    users[index] = userInfo;
    return -1;
  } else {
    return -1;
  }
}
module.exports = {
  addUser,
  users,
  getUser,
  leaveUser,
  getUsers,
  openChatGroupId,
};
