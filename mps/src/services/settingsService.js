import api from "./api";

const settingsService = {
  get: async () => {
    const res = await api.get("/settings");
    return res.data;
  },
  update: async (settingsData) => {
    const res = await api.put("/settings", settingsData);
    return res.data;
  },
  uploadLogo: async (logoBase64) => {
    const res = await api.post("/settings/logo", { logo: logoBase64 });
    return res.data;
  }
};

export default settingsService;
