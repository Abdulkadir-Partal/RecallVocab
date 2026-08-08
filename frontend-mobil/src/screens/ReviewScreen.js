import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from "react-native";

import ReviewCard from "../components/ReviewCard";
import { playAudio } from "../services/audioService";
import { getReviewSession, submitReview } from "../services/reviewService";
import { getWordInfo } from "../services/wordService";

import styles from "../../styles/ReviewScreenStyles";
import Speaker from "../../assets/gifs/speaker.svg";

export default function ReviewScreen() {
  const [session, setSession] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMeaning, setShowMeaning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [wordInfo, setWordInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  // Animasyon: yatay kaydırma + hafif opaklık geçişi
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const data = await getReviewSession();
      setSession(data);
    } catch (error) {
      console.log("Load Session Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (session.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No words found.</Text>
      </View>
    );
  }

  const currentWord = session[currentIndex];

  // Kartı sola kaydırıp kaybolarak çıkar, sonra index'i günceller,
  // sağdan gelerek tekrar belirir.
  const animateToNext = (updateIndex) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -40,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      updateIndex();

      slideAnim.setValue(40);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const nextWord = () => {
    if (currentIndex < session.length - 1) {
      animateToNext(() => {
        setCurrentIndex((prev) => prev + 1);
        setShowMeaning(false);
        setShowDetails(false);
        setWordInfo(null);
      });
    } else {
      Alert.alert("Review Completed 🎉", "Great job!");
    }
  };

  const handleKnow = async () => {
    try {
      const response = await submitReview(currentWord.id, true);
      setSession((prevSession) =>
        prevSession.map((item) =>
          item.id === currentWord.id
            ? {
                ...item,
                trust_point: response.trust_point,
                known_count: response.known_count,
                unknown_count: response.unknown_count,
              }
            : item
        )
      );
      nextWord();
    } catch (error) {
      console.log("Review Error:", error);
    }
  };

  const handleDontKnow = async () => {
    try {
      const response = await submitReview(currentWord.id, false);
      setSession((prevSession) =>
        prevSession.map((item) =>
          item.id === currentWord.id
            ? {
                ...item,
                trust_point: response.trust_point,
                known_count: response.known_count,
                unknown_count: response.unknown_count,
              }
            : item
        )
      );
      setShowMeaning(true);
    } catch (error) {
      console.log("Review Error:", error);
    }
  };

  const handleExample = async () => {
    if (showDetails) {
      setShowDetails(false);
      return;
    }
    try {
      setLoadingInfo(true);
      const data = await getWordInfo(currentWord.english_word);
      setWordInfo(data);
      setShowDetails(true);
    } catch (error) {
      console.log("Word Info Error:", error);
    } finally {
      setLoadingInfo(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.progress}>
        {currentIndex + 1} / {session.length}
      </Text>

      <Animated.View
        style={[
          styles.reviewCard,
          {
            transform: [{ translateX: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <ReviewCard
          word={currentWord}
          trustPoint={currentWord?.trust_point || 0}
          showMeaning={showMeaning}
          onKnow={handleKnow}
          onDontKnow={handleDontKnow}
          onNext={nextWord}
          onExample={handleExample}
        />
      </Animated.View>

      {loadingInfo && (
        <ActivityIndicator size="large" color="#4B5D3A" />
      )}

      {showDetails && wordInfo && (
        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Definition</Text>
          <Text style={styles.sectionText}>{wordInfo.definition || "-"}</Text>

          <Text style={styles.sectionTitle}>
            Meanings
          </Text>

          <Text style={styles.sectionText}>
            • {wordInfo.meaning1 || "-"}
          </Text>

          {!!wordInfo.meaning2 && (
            <Text style={styles.sectionText}>
              • {wordInfo.meaning2}
            </Text>
          )}

          {!!wordInfo.meaning3 && (
            <Text style={styles.sectionText}>
              • {wordInfo.meaning3}
            </Text>
          )}
          <Text style={styles.sectionTitle}>Example</Text>
          <Text style={styles.sectionText}>
            {wordInfo.example || "No example available."}
          </Text>

          <Text style={styles.sectionTitle}>Pronunciation</Text>
          <Text style={styles.sectionText}>{wordInfo.phonetic || "-"}</Text>

          <TouchableOpacity onPress={() => playAudio(currentWord.english_word)}>
            <View style={styles.listenContainer}>
              <Speaker width={24} height={24} fill="#4B5D3A" />
              {/* Tam uyum için buradaki stili listenText yaptık */}
              <Text style={styles.listenText}>Listen</Text> 
            </View>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>
            Level
          </Text>
          <Text style={styles.sectionText}>
            {wordInfo.level || "-"}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}