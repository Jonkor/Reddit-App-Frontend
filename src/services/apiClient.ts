import axios from "axios";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || "https://api.testaws.xyz/api"
).replace(/\/+$/, "");

const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

export default apiClient;
