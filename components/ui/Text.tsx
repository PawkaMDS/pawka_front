import { Text as RNText, TextProps, StyleSheet } from "react-native";
import { FontFamilies, FontSizes } from "@/constants/typography";
import { Colors } from "@/constants/theme";

export function Text(props: TextProps) {
    return (
        <RNText
            {...props}
            style={[
                styles.base,
                props.style,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    base: {
        fontFamily: FontFamilies.text.regular,
        fontSize: FontSizes.bodyBase,
        color: Colors.light.greyscale[90],
    },
});
