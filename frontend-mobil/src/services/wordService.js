import api from "./api";

export const getWordInfo = async (word) => {
  const response = await api.post("word-info/", {
    word,
  });

  return response.data;
};

export const deleteWord = async (id) => {

    const response = await api.delete(

        `words/${id}/`

    );

    return response.data;

};