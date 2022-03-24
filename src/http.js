import axios from "axios";

const instance = axios.create({
  baseURL: "https://autotekwebserver.azurewebsites.net/",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }
});
/* pour utiliser les tokens de sécurité
  instance.interceptors.request.use(function (config) {
    const token = window.localStorage.getItem('token');
      config.headers.Authorization =token;
      return config;
  });
*/ 
export default instance;
