import { StyleSheet } from "react-native";

// Trust point 0 -> kırmızımsı, 1 -> yeşilimsi. Doygunluk düşük tutuldu,
// böylece kart üzerinde yalın bir "durum rengi" gibi duruyor, göz yormuyor.
// Trust point 0 -> kırmızı, 0.5 -> turuncu, 1 -> yeşil.
// İki aşamalı geçiş: 0-0.5 arası kırmızıdan turuncuya, 0.5-1 arası turuncudan yeşile.
export const getTrustColor = (trust) => {
  const value = Math.max(0, Math.min(1, Number(trust) || 0));

  const stops = [
    { r: 239, g: 68, b: 68 },   // #EF4444 kırmızı  (0.0)
    { r: 249, g: 115, b: 22 },  // #F97316 turuncu   (0.5)
    { r: 16, g: 185, b: 129 },  // #10B981 yeşil     (1.0)
  ];

  const scaled = value * 2; // 0-2 aralığına genişlet
  const index = Math.min(1, Math.floor(scaled)); // 0 veya 1
  const localT = scaled - index; // o aralık içindeki oran

  const from = stops[index];
  const to = stops[index + 1];

  const r = Math.round(from.r + (to.r - from.r) * localT);
  const g = Math.round(from.g + (to.g - from.g) * localT);
  const b = Math.round(from.b + (to.b - from.b) * localT);

  return `rgb(${r}, ${g}, ${b})`;
};

export const getTrustCardStyles = (trustColor) => ({
  card: {
    borderTopWidth: 6, // 4'ten 6'ya çıkarıldı
    borderTopColor: trustColor,
  },
  trustText: {
    color: trustColor,
  },
});

export default StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  word: {
    fontSize: 26,
    fontFamily: "Nunito",
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
    letterSpacing: 0.2,
  },

  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  trustTitle: {
    fontSize: 13,
    fontFamily: "Nunito",
    fontWeight: "600",
    color: "#64748B",
    marginRight: 8,
  },

  trustValue: {
    fontSize: 14,
    fontFamily: "Nunito",
    fontWeight: "700",
    marginRight: 8,
  },

  infoButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },

  infoButtonText: {
    fontSize: 11,
    fontFamily: "Nunito",
    fontWeight: "700",
    color: "#64748B",
  },

  infoBubble: {
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },

  infoBubbleText: {
    fontSize: 13,
    fontFamily: "Nunito",
    fontWeight: "500",
    color: "#475569",
    lineHeight: 18,
  },

  meaning: {
    fontSize: 18,
    fontFamily: "Nunito",
    fontWeight: "500",
    color: "#334155",
    marginBottom: 20,
    lineHeight: 24,
  },

  button: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Nunito",
    fontWeight: "700",
  },

  exampleButton: {
    marginTop: 8,
    alignItems: "center",
    paddingVertical: 8,
  },

  exampleText: {
    fontSize: 14,
    fontFamily: "Nunito",
    fontWeight: "600",
    color: "#4F46E5",
  },
});