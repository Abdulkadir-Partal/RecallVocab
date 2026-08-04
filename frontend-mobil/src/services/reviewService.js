import api from "./api";

export const getReviewSession = async () => {
    const response = await api.get("review/session/");
    return response.data;
};

export const submitReview = async (wordId, isKnown) => {
    const response = await api.post("review/", {
        word_id: wordId,
        is_known: isKnown,
    });

    return response.data;
};