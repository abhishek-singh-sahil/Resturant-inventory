import axios from "axios";

const API = axios.create({
  baseURL: "https://resturant-inventory.onrender.com/api",

  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

/* ==========================================
                AUTH
========================================== */

export const login = (data) =>
  API.post("/auth/login", data);

export const register = (data) =>
  API.post("/auth/register", data);

export const getCurrentUser = () =>
  API.get("/auth/me");

export const changePassword = (data) =>
  API.put("/auth/change-password", data);

/* ==========================================
              CATEGORIES
========================================== */

export const getCategories = () =>
  API.get("/categories");

export const createCategory = (data) =>
  API.post("/categories", data);

export const updateCategory = (id, data) =>
  API.put(`/categories/${id}`, data);

export const deleteCategory = (id) =>
  API.delete(`/categories/${id}`);

/* ==========================================
                ITEMS
========================================== */

export const getItems = () =>
  API.get("/items");

export const getItem = (id) =>
  API.get(`/items/${id}`);

export const createItem = (data) =>
  API.post("/items", data);

export const updateItem = (id, data) =>
  API.put(`/items/${id}`, data);

export const deleteItem = (id) =>
  API.delete(`/items/${id}`);

/* ==========================================
                VENDORS
========================================== */

export const getVendors = () =>
  API.get("/vendors");

export const getVendor = (id) =>
  API.get(`/vendors/${id}`);

export const createVendor = (data) =>
  API.post("/vendors", data);

export const updateVendor = (id, data) =>
  API.put(`/vendors/${id}`, data);

export const deleteVendor = (id) =>
  API.delete(`/vendors/${id}`);

/* ==========================================
                PURCHASES
========================================== */

export const getPurchases = () =>
  API.get("/purchases");

export const getPurchase = (id) =>
  API.get(`/purchases/${id}`);

export const createPurchase = (data) =>
  API.post("/purchases", data);

export const updatePurchase = (id, data) =>
  API.put(`/purchases/${id}`, data);

export const deletePurchase = (id) =>
  API.delete(`/purchases/${id}`);

/* ==========================================
            STORE INVENTORY
========================================== */

export const getStoreItems = () =>
  API.get("/store");

export const getStoreStock = () =>
  API.get("/store/stock");

export const updateStoreClosing = (itemId, data) =>
  API.put(`/store/${itemId}/closing`, data);

/* ==========================================
          KITCHEN INVENTORY
========================================== */

export const getKitchenItems = () =>
  API.get("/kitchen");

export const updateKitchenClosing = (itemId, data) =>
  API.put(`/kitchen/${itemId}/closing`, data);

/* ==========================================
             BUSINESS DAY
========================================== */

export const getCurrentBusinessDay = () =>
  API.get("/system/day");

export const rolloverBusinessDay = () =>
  API.post("/system/rollover");

/* ==========================================
               DASHBOARD
========================================== */

export const getDashboardSummary = () =>
  API.get("/reports/dashboard-summary");

/* ==========================================
                REPORTS
========================================== */

export const getStoreReport = (date) =>
  API.get("/reports/store", {
    params: { date },
  });

export const getKitchenReport = (date) =>
  API.get("/reports/kitchen", {
    params: { date },
  });

export const getPurchaseReport = (date) =>
  API.get("/reports/purchase", {
    params: { date },
  });

export const getTransferReport = (date) =>
  API.get("/reports/transfer", {
    params: { date },
  });

export const getConsumptionReport = (date) =>
  API.get("/reports/consumption", {
    params: { date },
  });

export const getPurchaseByCategory = (date) =>
  API.get("/reports/purchase-by-category", {
    params: { date },
  });

export const getConsumptionByCategory = (date) =>
  API.get("/reports/consumption-by-category", {
    params: { date },
  });

export default API;