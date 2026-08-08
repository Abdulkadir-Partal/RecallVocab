import { StyleSheet } from "react-native";

const CREAM = "#F7F2E7";
const CREAM_CARD = "#FFFDF9";
const CREAM_DEEP = "#F2ECDD";
const OLIVE = "#4B5D3A";
const OLIVE_MUTED = "#6E7B57";
const TEXT_DARK = "#2F2A1E";
const TEXT_MUTED = "#7A7563";
const BORDER = "#E3DCC8";
const ACCENT_RED = "#C85A4A";

export const getTrustColor = (value) => {
    const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
    const normalized = Math.max(0, Math.min(1, safeValue));

    let red, green, blue;

    if (normalized <= 0.5) {
        const ratio = normalized / 0.5;
        red = Math.round(220 + (255 - 220) * ratio);
        green = Math.round(76 + (167 - 76) * ratio);
        blue = Math.round(61 + (94 - 61) * ratio);
    } else {
        const ratio = (normalized - 0.5) / 0.5;
        red = Math.round(255 - (255 - 92) * ratio);
        green = Math.round(167 + (122 - 167) * ratio);
        blue = Math.round(94 + (47 - 94) * ratio);
    }

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
        backgroundColor: CREAM,
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 15,
    },

    listContent: {
        paddingTop: 25,
        paddingBottom: 15,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: CREAM,
    },

    card: {
        backgroundColor: CREAM_CARD,
        borderRadius: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: BORDER,
        elevation: 3,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        overflow: "hidden",
    },

    cardInner: {
        padding: 18,
        borderRadius: 14,
        backgroundColor: CREAM_DEEP,
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
        color: OLIVE,
    },

    turkish: {
        marginTop: 6,
        color: TEXT_MUTED,
        fontFamily: "Nunito",
        fontWeight: "500",
        fontSize: 15,
    },

    detailsButton: {
        marginTop: 12,
        color: OLIVE_MUTED,
        fontFamily: "Nunito",
        fontWeight: "600",
    },

    deleteButton: {
        color: ACCENT_RED,
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
        borderColor: BORDER,
        paddingTop: 12,
    },

    sectionTitle: {
        fontFamily: "Nunito",
        fontWeight: "700",
        marginTop: 10,
        fontSize: 16,
        color: OLIVE,
    },

    sectionText: {
        fontFamily: "Nunito",
        fontWeight: "500",
        marginTop: 4,
        lineHeight: 22,
        color: TEXT_DARK,
    },

    listenContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        alignSelf: "flex-start",
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: CREAM_DEEP,
    },

    listenText: {
        fontFamily: "Nunito",
        fontWeight: "700",
        fontSize: 14,
        color: OLIVE,
        letterSpacing: 0.5,
    },

});