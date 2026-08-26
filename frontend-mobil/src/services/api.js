import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "https://recallvocab-production.up.railway.app/api/", // Replace with your backend URL
  timeout: 15000,
});
//https://recallvocab-production.up.railway.app/api/
//https://recallvocab.onrender.com/api
//http://127.0.0.1:8000/api
//"http://192.168.1.113:8000/api/"
//"http://192.168.1.102:8000/api/"
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// api.interceptors.response.use(
//   (response) => {
//     console.log(
//       "API SUCCESS:",
//       response.config.method,
//       response.config.url,
//       response.status,
//       response.data
//     );
//     return response;
//   },
//   (error) => {
//     console.log(
//       "API ERROR:",
//       error.config?.method,
//       error.config?.url,
//       error.response?.status,
//       error.response?.data,
//       error.message
//     );

//     return Promise.reject(error);
//   }
// );

export default api;

