import axios from "axios";

const instance = axios.create({
  baseURL: "https://autotek-server.herokuapp.com/",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }
});

export default instance;
