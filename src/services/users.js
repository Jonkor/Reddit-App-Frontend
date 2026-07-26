import apiClient from "./apiClient";

const getAll = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};

const addUser = async (user) => {
  const response = await apiClient.post("/users", user);
  return response.data;
};

const userService = { getAll, addUser };

export default userService;
