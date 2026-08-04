import { StyleSheet } from "react-native";

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 320,
  },
  title: {
    fontSize: 18,
    fontFamily: "Nunito",
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  levelLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  wordBox: {
    alignItems: "center",
    paddingVertical: 32,
  },
  word: {
    fontSize: 28,
    fontFamily: "Nunito",
    fontWeight: "700",
    color: "#111827",
  },
  meaning: {
    fontSize: 18,
    fontFamily: "Nunito",
    color: "#374151",
    marginTop: 8,
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
  },
  resultSubText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  closeArea: {
    marginTop: 16,
    alignItems: "center",
  },
  closeText: {
    color: "#9CA3AF",
  },
});