import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { Colors } from "@/constants/theme";
import { getScoreColor, getScoreLabel } from "@/utils/score";
import { Heading } from "./Heading";

type Props = {
    score: number; // 0..100
    variant?: "mini" | "large";
};

export function ScoreCard({ score, variant = "mini" }: Props) {
    const s = Math.max(0, Math.min(100, Math.round(score)));
    const bg = getScoreColor(s);

    if (variant === "mini") {
        return (
            <View style={[styles.miniPill, { backgroundColor: bg }]}>
                <Text style={styles.miniText}>{s} /100</Text>
            </View>
        );
    }

    const label = getScoreLabel(s);

    return (
        <View style={[styles.largeCard, { backgroundColor: bg }]}>
            <View style={styles.largeRow}>
                <Heading as="h1" style={styles.largeScore}>{s}</Heading>
                <Heading as="h4" style={styles.largeOutOf}>/100</Heading>
            </View>
            <Text style={styles.largeLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    // ===== MINI PILL =====
    miniPill: {
        height: 30,
        width: 90,
        paddingHorizontal: 12,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
    miniText: {
        color: Colors.light.greyscale[0],
        fontSize: 16,
        fontWeight: "800",
        lineHeight: 18,
    },

    // ===== LARGE CARD =====
    largeCard: {
        borderRadius: 12,
        paddingVertical: 24,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 120,
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
        fontWeight: "700",
        marginBottom: 8,
        marginLeft: 6,
        color: Colors.light.greyscale[0],
        opacity: 0.95,
    },
    largeLabel: {
        marginTop: 5,
        fontSize: 18,
        fontWeight: "700",
        color: Colors.light.greyscale[0],
    },
});
