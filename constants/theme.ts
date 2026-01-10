
import { Platform } from "react-native";

export const Colors = {
  light: {
    // ===== Brand scales =====
    primary: {
      100: "#DEB098FF",
      200: "#C59175FF",
      300: "#AD7253FF",
      400: "#945330FF",
      base: "#7B340EFF",
      600: "#622A0BFF",
      700: "#4A1F08FF",
      800: "#311506FF",
      900: "#251004FF",
    },

    secondary: {
      100: "#FFFEEEFF",
      200: "#FFFDDCFF",
      300: "#FFFBCBFF",
      400: "#FFFAB9FF",
      base: "#FFF9A8FF",
      600: "#E5DF86FF",
      700: "#CCC565FF",
      800: "#B2AA43FF",
      900: "#A59D32FF",
    },

    accent: {
      100: "#F0FAF0FF",
      200: "#E1F5E0FF",
      300: "#D1F0D1FF",
      400: "#C2EBC1FF",
      base: "#B3E6B2FF",
      600: "#95C994FF",
      700: "#77AC76FF",
      800: "#598F58FF",
      900: "#3B723AFF",
    },

    // ===== Neutral / Support =====
    supportBase: "#FAFAFAFF",

    greyscale: {
      0: "#FFFFFFFF",
      10: "#FAFAFAFF",
      20: "#F5F5F5FF",
      30: "#E5E5E5FF",
      40: "#D4D4D4FF",
      50: "#A3A3A3FF",
      60: "#737373FF",
      70: "#525252FF",
      80: "#404040FF",
      90: "#262626FF",
      100: "#000000FF",
    },

    // ===== Semantic =====
    positivePrimary: "#10A60AFF",
    positiveSecondary: "#69D454FF",
    positiveTertiary: "#DEFCB9FF",
    positiveText: "#0C9D11FF",

    attentionPrimary: "#FA8B1BFF",
    attentionSecondary: "#FCBC6FFF",
    attentionTertiary: "#FEF3CDFF",
    attentionText: "#F48619FF",

    negativePrimary: "#CF0D0DFF",
    negativeSecondary: "#F56865FF",
    negativeTertiary: "#FFE3E4FF",
    negativeText: "#CA0C0EFF",

    premiumPrimary: "#E546A7FF",
    premiumSecondary: "#FF99D9FF",
    premiumTertiary: "#FFE4F5FF",
    premiumText: "#DA409CFF",

    // ===== Data scale =====
    notation: {
      0: "#F7202DFF",
      20: "#FB541CFF",
      40: "#FB8B15FF",
      60: "#FDAE12FF",
      80: "#A0D911FF",
      100: "#54C41AFF",
    },
  },
} as const;

export type PawkaColors = typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono:
      "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
