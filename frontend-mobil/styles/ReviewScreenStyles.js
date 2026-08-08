import { StyleSheet } from "react-native";

// HomeScreenStyles.js ile aynı palet
const CREAM = "#F5EFE6";
const BG = "#F7F2E7";
const OLIVE_DARK = "#4B5D3A";
const TEXT_DARK = "#2F2A1E";
const TEXT_MUTED = "#7A7563";
const BORDER = "#E3DCC8";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    padding: 20,
    alignItems: "center",
    paddingBottom: 50,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BG,
  },

  progress: {
    fontSize: 14,
    fontFamily: "Nunito",
    fontWeight: "600",
    color: TEXT_MUTED,
    marginBottom: 12,
    marginTop: 14,
    letterSpacing: 0.3,
  },

  reviewCard: {
    width: "100%",
    marginBottom: 18,
  },

  loadingInfo: {
    marginTop: 16,
  },

  detailCard: {
    marginTop: 16,
    backgroundColor: CREAM,
    borderRadius: 18,
    padding: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: OLIVE_DARK,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  sectionTitle: {
    fontFamily: "Nunito",
    fontWeight: "700",
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  sectionText: {
    fontFamily: "Nunito",
    fontWeight: "500",
    color: TEXT_DARK,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },

  listenButton: {
    marginTop: 18,
    fontSize: 15,
    fontFamily: "Nunito",
    fontWeight: "600",
    color: OLIVE_DARK,
  },

  audioButton: {
    marginTop: 10,
  },

  listenContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },

  listenText: {
    fontFamily: "Nunito",
    fontWeight: "700",
    fontSize: 14,
    color: OLIVE_DARK,
    letterSpacing: 0.5,
  },
});