import { StyleSheet } from "react-native";

const COLORS = {
  border: "#111827",
  fill: "#F5EFE6",
  text: "#111827",
  textVariant: "#6B7280",
  linkVariant: "#111827",

  // AI varyantı — HomeScreen'deki indigo-lavanta gradyan ailesiyle uyumlu
  aiBorder: "#4F46E5",
  aiText: "#3730A3",

  // success (Biliyorum) — streak kartlarındaki yeşil aileyle uyumlu
  successFill: "#E4F8EB",
  successBorder: "#6FCB8F",
  successText: "#15803D",

  // danger (Bilmiyorum) — aynı pastel dilde yumuşak kırmızı
  dangerFill: "#FDECEC",
  dangerBorder: "#EF9A9A",
  dangerText: "#B91C1C",
};

// AI butonunun gradyan renkleri — Buttons.js içinde LinearGradient'e veriliyor
export const AI_GRADIENT_COLORS = ["#E4E7FC", "#F3EEFB"];

const styles = StyleSheet.create({
  base: {
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.fill,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  text: {
    fontFamily: "Nunito-Bold",
    fontSize: 15,
  },

  disabled: {
    opacity: 0.4,
  },

  // primary — siyah çerçeve, boş/beyaz iç (Save, Add Word, I Know, Next...)
  primaryContainer: {},
  primaryText: {
    color: COLORS.text,
  },

  // text — çerçevesiz, ikincil aksiyon (Cancel)
  textContainer: {
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingVertical: 12,
    marginBottom: 0,
  },
  textVariantText: {
    fontFamily: "Nunito-Regular",
    color: COLORS.textVariant,
  },

  // link — çerçevesiz, düz metin aksiyonu (Example (AI), Listen)
  linkContainer: {
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingVertical: 8,
    marginBottom: 0,
  },
  linkVariantText: {
    fontFamily: "Nunito-Bold",
    color: COLORS.linkVariant,
    fontSize: 14,
    textDecorationLine: "underline",
  },

  // icon — yuvarlak, siyah çerçeveli boş ikon buton (swap-horizontal gibi)
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.fill,
    paddingVertical: 0,
    marginBottom: 0,
  },

  // ai — dış katman: sadece çerçeve + clip, iç dolgu LinearGradient'ten geliyor
  aiOuter: {
    borderColor: COLORS.aiBorder,
    backgroundColor: "transparent",
    paddingVertical: 0,
    overflow: "hidden",
  },
  aiGradient: {
    width: "100%",
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  aiText: {
    color: COLORS.aiText,
    letterSpacing: 0.2,
  },

  // success — Biliyorum
  successContainer: {
    borderColor: COLORS.successBorder,
    backgroundColor: COLORS.successFill,
  },
  successText: {
    color: COLORS.successText,
  },

  // danger — Bilmiyorum
  dangerContainer: {
    borderColor: COLORS.dangerBorder,
    backgroundColor: COLORS.dangerFill,
  },
  dangerText: {
    color: COLORS.dangerText,
  },
});

export const getVariantStyles = (variant) => {
  switch (variant) {
    case "text":
      return {
        container: styles.textContainer,
        text: styles.textVariantText,
        loadingColor: COLORS.textVariant,
      };
    case "link":
      return {
        container: styles.linkContainer,
        text: styles.linkVariantText,
        loadingColor: COLORS.linkVariant,
      };
    case "icon":
      return {
        container: styles.iconContainer,
        text: {},
        loadingColor: COLORS.text,
      };
    case "ai":
      return {
        container: styles.aiOuter,
        text: styles.aiText,
        loadingColor: COLORS.aiText,
      };
    case "success":
      return {
        container: styles.successContainer,
        text: styles.successText,
        loadingColor: COLORS.successText,
      };
    case "danger":
      return {
        container: styles.dangerContainer,
        text: styles.dangerText,
        loadingColor: COLORS.dangerText,
      };
    case "primary":
    default:
      return {
        container: styles.primaryContainer,
        text: styles.primaryText,
        loadingColor: COLORS.text,
      };
  }
};

export default styles;