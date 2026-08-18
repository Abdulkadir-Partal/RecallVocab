import * as SecureStore from "expo-secure-store";
import api from "./api";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const saveTokens = async ({ access, refresh }) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh);
};

export const register = async (username, password) => {
  const normalizedUsername = username.trim();
  const response = await api.post("auth/register/", { username: normalizedUsername, password });
  return response.data;
};

export const login = async (username, password) => {
  const normalizedUsername = username.trim();
  const response = await api.post("auth/login/", { username: normalizedUsername, password });
  await saveTokens(response.data);
  return response.data;
};

export const restoreSession = async () => {
  const access = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  if (!access) return false;

  try {
    await api.get("auth/me/");
    return true;
  } catch {
    const refresh = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!refresh) return false;
    try {
      const response = await api.post("auth/refresh/", { refresh });
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.data.access);
      return true;
    } catch {
      await logout();
      return false;
    }
  }
};

export const logout = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post("auth/change-password/", { current_password: currentPassword, new_password: newPassword });
  return response.data;
};

export const deleteAccount = async (password) => {
  const response = await api.post("auth/delete-account/", { password });
  return response.data;
};
