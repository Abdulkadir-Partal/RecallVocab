import api from "./api";

export const getStreak = async () => {

    const response =
        await api.get("streak/");

    return response.data;

};