import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { Colors } from "@/constants/theme";
import { Heading } from "./Heading";

type Props = {
    value: number;   // ex: 18
    max: number;     // ex: 20
    showRightText?: boolean; // default true -> "18/20"
};

const SEGMENTS = [
    Colors.light.notation[0],
    Colors.light.notation[20],
    Colors.light.notation[40],
    Colors.light.notation[60],
    Colors.light.notation[80],
    Colors.light.notation[100],
];

export function ScoreBar({ value, max, showRightText = true }: Props) {
    const safeMax = Math.max(1, max);
    const v = Math.max(0, Math.min(safeMax, value));
    const ratio = v / safeMax; // 0..1

    // thumb position in % across the bar
    const leftPct = ratio * 100;

    // thumb color = bucket like your notation scale
    const pct100 = Math.round(ratio * 100);
    const bucket =
        pct100 >= 90 ? 100 :
            pct100 >= 80 ? 80 :
                pct100 >= 60 ? 60 :
                    pct100 >= 40 ? 40 :
                        pct100 >= 20 ? 20 : 0;

    const thumbColor = Colors.light.notation[bucket as 0 | 20 | 40 | 60 | 80 | 100];

    return (
        <View style={styles.row}>
            <View style={styles.barWrap}>
                <View style={styles.segments}>
                    {SEGMENTS.map((c, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.segment,
                                { backgroundColor: c },
                                idx === 0 && styles.leftRound,
                                idx === SEGMENTS.length - 1 && styles.rightRound,
                            ]}
                        />
                    ))}
                </View>

                {/* Thumb */}
                <View style={[styles.thumb, { left: `${leftPct}%`}]}>
                    <View style={[styles.thumbInner, { backgroundColor: thumbColor }]} />
                </View>
            </View>

            {showRightText && (
                <Heading as="h6" style={[styles.valueText, { color: thumbColor }]}>
                    {v}/{safeMax}
                </Heading>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    barWrap: {
        flex: 1,
        position: "relative",
        height: 10,
        justifyContent: "center",
    },

    segments: {
        flexDirection: "row",
        height: 4,
        overflow: "hidden",
    },

    segment: {
        flex: 1,
        marginRight: 2,
        borderRadius: 6,
    },

    leftRound: { borderTopLeftRadius: 999, borderBottomLeftRadius: 999 },
    rightRound: { borderTopRightRadius: 999, borderBottomRightRadius: 999 },

    thumb: {
        position: "absolute",
        top: 0,
        width: 10,
        height: 10,
        borderRadius: 999,
        marginLeft: -9, // center on position
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.light.greyscale[0],
    },
    thumbInner: {
        width: 8,
        height: 8,
        borderRadius: 999,
    },
    valueText: {
        width: 50,
        textAlign: "right",
        fontSize: 16,
    },
});
