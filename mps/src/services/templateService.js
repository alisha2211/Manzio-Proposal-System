import api from "./api";

const templateService = {
  getAll: async () => {
    const res = await api.get("/templates");
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/templates", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/templates/${id}`, data);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/templates/${id}`);
    return res.data;
  },
  activate: async (id, status) => {
    const res = await api.patch(`/templates/${id}/activate`, { status });
    return res.data;
  }
};

export default templateService;
