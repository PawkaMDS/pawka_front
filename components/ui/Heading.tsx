import React from "react";
import { TextProps, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text"; // ton Text de base
import { Typography } from "@/constants/typographyPresets";

type Props = TextProps & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export function Heading({ as = "h1", style, ...props }: Props) {
    return (
        <Text
            {...props}
            style={[styles.reset, Typography[as], style]}
            // optionnel: pour l’accessibilité
            accessibilityRole="header"
        />
    );
}

const styles = StyleSheet.create({
    // “reset” pour ne pas hériter du body text du composant Text
    reset: {
        // On laisse vide, mais on le garde pour évoluer si besoin.
    },
});
