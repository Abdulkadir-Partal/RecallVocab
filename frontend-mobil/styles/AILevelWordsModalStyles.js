import { StyleSheet } from "react-native";

const CREAM = "#F7F2E7";
const CREAM_DEEP = "#F2ECDD";
const OLIVE = "#4B5D3A";
const TEXT_DARK = "#2F2A1E";
const TEXT_MUTED = "#7A7563";
const BORDER = "#E3DCC8";

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: CREAM,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 320,
    borderTopWidth: 1,
    borderColor: BORDER,
  },
  title: {
    fontSize: 18,
    fontFamily: "Nunito-Bold",
    marginBottom: 16,
    textAlign: "center",
    color: OLIVE,
  },
  levelLabel: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginBottom: 4,
    fontFamily: "Nunito-SemiBold",
  },
  progressLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 16,
    fontFamily: "Nunito-Regular",
  },
  wordBox: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: CREAM_DEEP,
    borderWidth: 1,
    borderColor: BORDER,
  },
  word: {
    fontSize: 30,
    fontFamily: "Nunito-Bold",
    color: OLIVE,
    letterSpacing: 0.2,
    textAlign: "center",
    marginBottom: 6,
    textShadowColor: "rgba(75, 93, 58, 0.12)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  meaning: {
    fontSize: 16,
    fontFamily: "Nunito",
    color: TEXT_DARK,
    marginTop: 8,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    color: OLIVE,
    fontFamily: "Nunito-Bold",
  },
  resultSubText: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Nunito-Regular",
  },
  closeArea: {
    marginTop: 16,
    alignItems: "center",
  },
  closeText: {
    color: TEXT_MUTED,
    fontFamily: "Nunito-Regular",
  },
});