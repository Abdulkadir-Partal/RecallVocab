import { StyleSheet } from "react-native";

// Gradyan renkleri burada tanımlı — HomeScreen.js içinde LinearGradient'e
// bu diziyi veriyoruz. Çok hafif indigo-lavanta tonundan beyaza geçiş,
// siyah çerçeveli/beyaz iç buton tasarımıyla çakışmayacak kadar sakin.
export const HOME_GRADIENT_COLORS = ["#F5EFE6", "#dee5ec", "#b2bbc6"];
export const HOME_GRADIENT_START = { x: 0, y: 0 };
export const HOME_GRADIENT_END = { x: 1, y: 1 };

// Rütbe (1-5) arttıkça streak kartının arka planı gittikçe daha yoğun yeşile
// dönüyor. Her aşama için hafif diyagonal bir gradyan tanımlı.
export const STREAK_CARD_GRADIENTS = {
  1: ["#FFFFFF", "#f5efe6"],
  2: ["#F3FBF6", "#caccc0"],
  3: ["#E4F8EB", "#9cab9f"],
  4: ["#D2F2DE", "#718a85"],
  5: ["#BDECCE", "#4b696f"],
};

export const STREAK_CARD_BORDER_COLORS = {
  1: "#f5efe6",
  2: "#caccc0",
  3: "#9cab9f",
  4: "#718a85",
  5: "#4b696f",
};

// Rütbe arttıkça ağaç görseli de kademeli büyüyor, ama kartı taşırmayacak
// şekilde sınırlı artışlarla.
export const TREE_IMAGE_SIZES = {
  1: 64,
  2: 74,
  3: 84,
  4: 94,
  5: 104,
};

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 60,
  },

  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 28,
    color: "#111827",
    marginBottom: 4,
  },

  subtitle: {
    fontFamily: "Nunito-Regular",
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 28,
  },

  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  leftColumn: {
    flex: 1,
    gap: 12,
  },

  statsCard: {
    backgroundColor: "#F5EFE6",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#caccc0",
    padding: 16,
  },

  cardTitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },

  total: {
    fontFamily: "Nunito-Bold",
    fontSize: 26,
    color: "#111827",
  },

  streakCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    justifyContent: "space-between",
  },

  streakTextWrap: {
    marginBottom: 8,
  },

  streakTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  infoButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#111827",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  infoButtonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 11,
    color: "#111827",
  },

  infoBubble: {
    backgroundColor: "#F5F6FA",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },

  infoBubbleText: {
    fontFamily: "Nunito-Regular",
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 17,
  },

  streakVisualPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  treeImage: {
    width: 84,
    height: 84,
  },

  streakRankText: {
    fontFamily: "Nunito-Bold",
    fontSize: 13,
    color: "#374151",
  },
});