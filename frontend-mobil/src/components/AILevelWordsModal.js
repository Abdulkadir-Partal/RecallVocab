import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "../../styles/AILevelWordsModalStyles";
import api from "../services/api";
import Button from "./Buttons";

export default function AILevelWordsModal({ visible, onClose, onWordsAdded }) {
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(null);
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      loadWords();
    }
  }, [visible]);

  const resetState = () => {
    setLoading(true);
    setLevel(null);
    setWords([]);
    setIndex(0);
    setAnswers([]);
    setResult(null);
    setSubmitting(false);
  };

  const loadWords = async () => {
    resetState();

    try {
      const response = await api.get("level-words/?count=10");
      setLevel(response.data.level);
      setWords(response.data.words);
    } catch (error) {
      console.log("Level Words Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (known) => {
    const currentWord = words[index];

    const nextAnswers = [
      ...answers,
      { word: currentWord.word, known },
    ];

    setAnswers(nextAnswers);

    if (index + 1 < words.length) {
      setIndex(index + 1);
    } else {
      submitAnswers(nextAnswers);
    }
  };

  const submitAnswers = async (finalAnswers) => {
    try {
      setSubmitting(true);

      const response = await api.post("level-words/submit/", {
        results: finalAnswers,
      });

      setResult(response.data);
      onWordsAdded?.();
    } catch (error) {
      console.log("Submit Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const currentWord = words[index];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>

          <Text style={styles.title}>AI ile Kelime Üret</Text>

          {loading ? (
            <ActivityIndicator size="large" />
          ) : result ? (
            <View>
              <Text style={styles.resultText}>
                {result.advanced
                  ? `Harika! Seviye yükseldi: ${result.old_level} -> ${result.new_level}`
                  : result.decreased
                  ? `Seviye düşürüldü: ${result.old_level} -> ${result.new_level}`
                  : `Seviye aynı kaldı: ${result.new_level}`}
              </Text>

              <Text style={styles.resultSubText}>
                {result.added_count} kelime listene eklendi.
              </Text>

              <Button title="Kapat" onPress={handleClose} />
            </View>
          ) : words.length === 0 ? (
            <View>
              <Text style={styles.resultText}>
                Bu seviyede yeni kelime bulunamadı.
              </Text>
              <Button title="Kapat" onPress={handleClose} />
            </View>
          ) : (
            <View>
              <Text style={styles.levelLabel}>Seviye: {level}</Text>

              <Text style={styles.progressLabel}>
                {index + 1} / {words.length}
              </Text>

              <View style={styles.wordBox}>
                <Text style={styles.word}>{currentWord.word}</Text>
                <Text style={styles.meaning}>{currentWord.meaning1}</Text>
                <Text style={styles.meaning}>{currentWord.meaning2}</Text>
                <Text style={styles.meaning}>{currentWord.meaning3}</Text>
              </View>

              {submitting ? (
                <ActivityIndicator />
              ) : (
                <View style={styles.buttonRow}>
                    <Button title="Bilmiyorum" onPress={() => handleAnswer(false)} variant="danger" style={{ flex: 1, marginRight: 8 }} />
                    <Button title="Biliyorum" onPress={() => handleAnswer(true)} variant="success" style={{ flex: 1, marginLeft: 8 }} />
                </View>
              )}
            </View>
          )}

          <TouchableOpacity onPress={handleClose} style={styles.closeArea}>
            <Text style={styles.closeText}>Vazgeç</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}