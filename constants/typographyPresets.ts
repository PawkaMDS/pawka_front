import { FontFamilies, FontSizes } from "@/constants/typography";
import { Colors } from "@/constants/theme";

export const Typography = {
    h1: {
        fontFamily: FontFamilies.display.bold,
        fontSize: FontSizes.h1,
        lineHeight: Math.round(FontSizes.h1 * 1.15),
        color: Colors.light.greyscale[90],
    },
    h2: {
        fontFamily: FontFamilies.display.bold,
        fontSize: FontSizes.h2,
        lineHeight: Math.round(FontSizes.h2 * 1.15),
        color: Colors.light.greyscale[90],
    },
    h3: {
        fontFamily: FontFamilies.display.bold,
        fontSize: FontSizes.h3,
        lineHeight: Math.round(FontSizes.h3 * 1.15),
        color: Colors.light.greyscale[90],
    },
    h4: {
        fontFamily: FontFamilies.display.bold,
        fontSize: FontSizes.h4,
        lineHeight: Math.round(FontSizes.h4 * 1.2),
        color: Colors.light.greyscale[90],
    },
    h5: {
        fontFamily: FontFamilies.display.bold,
        fontSize: FontSizes.h5,
        lineHeight: Math.round(FontSizes.h5 * 1.2),
        color: Colors.light.greyscale[90],
    },
    h6: {
        fontFamily: FontFamilies.display.bold,
        fontSize: FontSizes.h6,
        lineHeight: Math.round(FontSizes.h6 * 1.25),
        color: Colors.light.greyscale[90],
    },

    bodyLarge: {
        fontFamily: FontFamilies.text.regular,
        fontSize: FontSizes.bodyLarge,
        lineHeight: Math.round(FontSizes.bodyLarge * 1.35),
        color: Colors.light.greyscale[90],
    },
    body: {
        fontFamily: FontFamilies.text.regular,
        fontSize: FontSizes.bodyBase,
        lineHeight: Math.round(FontSizes.bodyBase * 1.4),
        color: Colors.light.greyscale[90],
    },
    bodySmall: {
        fontFamily: FontFamilies.text.regular,
        fontSize: FontSizes.bodySmall,
        lineHeight: Math.round(FontSizes.bodySmall * 1.4),
        color: Colors.light.greyscale[80],
    },
    caption: {
        fontFamily: FontFamilies.text.regular,
        fontSize: FontSizes.caption,
        lineHeight: Math.round(FontSizes.caption * 1.35),
        color: Colors.light.greyscale[70],
    },
    label: {
        fontFamily: FontFamilies.text.medium,
        fontSize: FontSizes.label,
        lineHeight: Math.round(FontSizes.label * 1.2),
        color: Colors.light.greyscale[90],
    },
} as const;

export type TypographyPreset = keyof typeof Typography;
