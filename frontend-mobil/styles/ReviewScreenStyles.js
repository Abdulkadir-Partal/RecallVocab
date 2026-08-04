import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf8f3",
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
    backgroundColor: "#F8FAFC",
  },

  progress: {
    fontSize: 14,
    fontFamily: "Nunito",
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 16,
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
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  sectionTitle: {
    fontFamily: "Nunito",
    fontWeight: "700",
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  sectionText: {
    fontFamily: "Nunito",
    fontWeight: "500",
    color: "#1E293B",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },

  listenButton: {
    marginTop: 18,
    fontSize: 15,
    fontFamily: "Nunito",
    fontWeight: "600",
    color: "#4F46E5",
  },

  audioButton: {
    marginTop: 10,
  },

  // --- YENİ EKLENEN STİLLER (DİĞERLERİNİ BOZMAZ) ---
  listenContainer: {
    flexDirection: "row",     // Elemanları yan yana dizer
    alignItems: "center",     // Simge ve yazıyı dikeyde tam olarak ortalar
    gap: 8,                   // Simge ile yazı arasına 8px boşluk bırakır
    marginTop: 14,            // Kart içindeki diğer elemanlardan ayrılması için üst boşluk
  },

  listenText: {
    fontFamily: "Nunito",
    fontWeight: "700",
    fontSize: 14,
    color: "#0066cc",         // Simgeden gelen mavi ton ile eşitledik
    letterSpacing: 0.5,
  },
});
