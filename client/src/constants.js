const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "";

module.exports = SERVER_URL;