import React from "react";
import {
    Pressable,
    Text,
    View,
    StyleSheet,
    PressableProps,
    StyleProp,
    ViewStyle,
    TextStyle,
} from "react-native";

import { Colors } from "@/constants/theme";
import { FontFamilies } from "@/constants/typography";

type ButtonVariant = "primary" | "secondary" | "simple";
type IconPosition = "none" | "left" | "right";

type Props = Omit<PressableProps, "style"> & {
    label: string;

    variant?: ButtonVariant;

    // Icône optionnelle (SVG, icon component, etc.)
    icon?: React.ReactNode;
    iconPosition?: IconPosition;

    // Overrides couleurs
    textColor?: string;
    backgroundColor?: string;
    borderColor?: string;

    // Styles custom
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;

    // Optionnel
    fullWidth?: boolean;
    disabled?: boolean;
};

export function Button({
    label,
    variant = "primary",
    icon,
    iconPosition = icon ? "left" : "none",

    textColor,
    backgroundColor,
    borderColor,

    containerStyle,
    textStyle,

    fullWidth = false,
    disabled,
    ...pressableProps
}: Props) {
    const c = Colors.light;

    const defaults = getVariantDefaults(variant, c);

    const finalTextColor = textColor ?? defaults.textColor;
    const finalBgColor = backgroundColor ?? defaults.backgroundColor;
    const finalBorderColor = borderColor ?? defaults.borderColor;

    const showIcon = !!icon && iconPosition !== "none";

    return (
        <Pressable
            accessibilityRole="button"
            disabled={disabled}
            {...pressableProps}
            style={({ pressed }) => [
                styles.base,
                fullWidth && styles.fullWidth,
                {
                    backgroundColor: finalBgColor,
                    borderColor: finalBorderColor,
                    borderWidth: defaults.borderWidth,
                    opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
                },
                containerStyle,
            ]}
        >
            <View
                style={[
                    styles.content,
                    iconPosition === "right" ? styles.contentRight : null,
                ]}
            >
                {showIcon && iconPosition === "left" ? (
                    <View style={styles.iconWrap}>{icon}</View>
                ) : null}

                <Text
                    style={[
                        styles.label,
                        { color: finalTextColor, fontFamily: FontFamilies.text.regular },
                        textStyle,
                    ]}
                    numberOfLines={1}
                >
                    {label}
                </Text>

                {showIcon && iconPosition === "right" ? (
                    <View style={styles.iconWrap}>{icon}</View>
                ) : null}
            </View>
        </Pressable>
    );
}

function getVariantDefaults(
    variant: ButtonVariant,
    c: typeof Colors.light
): {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    borderWidth: number;
} {
    switch (variant) {
        case "primary":
            return {
                backgroundColor: c.primary.base,
                borderColor: c.primary.base,
                textColor: c.secondary.base, // style maquette: texte crème/jaune
                borderWidth: 0,
            };

        case "secondary":
            return {
                backgroundColor: "transparent",
                borderColor: c.primary.base,
                textColor: c.primary.base,
                borderWidth: 2,
            };

        case "simple":
        default:
            return {
                backgroundColor: "transparent",
                borderColor: "transparent",
                textColor: c.primary.base,
                borderWidth: 0,
            };
    }
}

const styles = StyleSheet.create({
    base: {
        // Padding 15 32
        paddingVertical: 15,
        paddingHorizontal: 32,

        borderRadius: 14,

        // Minimum pour un bon tap target
        minHeight: 48,
        justifyContent: "center",
        alignSelf: "flex-start",
    },

    fullWidth: {
        alignSelf: "stretch",
    },

    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12, // RN récent; sinon remplace par marginRight/marginLeft dans iconWrap
    },

    contentRight: {
        // Le label reste au centre visuellement si besoin :
        // (ici on garde juste l'ordre, icon à droite)
    },

    iconWrap: {
        alignItems: "center",
        justifyContent: "center",
    },

    label: {
        fontSize: 14,
        lineHeight: 18,
    },
});
