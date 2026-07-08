import api from "./api";

const userService = {
  getAll: async () => {
    const res = await api.get("/users");
    return res.data;
  },
  create: async (userData) => {
    const res = await api.post("/users", userData);
    return res.data;
  },
  update: async (id, userData) => {
    const res = await api.put(`/users/${id}`, userData);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/users/${id}/status`, { status });
    return res.data;
  }
};

export default userService;
