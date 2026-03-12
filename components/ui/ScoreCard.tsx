import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { Colors } from "@/constants/theme";
import { getScoreColor, getScoreLabel } from "@/utils/score";
import { Heading } from "./Heading";

type Props = {
    score: number; // 0..100
    variant?: "mini" | "large" | "medium";
};

export function ScoreCard({ score, variant = "mini" }: Props) {
    const s = Math.max(0, Math.min(100, Math.round(score)));
    const bg = getScoreColor(s);

    if (variant === "mini") {
        return (
            <View style={[styles.miniPill, { backgroundColor: bg }]}>
                <Heading as="h6" style={styles.miniText}>{s} /100</Heading>
            </View>
        );
    }

    if (variant === "medium") {
        return (
            <View style={[styles.mediumCard, { backgroundColor: bg }]}>
                <Heading as="h6" style={styles.mediumScore}>{s} /100</Heading>
            </View>
        );
    }

    const label = getScoreLabel(s);

    return (
        <View style={[styles.largeCard, { backgroundColor: bg }]}>
            <View style={styles.largeRow}>
                <Heading as="h1" style={styles.largeScore}>{s}</Heading>
                <Heading as="h6" style={styles.largeOutOf}>/100</Heading>
            </View>
            <Heading as="h6" style={styles.largeLabel}>{label}</Heading>
        </View>
    );
}

const styles = StyleSheet.create({
    // ===== MINI PILL =====
    miniPill: {
        // height: 30,
        maxWidth: 88,
        paddingHorizontal: 8,
        paddingTop: 6,
        paddingBottom: 4,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    miniText: {
        color: Colors.light.greyscale[0],
        // fontSize: 16,
        lineHeight: 16,
    },

    // ===== LARGE CARD =====
    largeCard: {
        borderRadius: 12,
        paddingVertical: 24,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    largeRow: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    largeScore: {
        color: Colors.light.greyscale[0],
    },
    largeOutOf: {
        fontSize: 18,
        marginBottom: 8,
        marginLeft: 6,
        color: Colors.light.greyscale[0],
        opacity: 0.95,
    },
    largeLabel: {
        marginTop: 5,
        fontSize: 18,
        color: Colors.light.greyscale[0],
    },
    // ===== MEDIUM CARD =====
    mediumCard: {
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    mediumScore: {
        color: Colors.light.greyscale[0],
        fontSize: 24,
        fontWeight: "bold",
    },
});
