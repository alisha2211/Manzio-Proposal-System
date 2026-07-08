import api from "./api";

const proposalService = {
  getAll: async () => {
    const res = await api.get("/proposals");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/proposals/${id}`);
    return res.data;
  },
  create: async (proposalData) => {
    const res = await api.post("/proposals", proposalData);
    return res.data;
  },
  update: async (id, proposalData) => {
    const res = await api.put(`/proposals/${id}`, proposalData);
    return res.data;
  },
  updateStatus: async (id, status, note) => {
    const res = await api.patch(`/proposals/${id}/status`, { status, note });
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/proposals/${id}`);
    return res.data;
  },
  duplicate: async (id) => {
    const res = await api.post(`/proposals/${id}/duplicate`);
    return res.data;
  },
  send: async (id) => {
    const res = await api.post(`/proposals/${id}/send`);
    return res.data;
  }
};

export default proposalService;
