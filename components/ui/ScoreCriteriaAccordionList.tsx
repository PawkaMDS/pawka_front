import React, { useMemo, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "@/components/ui/Text";
import { Heading } from "@/components/ui/Heading";
import { Colors } from "@/constants/theme";
import { ScoreBar } from "@/components/ui/ScoreBar";
import type { ProductFood, ProductScores, ScoreDetail } from "@/types/product";
import Chevron from "@/assets/icons/chevron-left.svg";

type Criterion = {
    key: keyof ProductScores;
    title: string;
    max: number;
};

const CRITERIA: Criterion[] = [
    { key: "protein_content", title: "Teneur en protéines", max: 20 },
    { key: "fat_content", title: "Teneur en lipides", max: 10 },
    { key: "carbohydrate_content", title: "Teneur en glucides", max: 10 },
    { key: "fiber_content", title: "Teneur en fibres", max: 5 },
    { key: "ingredient_quality", title: "Type d’ingrédients", max: 15 },
    { key: "protein_source_quality", title: "Origine des protéines", max: 15 },
    { key: "byproducts_presence", title: "Présence de sous-produits", max: 10 },
    { key: "chemical_additives", title: "Additifs chimiques", max: 10 },
    { key: "beneficial_additives", title: "Additifs bénéfiques", max: 5 },
];

function isScoreDetail(x: unknown): x is ScoreDetail {
    return !!x && typeof x === "object" && "pt" in (x as any) && "rationale" in (x as any);
}

type Props = {
    productFood?: ProductFood | null;
};

export function ScoreCriteriaAccordionList({ productFood }: Props) {
    const scores = productFood?.scores as ProductScores | null | undefined;

    // build the list of items that actually exist
    const items = useMemo(() => {
        if (!scores) return [];
        return CRITERIA.map((c) => {
            const raw = (scores as any)[c.key];
            if (!isScoreDetail(raw)) return null;

            const pt = typeof raw.pt === "number" ? raw.pt : null;
            const rationale = typeof raw.rationale === "string" ? raw.rationale : null;

            if (pt === null) return null;

            return {
                ...c,
                pt,
                rationale,
            };
        }).filter(Boolean) as Array<Criterion & { pt: number; rationale: string | null }>;
    }, [scores]);

    const [openKey, setOpenKey] = useState<string | null>(null);

    if (!items.length) return null;

    return (
        <View style={styles.wrapper}>
            <Heading as="h5" style={styles.heading}>Détail des critères</Heading>

            <View style={styles.list}>
                {items.map((it, index) => {
                    const isOpen = openKey === String(it.key);
                    const isLast = index === items.length - 1;

                    return (
                        <View key={String(it.key)} style={styles.item}>
                            <Pressable
                                onPress={() => setOpenKey(isOpen ? null : String(it.key))}
                                style={({ pressed }) => [
                                    styles.row,
                                    pressed && { opacity: 0.95 },
                                ]}
                            >
                                {/* Left icon placeholder */}
                                <View style={styles.iconPlaceholder} />

                                {/* Center content */}
                                <View style={styles.center}>
                                    <Heading as="h4" style={styles.title}>{it.title}</Heading>

                                    <View style={styles.barRow}>
                                        <ScoreBar value={it.pt} max={it.max} />
                                    </View>
                                </View>

                                {/* Chevron */}
                                <Chevron
                                    width={14}
                                    height={14}
                                    style={[styles.chevron, isOpen && styles.chevronOpen]}
                                    fill={Colors.light.primary.base}
                                />
                            </Pressable>

                            {/* Expanded rationale */}
                            {isOpen && (
                                <View style={styles.rationaleBox}>
                                    <Text style={styles.rationaleText}>
                                        {it.rationale ?? "Aucune explication disponible."}
                                    </Text>
                                </View>
                            )}

                            {/* Divider */}
                            {!isLast && <View style={styles.divider} />}
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 12,
        backgroundColor: Colors.light.secondary[100],
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },

    heading: {
        color: Colors.light.primary.base,
    },

    list: {
        gap: 2,
    },

    item: {},

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 10,
        position: "relative",
    },

    iconPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 14,
        backgroundColor: Colors.light.greyscale[30],
    },

    center: {
        flex: 1,
        gap: 10,
    },

    title: {
        fontSize: 16,
        color: Colors.light.greyscale[90],
    },

    barRow: {
        paddingRight: 0,
    },

    chevron: {
        position: "absolute",
        top: 18,
        right: 0,
        transform: [{ rotate: "-90deg" }],
    },

    chevronOpen: {
        transform: [{ rotate: "90deg" }],
    },

    chevronText: {
        fontSize: 22,
        fontWeight: "800",
        color: Colors.light.primary.base,
        lineHeight: 22,
    },

    rationaleBox: {
        // marginLeft: 70 + 12, // align under text (icon width + gap)
        // paddingRight: 30 + 6, // avoid chevron area
        paddingBottom: 12,
    },

    rationaleText: {
        fontSize: 13,
        lineHeight: 19,
        color: Colors.light.greyscale[70],
    },

    divider: {
        height: 1,
        backgroundColor: Colors.light.greyscale[30],
    },
});
