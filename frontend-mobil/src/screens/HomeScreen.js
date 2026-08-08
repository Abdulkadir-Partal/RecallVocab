import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import styles, {
  HOME_GRADIENT_COLORS,
  HOME_GRADIENT_START,
  HOME_GRADIENT_END,
  STREAK_CARD_GRADIENTS,
  STREAK_CARD_BORDER_COLORS,
  TREE_IMAGE_SIZES,
  TREE_STAGE_THRESHOLDS,
  TREE_STAGE_NAMES,
  ICON_COLOR,
} from "../../styles/HomeScreenStyles";

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
import DictionaryIcon from "../../assets/gifs/book.svg";
import LeavesIcon from "../../assets/gifs/leaves.svg";

// Streak günü sulanmadıysa/sulandıysa dönen mesaj havuzları.
// streak değerine göre havuz içinde döner, ardışık günlerde tekdüze olmasın diye.
const NOT_WATERED_MESSAGES = [
  "Bugün ağacını sulamayı unutma 💧",
  "Henüz susuz kaldı, unutma.",
  "Bugünü tamamlamadan ağacın bekliyor.",
];

const WATERED_MESSAGES = [
  "Bugün suyunu verdin, aferin 🌿",
  "Ağacın bugün mutlu, devam et!",
  "Güzel gidiyorsun, kökler güçleniyor.",
];

const getTreeMessage = (isMaxStage, isGoalReallyCompleted, streak) => {
  if (isMaxStage) {
    return isGoalReallyCompleted
      ? "Zirvedesin, bugünü de tamamladın!"
      : "Zirvedesin, bugün de sulamayı unutma!";
  }

  const pool = isGoalReallyCompleted ? WATERED_MESSAGES : NOT_WATERED_MESSAGES;
  const index = streak % pool.length;
  return pool[index];
};

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

    if (currentStreak >= 365 || normalizedRank === "Diamond") return 5;
    if (currentStreak >= 100 || normalizedRank === "Gold") return 4;
    if (currentStreak >= 30 || normalizedRank === "Silver") return 3;
    if (currentStreak >= 7 || normalizedRank === "Bronze") return 2;
    return 1;
  };

  const treeStage = getTreeStage(streak, rank);
  const isGoalReallyCompleted = todayLearned >= 1 && todayReviews >= 5;
  const treeImage = TREE_IMAGES[treeStage][isGoalReallyCompleted ? "c" : "k"];
  const treeImageSize = TREE_IMAGE_SIZES[treeStage];

  // Sadece görsel amaçlı: mevcut streak/treeStage verisinden bir sonraki
  // seviyeye kalan gün ve ilerleme yüzdesini türetiyoruz. Yeni API çağrısı yok.
  const prevThreshold = TREE_STAGE_THRESHOLDS[treeStage - 1] ?? 0;
  const nextThreshold = TREE_STAGE_THRESHOLDS[treeStage];
  const isMaxStage = treeStage >= 5 || nextThreshold === undefined;
  const treeProgress = isMaxStage
    ? 1
    : Math.max(
        0,
        Math.min(1, (streak - prevThreshold) / (nextThreshold - prevThreshold))
      );
  const daysUntilNextStage = isMaxStage
    ? 0
    : Math.max(0, nextThreshold - streak);

  return (
    <LinearGradient
      colors={HOME_GRADIENT_COLORS}
      start={HOME_GRADIENT_START}
      end={HOME_GRADIENT_END}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Üstte tam genişlikte streak kartı */}
        <LinearGradient
          colors={STREAK_CARD_GRADIENTS[treeStage]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.streakCardFull,
            { borderColor: STREAK_CARD_BORDER_COLORS[treeStage] },
          ]}
        >
          <View style={styles.streakLeftCol}>
            <View style={styles.streakTitleRow}>
              <Text style={styles.streakCardTitle}>Streak </Text>
              <TouchableOpacity
                onPress={() => setShowStreakInfo(!showStreakInfo)}
                style={styles.infoButton}
              >
                <Text style={styles.infoButtonText}>i</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.streakBigNumber}>
              {streak} <Text style={styles.streakUnit}>gün</Text>
            </Text>
          </View>

          <View style={styles.streakRightCol}>
            <Text style={styles.streakCardTitle}>Ağacın 🌳</Text>
            <Text style={styles.streakEncourage}>
              {getTreeMessage(isMaxStage, isGoalReallyCompleted, streak)}
            </Text>
            <View style={styles.streakProgressTrack}>
              <View
                style={[
                  styles.streakProgressFill,
                  { width: `${treeProgress * 100}%` },
                ]}
              />
            </View>
          </View>
        </LinearGradient>

        {showStreakInfo && (
          <View style={styles.infoBubble}>
            <Text style={styles.infoBubbleText}>
              Streak, bir gün içinde en az 1 kelime ekleyip 5 review
              tamamladığında artar.
            </Text>
          </View>
        )}

        {/* İki küçük istatistik kartı */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>Toplam Kelime</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.total}>{totalWords}</Text>
              <DictionaryIcon width={25} height={25} fill={ICON_COLOR} />
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>Bugün Öğrenilen</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.total}>{todayLearned}</Text>
              <LeavesIcon width={22} height={22} />
            </View>
          </View>
        </View>

        {/* Büyük ağaç kartı */}
        <View style={styles.treeCard}>
          <Text style={styles.treeCardTitle}>
            {TREE_STAGE_NAMES[treeStage]}
          </Text>
          <Text style={styles.treeCardSubtitle}>Seviye {treeStage}</Text>

          <View style={styles.treeImageWrap}>
            <Image
              source={treeImage}
              style={{ width: treeImageSize * 2.2, height: treeImageSize * 2.2 }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.treeProgressTrack}>
            <View
              style={[
                styles.treeProgressFill,
                { width: `${treeProgress * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.treeProgressText}>
            {isMaxStage
              ? "Maksimum seviyedesin!"
              : `Bir sonraki seviye: ${daysUntilNextStage} gün kaldı`}
          </Text>
        </View>

        <Button title="Add Word" onPress={() => setModalVisible(true)} />

        <AddWordModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onWordAdded={loadWords}
        />

        <Button
          title="Word List"
          onPress={() => navigation.navigate("Word List")}
        />

        <Button
          title="Recall Vocabulary"
          onPress={() => navigation.navigate("Review")}
        />

        <Button title="Log Out" onPress={onLogout} variant="text" />
      </ScrollView>
    </LinearGradient>
  );
}