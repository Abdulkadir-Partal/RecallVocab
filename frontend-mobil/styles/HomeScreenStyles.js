import { StyleSheet } from "react-native";

// Ekran görüntüsündeki krem/zeytin paleti
export const HOME_GRADIENT_COLORS = ["#F7F2E7", "#F0E9D9"];
export const HOME_GRADIENT_START = { x: 0, y: 0 };
export const HOME_GRADIENT_END = { x: 1, y: 1 };
// Diğer exportların yanına ekle
export const ICON_COLOR = "#4B5D3A"; // OLIVE_DARK ile aynı, SVG ikonların fill rengi
// Rütbe arttıkça streak kartı daha koyu zeytin yeşiline dönüyor
export const STREAK_CARD_GRADIENTS = {
  1: ["#7C8A5E", "#5C6B45"],
  2: ["#748661", "#556544"],
  3: ["#6C8058", "#4E5F3D"],
  4: ["#5E7449", "#465737"],
  5: ["#4B5D3A", "#374630"],
};

export const STREAK_CARD_BORDER_COLORS = {
  1: "#5C6B45",
  2: "#556544",
  3: "#4E5F3D",
  4: "#465737",
  5: "#374630",
};

export const TREE_IMAGE_SIZES = {
  1: 64,
  2: 74,
  3: 84,
  4: 94,
  5: 104,
};

// Sadece görsel bilgi metni için eşikler ve isimler
export const TREE_STAGE_THRESHOLDS = [0, 7, 30, 100, 365];
export const TREE_STAGE_NAMES = {
  1: "Fidanın",
  2: "Fidanın",
  3: "Ağacın",
  4: "Ağacın",
  5: "Zeytin Ağacın",
};

const CREAM = "#F5EFE6";
const OLIVE_DARK = "#4B5D3A";
const TEXT_DARK = "#2F2A1E";
const TEXT_MUTED = "#7A7563";
const BORDER = "#E3DCC8";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 78,
    paddingBottom: 16,
  },

  scrollContent: {
    paddingBottom: 16,
  },

  title: {
    display: "none",
  },

  // ---- Streak kartı (tam genişlik) ----
  streakCardFull: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },

  streakLeftCol: {
    flex: 1,
    justifyContent: "center",
  },

  streakRightCol: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 14,
  },

  streakTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  streakCardTitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    color: "#F5F2E8",
  },

  streakBigNumber: {
    fontFamily: "Nunito-Bold",
    fontSize: 30,
    color: "#FFFFFF",
  },

  streakUnit: {
    fontFamily: "Nunito-Regular",
    fontSize: 15,
    color: "#E7E4D6",
  },

  streakEncourage: {
    fontFamily: "Nunito-Regular",
    fontSize: 12,
    color: "#E7E4D6",
    marginBottom: 8,
  },

  streakProgressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.25)",
    overflow: "hidden",
  },

  streakProgressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },

  infoButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  infoButtonText: {
    fontFamily: "Nunito-Bold",
    fontSize: 11,
    color: "#FFFFFF",
  },

  infoBubble: {
    backgroundColor: "#EFE9DA",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  infoBubbleText: {
    fontFamily: "Nunito-Regular",
    fontSize: 12,
    color: TEXT_MUTED,
    lineHeight: 17,
  },

  // ---- İstatistik kartları ----
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor: CREAM,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
  },

  cardTitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 13,
    color: TEXT_MUTED,
    marginBottom: 6,
  },

  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statIcon: {
    fontSize: 18,
  },

  total: {
    fontFamily: "Nunito-Bold",
    fontSize: 22,
    color: TEXT_DARK,
  },

  // ---- Ağaç kartı ----
  treeCard: {
    backgroundColor: CREAM,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 14,
    alignItems: "center",
  },

  treeCardTitle: {
    alignSelf: "flex-start",
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: TEXT_DARK,
  },

  treeCardSubtitle: {
    alignSelf: "flex-start",
    fontFamily: "Nunito-Regular",
    fontSize: 13,
    color: TEXT_MUTED,
    marginBottom: 8,
  },

  treeImageWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },

  treeProgressTrack: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E3DCC8",
    overflow: "hidden",
    marginTop: 8,
  },

  treeProgressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: OLIVE_DARK,
  },

  treeProgressText: {
    fontFamily: "Nunito-Regular",
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 6,
    alignSelf: "flex-start",
  },
});