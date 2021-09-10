const users =[];
const MAX_PLAYERS = 2;

const addUser =({ id, name, room }) => {
    if (playersInRoom(room) >= MAX_PLAYERS)
    {
        return {error: 'Max players reached'};
    }
    const user = {id, name, room};
    users.push(user);
    console.log(`Players in room ${room}: ${playersInRoom(room)}`);
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

module.exports = {addUser, removeUser, getUser, getUsersInRoom, playersInRoom};