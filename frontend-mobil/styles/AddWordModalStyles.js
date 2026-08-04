import { StyleSheet } from "react-native";

export default StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  container: {
    backgroundColor: "#faf8f3",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },

  handle: {
    width: 50,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontFamily: "Nunito",
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 2,
  },

  label: {
    fontSize: 14,
    fontFamily: "Nunito",
    fontWeight: "500",
    color: "#6B7280",
  },

  swapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  swapButtonText: {
    fontSize: 20,
    fontFamily: "Nunito",
    color: "#FFF",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "Nunito",
    fontWeight: "500",
    color: "#111827",
  },

  meaningBox: {
    minHeight: 55,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    paddingHorizontal: 15,
    marginBottom: 25,
  },

  meaning: {
    fontSize: 16,
    fontFamily: "Nunito",
    fontWeight: "500",
    color: "#111827",
  },

  button: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },

  cancelButton: {
    alignItems: "center",
    paddingVertical: 12,
  },

  buttonText: {
    color: "#fff",
    fontFamily: "Nunito",
    fontWeight: "700",
    fontSize: 16,
  },

  cancelText: {
    color: "#6B7280",
    fontFamily: "Nunito",
    fontWeight: "500",
    fontSize: 16,
  },

  dragArea: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },

});