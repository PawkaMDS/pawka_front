import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";
import { Text } from "@/components/ui/Text";
import { FontFamilies } from "@/constants/typography";

const HIDDEN = new Set(["scan/_result"]); // Hide technical routes

export function PawkaTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const c = Colors.light;

    // Visible routes only
    const visibleRoutes = state.routes
        .map((route, index) => ({ route, index }))
        .filter(({ route }) => !HIDDEN.has(route.name));

    return (
        <View style={styles.outer}>
            <View style={[styles.barWrapper, { paddingBottom: insets.bottom }]}>
                <View style={[styles.bar, { backgroundColor: c.secondary.base }]}>
                    {visibleRoutes.map(({ route, index }, visibleIndex) => {
                        const isFocused = state.index === index;
                        const { options } = descriptors[route.key];

                        const label = String(options.tabBarLabel ?? options.title ?? route.name);

                        const onPress = () => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name as never);
                            }
                        };

                        const icon = options.tabBarIcon?.({
                            focused: isFocused,
                            color: isFocused ? c.secondary.base : c.greyscale[90],
                            size: 22,
                        });

                        const showSeparator =
                            visibleIndex < visibleRoutes.length - 1 &&
                            !isFocused &&
                            !(state.index === visibleRoutes[visibleIndex + 1].index);

                        return (
                            <React.Fragment key={route.key}>
                                <Pressable
                                    onPress={onPress}
                                    style={[
                                        styles.item,
                                        isFocused && { backgroundColor: c.primary.base },
                                    ]}
                                >
                                    <View style={styles.iconWrap}>{icon}</View>
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            styles.label,
                                            {
                                                fontFamily: FontFamilies.text.medium,
                                                color: isFocused ? c.secondary.base : c.greyscale[90],
                                                marginTop: 2,
                                                fontSize: 11,
                                            },
                                        ]}
                                    >
                                        {label}
                                    </Text>
                                </Pressable>

                                {showSeparator ? (
                                    <View style={[styles.separator, { backgroundColor: c.primary[200] }]} />
                                ) : null}
                            </React.Fragment>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // Outer -> fullscreen
    outer: {
        width: "100%",
        backgroundColor: "transparent",
    },

    // Safe area + bar container
    barWrapper: {
        width: "100%",
    },

    bar: {
        width: "100%",
        flexDirection: "row",
        overflow: "hidden",
        minHeight: 96,
        alignItems: "stretch",

        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },

    item: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 6,
    },

    iconWrap: {
        marginBottom: 6,
        alignItems: "center",
        justifyContent: "center",
    },

    label: {
        fontSize: 14,
        lineHeight: 18,
        textAlign: "center",
        includeFontPadding: false,
    },

    separator: {
        width: 1,
        marginLeft: -0.5,
        marginRight: -0.5,
        marginVertical: 18,
        borderRadius: 999,
    },
});
