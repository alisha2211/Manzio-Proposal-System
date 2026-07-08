import api from "./api";

const activityService = {
  getAll: async () => {
    const res = await api.get("/activity");
    return res.data;
  }
};

export default activityService;
