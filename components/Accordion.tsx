import { Colors } from "@/constants/theme";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
  defaultExpanded?: boolean;
}

/**
 * Composant accordéon réutilisable
 */
export function Accordion({
  title,
  children,
  icon,
  defaultExpanded = false,
}: AccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={[styles.arrow, expanded && styles.arrowExpanded]}>▼</Text>
      </TouchableOpacity>

      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 6,
    elevation: 2,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    color: "#666",
    transform: [{ rotate: "0deg" }],
  },
  arrowExpanded: {
    transform: [{ rotate: "180deg" }],
  },
  content: {
    borderTopColor: Colors.light.greyscale[20],
    borderTopWidth: 1,
    padding: 16,
  },
});
