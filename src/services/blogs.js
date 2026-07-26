import apiClient from "./apiClient";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const request = apiClient.get("/blogs");
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await apiClient.post("/blogs", newObject, config);
  return response.data;
};

const update = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await apiClient.put(
    `/blogs/${newObject.id}`,
    newObject,
    config
  );
  return response.data;
};
const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await apiClient.delete(`/blogs/${id}`, config);
  return response.data;
};

const postComment = async (comment, id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await apiClient.post(
    `/blogs/${id}/comments`,
    comment,
    config
  );
  return response.data;
};

const blogService = { getAll, create, update, remove, setToken, postComment };

export default blogService;
