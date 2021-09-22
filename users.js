const users =[];
const q = [];
const MAX_PLAYERS = 2;

const addUser =({ id, name, room }) => {
    if (playersInRoom(room) >= MAX_PLAYERS)
    {
        return {error: 'Max players reached'};
    }
    if (playersInRoom(room) === 1 && getUsersInRoom(room)[0].name === name)
    {
        return {error: 'User already in room'};
    }
    const user = {id, name, room};
    users.push(user);
    console.log(`Players in room ${room}: ${playersInRoom(room)}`);
    return {user};
}

const addToQ = ({ id, name, rating}) => {
    const user = {id, name, rating};
    return {user};
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const playersInRoom = (room) => {
    const usersInRoom = getUsersInRoom(room);
    return usersInRoom.length;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max) +1;
}

module.exports = {addUser, removeUser, getUser, getUsersInRoom, playersInRoom, getRandomInt, addToQ};