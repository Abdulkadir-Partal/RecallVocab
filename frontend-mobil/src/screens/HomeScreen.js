import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import styles, {
  HOME_GRADIENT_COLORS,
  HOME_GRADIENT_START,
  HOME_GRADIENT_END,
  STREAK_CARD_GRADIENTS,
  STREAK_CARD_BORDER_COLORS,
  TREE_IMAGE_SIZES,
} from "../../styles/HomeScreenStyles";

// Metro dinamik require() path'i desteklemediği için her aşama/durum
// kombinasyonu için ayrı bir require çağrısı gerekiyor.
const TREE_IMAGES = {
  1: {
    c: require("../../assets/gifs/1c.png"),
    k: require("../../assets/gifs/1k.png"),
  },
  2: {
    c: require("../../assets/gifs/2c.png"),
    k: require("../../assets/gifs/2k.png"),
  },
  3: {
    c: require("../../assets/gifs/3c.png"),
    k: require("../../assets/gifs/3k.png"),
  },
  4: {
    c: require("../../assets/gifs/4c.png"),
    k: require("../../assets/gifs/4k.png"),
  },
  5: {
    c: require("../../assets/gifs/5c.png"),
    k: require("../../assets/gifs/5k.png"),
  },
};

import AddWordModal from "../components/AddWordModal";
import Button from "../components/Buttons";

import api from "../services/api";
import { getStreak } from "../services/homeService";

export default function HomeScreen({ navigation, onLogout }) {

  const [modalVisible, setModalVisible] = useState(false);
  const [totalWords, setTotalWords] = useState(0);
  const [streak, setStreak] = useState(0);
  const [todayLearned, setTodayLearned] = useState(0);
  const [todayReviews, setTodayReviews] = useState(0);
  const [goalCompleted, setGoalCompleted] = useState(false);
  const [rank, setRank] = useState("None");
  const [showStreakInfo, setShowStreakInfo] = useState(false);

  const loadWords = async () => {
    try {
      const response = await api.get("words/");
      setTotalWords(response.data.length);

      const streakData = await getStreak();
      setStreak(streakData.streak);
      setTodayLearned(streakData.today_learned);
      setTodayReviews(streakData.today_reviews);
      setGoalCompleted(streakData.goal_completed);
      setRank(streakData.rank || "None");
    } catch (error) {
      console.log("Home Load Error:");
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWords();
    }, [])
  );

  const getTreeStage = (currentStreak, currentRank) => {
    const normalizedRank = currentRank || "None";

    if (currentStreak >= 365 || normalizedRank === "Diamond") {
      return 5;
    }
    if (currentStreak >= 100 || normalizedRank === "Gold") {
      return 4;
    }
    if (currentStreak >= 30 || normalizedRank === "Silver") {
      return 3;
    }
    if (currentStreak >= 7 || normalizedRank === "Bronze") {
      return 2;
    }
    return 1;
  };

  const treeStage = getTreeStage(streak, rank);
  const isGoalReallyCompleted = todayLearned >= 1 && todayReviews >= 5;
  const treeImage = TREE_IMAGES[treeStage][isGoalReallyCompleted ? "c" : "k"];
  const treeImageSize = TREE_IMAGE_SIZES[treeStage];

  return (
    <LinearGradient
      colors={HOME_GRADIENT_COLORS}
      start={HOME_GRADIENT_START}
      end={HOME_GRADIENT_END}
      style={styles.container}
    >

      <Text style={styles.title}>
        RecallWord
      </Text>

      <Text style={styles.subtitle}>
        Keep your vocabulary fresh.
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.leftColumn}>
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Total Words</Text>
            <Text style={styles.total}>{totalWords}</Text>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Today Learned</Text>
            <Text style={styles.total}>{todayLearned}</Text>
          </View>
        </View>

        <LinearGradient
          colors={STREAK_CARD_GRADIENTS[treeStage]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.streakCard, { borderColor: STREAK_CARD_BORDER_COLORS[treeStage] }]}
        >
          <View style={styles.streakTextWrap}>
            <View style={styles.streakTitleRow}>
              <Text style={styles.cardTitle}> Streak</Text>
              <TouchableOpacity
                onPress={() => setShowStreakInfo(!showStreakInfo)}
                style={styles.infoButton}
              >
                <Text style={styles.infoButtonText}>i</Text>
              </TouchableOpacity>
            </View>
            {showStreakInfo && (
              <View style={styles.infoBubble}>
                <Text style={styles.infoBubbleText}>
                  Streak, bir gün içinde en az 1 kelime ekleyip 5 review tamamladığında artar.
                </Text>
              </View>
            )}
            <Text style={styles.total}>{streak}</Text>
          </View>

          <View style={styles.streakVisualPlaceholder}>
            <Image
              source={treeImage}
              style={{ width: treeImageSize, height: treeImageSize }}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>
      </View>

      <Button title="Add Word" onPress={() => setModalVisible(true)} />

      <AddWordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onWordAdded={loadWords}
      />

      <Button title="Word List" onPress={() => navigation.navigate("Word List")} />

      <Button title="Recall Vocabulary" onPress={() => navigation.navigate("Review")} />

      <Button title="Log Out" onPress={onLogout} variant="text" />

    </LinearGradient>
  );
}
