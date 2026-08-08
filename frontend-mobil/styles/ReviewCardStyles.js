import { StyleSheet } from "react-native";

// Tema paleti (HomeScreenStyles.js / ReviewScreenStyles.js ile aynı)
const CREAM = "#F5EFE6";
const OLIVE_DARK = "#4B5D3A";
const TEXT_DARK = "#2F2A1E";
const TEXT_MUTED = "#7A7563";
const BORDER = "#E3DCC8";
const BUBBLE_BG = "#EFE9DA";

// Trust point 0 -> kırmızımsı, 1 -> yeşilimsi. Doygunluk düşük tutuldu,
// böylece kart üzerinde yalın bir "durum rengi" gibi duruyor, göz yormuyor.
// Trust point 0 -> kırmızı, 0.5 -> turuncu, 1 -> yeşil.
// İki aşamalı geçiş: 0-0.5 arası kırmızıdan turuncuya, 0.5-1 arası turuncudan yeşile.
// Bu renkler bilinçli olarak tema paletinin dışında tutuldu; durum bilgisi taşıyor.
export const getTrustColor = (trust) => {
  const value = Math.max(0, Math.min(1, Number(trust) || 0));

  const stops = [
    { r: 239, g: 68, b: 68 },   // #EF4444 kırmızı  (0.0)
    { r: 249, g: 115, b: 22 },  // #F97316 turuncu   (0.5)
    { r: 16, g: 185, b: 129 },  // #10B981 yeşil     (1.0)
  ];

  const scaled = value * 2;
  const index = Math.min(1, Math.floor(scaled));
  const localT = scaled - index;

  const from = stops[index];
  const to = stops[index + 1];

  const r = Math.round(from.r + (to.r - from.r) * localT);
  const g = Math.round(from.g + (to.g - from.g) * localT);
  const b = Math.round(from.b + (to.b - from.b) * localT);

  return `rgb(${r}, ${g}, ${b})`;
};

export const getTrustCardStyles = (trustColor) => ({
  card: {
    borderTopWidth: 6,
    borderTopColor: trustColor,
  },
  trustText: {
    color: trustColor,
  },
});

export default StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: CREAM,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: OLIVE_DARK,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  word: {
    fontSize: 26,
    fontFamily: "Nunito",
    fontWeight: "700",
    color: TEXT_DARK,
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
    color: TEXT_MUTED,
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
    backgroundColor: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  infoButtonText: {
    fontSize: 11,
    fontFamily: "Nunito",
    fontWeight: "700",
    color: TEXT_MUTED,
  },

  infoBubble: {
    backgroundColor: BUBBLE_BG,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },

  infoBubbleText: {
    fontSize: 13,
    fontFamily: "Nunito",
    fontWeight: "500",
    color: TEXT_MUTED,
    lineHeight: 18,
  },

  meaning: {
    fontSize: 18,
    fontFamily: "Nunito",
    fontWeight: "500",
    color: TEXT_DARK,
    marginBottom: 20,
    lineHeight: 24,
  },

  button: {
    backgroundColor: OLIVE_DARK,
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
    color: OLIVE_DARK,
  },
});