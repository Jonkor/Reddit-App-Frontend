import apiClient from "./apiClient";

const login = async (credentials) => {
  const response = await apiClient.post("/login", credentials);
  return response.data;
};

const loginService = { login };

export default loginService;
