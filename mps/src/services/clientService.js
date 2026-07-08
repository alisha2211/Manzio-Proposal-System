import api from "./api";

const clientService = {
  getAll: async () => {
    const res = await api.get("/clients");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/clients/${id}`);
    return res.data;
  },
  create: async (clientData) => {
    const res = await api.post("/clients", clientData);
    return res.data;
  },
  update: async (id, clientData) => {
    const res = await api.put(`/clients/${id}`, clientData);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/clients/${id}`);
    return res.data;
  }
};

export default clientService;
