import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { Colors } from "@/constants/theme";
import { FontFamilies } from "@/constants/typography";

type SwitchOption = {
  value: string;
  label: string;
};

type SwitchProps = {
  options: SwitchOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  backgroundColor?: string;
  activeColor?: string;
  textColor?: string;
  activeTextColor?: string;
};

export default function Switch({
  options,
  selectedValue,
  onValueChange,
  backgroundColor = Colors.light.greyscale[0],
  activeColor = Colors.light.premiumPrimary,
  textColor = Colors.light.primary.base,
  activeTextColor = Colors.light.greyscale[0],
}: SwitchProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {options.map((option) => {
        const isActive = selectedValue === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.button,
              isActive && { backgroundColor: activeColor },
            ]}
            onPress={() => onValueChange(option.value)}
          >
            <Text
              style={[
                styles.buttonText,
                { color: isActive ? activeTextColor : textColor },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 25,
    padding: 3,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    borderRadius: 22,
  },
  buttonText: {
    fontFamily: FontFamilies.text.medium,
    fontSize: 13,
  },
});