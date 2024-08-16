import axios from "axios";
const BASE_URL = "https://chat-app-udbk.onrender.com/api/v1";
const AxiosInstance= axios.create({baseURL: BASE_URL});

export {AxiosInstance}