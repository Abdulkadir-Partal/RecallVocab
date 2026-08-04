import { StyleSheet } from "react-native";

export const getTrustColor = (value) => {
    const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
    const normalized = Math.max(0, Math.min(1, safeValue));

    const start = [248, 144, 72];
    const end = [34, 197, 94];

    const red = Math.round(start[0] + (end[0] - start[0]) * normalized);
    const green = Math.round(start[1] + (end[1] - start[1]) * normalized);
    const blue = Math.round(start[2] + (end[2] - start[2]) * normalized);

    const tintRed = Math.round(255 - (255 - red) * 0.86);
    const tintGreen = Math.round(255 - (255 - green) * 0.86);
    const tintBlue = Math.round(255 - (255 - blue) * 0.86);

    return {
        color: `rgb(${red}, ${green}, ${blue})`,
        tint: `rgba(${tintRed}, ${tintGreen}, ${tintBlue}, 0.20)`,
        shadow: `rgba(${red}, ${green}, ${blue}, 0.28)`,
    };
};

export const getTrustCardStyles = (trustStyle) => ({
    card: {
        borderColor: trustStyle.color,
        borderWidth: 2,
        shadowColor: trustStyle.shadow,
        shadowOpacity: 0.35,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
    },
    cardInner: {
        backgroundColor: trustStyle.tint,
    },
    trustBadge: {
        backgroundColor: trustStyle.color,
    },
    trustText: {
        color: trustStyle.color,
    },
});

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#faf8f3",
        padding: 15,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        overflow: "hidden",
    },

    cardInner: {
        padding: 18,
        borderRadius: 12,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    cardTextContainer: {
        flex: 1,
    },

    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },

    trustBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        marginLeft: 10,
    },

    trustBadgeText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontFamily: "Nunito",
        fontWeight: "700",
    },

    english: {
        fontSize: 18,
        fontFamily: "Nunito",
        fontWeight: "700",
        color: "#111827",
    },

    turkish: {
        marginTop: 6,
        color: "#6B7280",
        fontFamily: "Nunito",
        fontWeight: "500",
        fontSize: 15,
    },

    detailsButton: {
        marginTop: 12,
        color: "#2563eb",
        fontFamily: "Nunito",
        fontWeight: "600",
    },

    deleteButton: {
        color: "#ef4444",
    },

    trust: {
        marginTop: 12,
        fontFamily: "Nunito",
        fontWeight: "600",
    },

    listenButton: {
        marginTop: 10,
        color: "#2563eb",
        fontFamily: "Nunito",
        fontWeight: "600",
    },

    detailsContainer: {
        marginTop: 15,
        borderTopWidth: 1,
        borderColor: "#ddd",
        paddingTop: 12,
    },

    sectionTitle: {
        fontFamily: "Nunito",
        fontWeight: "700",
        marginTop: 10,
    },

    sectionText: {
        fontFamily: "Nunito",
        fontWeight: "500",
        marginTop: 4,
        lineHeight: 22,
    },
    listenContainer: {
    flexDirection: 'row',     // Elemanları yan yana dizer
    alignItems: 'center',     // Simge ve yazıyı dikeyde tam ortalar
    gap: 8,                   // Simge ile yazı arasına 8px boşluk bırakır
    // Eğer buton gibi tıklanabilir olsun isterseniz padding ekleyebilirsiniz:
    // padding: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    // listenButton içindeki eski buton stillerini (metin için olanları) buraya taşıyabilirsiniz
  },
  listenText: {
    fontFamily: "Nunito",
    fontWeight: "700",
    fontSize: 14,
    color: "#0066cc",         // Simgeden gelen mavi ton ile eşitledik
    letterSpacing: 0.5,
  },

});