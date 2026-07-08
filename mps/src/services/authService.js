import api from "./api";

const authService = {
  // Login
  login: async (email, password) => {
    try {
      console.log("🚀 Sending login request...");
      console.log("Email:", email);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("✅ Backend Response:", res.data);

      if (res.data.token) {
        localStorage.setItem("manzio_token", res.data.token);
        localStorage.setItem(
          "manzio_user",
          JSON.stringify(res.data.user)
        );
        // Ensure success flag is set so Login.jsx can detect it
        res.data.success = true;
      }

      return res.data;
    } catch (err) {
      console.error("❌ Login Error");

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response:", err.response.data);
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Error:", err.message);
      }

      throw err;
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout request failed:", err);
    }

    localStorage.removeItem("manzio_token");
    localStorage.removeItem("manzio_user");
  },

  // Get Current User
  getMe: async () => {
    try {
      const res = await api.get("/auth/me");
      return res.data;
    } catch (err) {
      console.error("❌ getMe Error:", err);
      throw err;
    }
  },

  getToken: () => localStorage.getItem("manzio_token"),

  getUser: () => {
    const user = localStorage.getItem("manzio_user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("manzio_token");
  },

  updateProfile: async (profileData) => {
    const res = await api.put("/auth/profile", profileData);
    if (res.data.user) {
      localStorage.setItem("manzio_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const res = await api.put("/auth/change-password", { oldPassword, newPassword });
    return res.data;
  },
};

export default authService;