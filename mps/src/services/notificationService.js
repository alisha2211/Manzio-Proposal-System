import api from "./api";

const notificationService = {
  getAll: async () => {
    const res = await api.get("/notifications");
    return res.data;
  },
  markRead: async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },
  markAllRead: async () => {
    const res = await api.post("/notifications/read-all");
    return res.data;
  }
};

export default notificationService;
