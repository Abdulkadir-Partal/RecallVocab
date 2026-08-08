import React, { useCallback, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";
import { getWordInfo, deleteWord } from "../services/wordService";
import styles, { getTrustCardStyles, getTrustColor } from "../../styles/WordListScreenStyles";
import { playAudio } from "../services/audioService";
import Speaker from "../../assets/gifs/speaker.svg";

export default function WordListScreen() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedId, setExpandedId] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [wordInfo, setWordInfo] = useState(null);

  const loadWords = async () => {
    try {
      setLoading(true);
      const response = await api.get("words/");
      setWords(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWords();
    }, [])
  );

  const handleShowDetails = async (word) => {
    if (expandedId === word.id) {
      setExpandedId(null);
      return;
    }

    try {
      setLoadingInfo(true);
      const data = await getWordInfo(word.english_word);
      setWordInfo(data);
      setExpandedId(word.id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Word",
      "Are you sure you want to delete this word?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteWord(id);
              loadWords();
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={words}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const trustStyle = getTrustColor(item.trust_point);
          const trustCardStyles = getTrustCardStyles(trustStyle);

          return (
            <View style={[styles.card, trustCardStyles.card]}>
              <View style={[styles.cardInner, trustCardStyles.cardInner]}> 
                <View style={styles.cardHeader}>
                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.english, trustCardStyles.trustText]}>{item.english_word}</Text>
                    <Text style={[styles.turkish, trustCardStyles.trustText]}>{item.turkish_meaning}</Text>
                  </View>

                  <View style={[styles.trustBadge, trustCardStyles.trustBadge]}> 
                    <Text style={styles.trustBadgeText}>Trust {Number(item.trust_point ?? 0).toFixed(2)}</Text>
                  </View>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity onPress={() => handleShowDetails(item)}>
                    <Text style={[styles.detailsButton, trustCardStyles.trustText]}>
                      {expandedId === item.id ? "Hide Details" : "Show Details"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Text style={[styles.detailsButton, styles.deleteButton]}>Delete</Text>
                  </TouchableOpacity>
                </View>

                {expandedId === item.id && (
                  <View style={styles.detailsContainer}>
                    {loadingInfo ? (
                      <ActivityIndicator color={trustStyle.color} />
                    ) : (
                      <>
                        {(wordInfo?.meaning2 || wordInfo?.meaning3) && (
                          <>
                            <Text style={[styles.sectionTitle, { color: trustStyle.color }]}>Other Meanings</Text>
                            <Text style={[styles.sectionText, { color: trustStyle.color }]}>
                              {[wordInfo?.meaning2, wordInfo?.meaning3]
                                .filter(Boolean)
                                .join(", ")}
                            </Text>
                          </>
                        )}

                        <Text style={[styles.sectionTitle, { color: trustStyle.color }]}>Definition</Text>
                        <Text style={[styles.sectionText, { color: trustStyle.color }]}>{wordInfo?.definition || "-"}</Text>

                        <Text style={[styles.sectionTitle, { color: trustStyle.color }]}>Example</Text>
                        <Text style={[styles.sectionText, { color: trustStyle.color }]}>{wordInfo?.example || "-"}</Text>

                        <Text style={[styles.sectionTitle, { color: trustStyle.color }]}>Pronunciation</Text>
                        <Text style={[styles.sectionText, { color: trustStyle.color }]}>{wordInfo?.phonetic || "-"}</Text>

                        <Text style={[styles.trust, { color: trustStyle.color }]}>Trust Point: {item.trust_point}</Text>

                        <TouchableOpacity onPress={() => playAudio(item.english_word)}>
                          <View style={[styles.listenContainer, { backgroundColor: trustCardStyles.cardInner.backgroundColor }]}>
                            <Speaker width={24} height={24} fill={trustStyle.color} />
                            <Text style={[styles.listenText, { color: trustStyle.color }]}>Listen</Text>
                          </View>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
