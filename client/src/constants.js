const SERVER_URL = typeof process.env.REACT_APP_URL === 'undefined' ? "" : process.env.REACT_APP_URL;
module.exports = SERVER_URL;