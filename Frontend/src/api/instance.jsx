import axios from "axios";

const BASE_URL = "http://localhost:8001";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Access-Control-Allow-Credentials": "true",
  },
});


instance.interceptors.request.use(
  (config) => {
    const user_id = localStorage.getItem("user_id");

    if (user_id) {  
      config.headers["Authorization"] = user_id ? `Bearer ${user_id}` : "";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.reload(); 
      localStorage.clear();
    }
    return Promise.reject(error);
  }
);

export default instance;