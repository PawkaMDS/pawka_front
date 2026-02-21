import { Colors } from "@/constants/theme";

import type { Product, ProductScores } from "@/types/product";

export const getOverallScore = (product?: Product | null): number | null => {
    const pf = product?.product_foods?.[0];
    
    // Priorité 1: Utiliser total_score si disponible
    if (pf?.total_score != null && typeof pf.total_score === "number") {
        return Math.max(0, Math.min(100, Math.round(pf.total_score)));
    }
    
    // Priorité 2: Utiliser scores.overall ou calculer depuis les scores détaillés
    const scores = pf?.scores as ProductScores | null | undefined;
    if (!scores) return null;

    if (typeof scores.overall === "number") {
        return Math.max(0, Math.min(100, Math.round(scores.overall)));
    }

    const keys: (keyof ProductScores)[] = [
        "protein_content",
        "fat_content",
        "carbohydrate_content",
        "fiber_content",
        "ingredient_quality",
        "protein_source_quality",
        "byproducts_presence",
        "chemical_additives",
        "beneficial_additives",
    ];

    let total = 0;
    for (const k of keys) {
        const item: any = scores[k];
        const pt = item?.pt;
        if (typeof pt !== "number") return null;
        total += pt;
    }

    return Math.max(0, Math.min(100, Math.round(total)));
};

export const getScoreBucket = (score: number): 0 | 20 | 40 | 60 | 80 | 100 => {
    const s = Math.max(0, Math.min(100, Math.round(score)));
    if (s >= 90) return 100;
    if (s >= 80) return 80;
    if (s >= 60) return 60;
    if (s >= 40) return 40;
    if (s >= 20) return 20;
    return 0;
};

export const getScoreColor = (score: number): string => {
    const bucket = getScoreBucket(score);
    return Colors.light.notation[bucket];
};

export const getScoreLabel = (score: number): string => {
    const s = Math.max(0, Math.min(100, Math.round(score)));
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Bon";
    if (s >= 40) return "Acceptable";
    if (s >= 20) return "Mauvais";
    return "À éviter";
};
