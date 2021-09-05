const SERVER_URL = process.env.REACT_APP_URL == 'undefinded' ? "" :process.env.REACT_APP_URL;
module.exports = SERVER_URL;