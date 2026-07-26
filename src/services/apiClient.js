import axios from "axios";

const apiBaseUrl = (
  process.env.REACT_APP_API_BASE_URL || "https://api.testaws.xyz/api"
).replace(/\/+$/, "");

const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

export default apiClient;
