import api from "./api";

const reportService = {
  getAll: async () => {
    const res = await api.get("/reports");
    return res.data;
  },
  create: async (reportData) => {
    const res = await api.post("/reports", reportData);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/reports/${id}`);
    return res.data;
  }
};

export default reportService;
