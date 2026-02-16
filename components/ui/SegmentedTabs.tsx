import React from "react";
import { View, Pressable, StyleSheet, ViewStyle } from "react-native";
import { Text } from "@/components/ui/Text";
import { Colors } from "@/constants/theme";
import { FontFamilies } from "@/constants/typography";

export type SegmentedTabItem<K extends string = string> = {
    key: K;
    label: string;
    icon?: React.ReactNode;
};

type Props<K extends string> = {
    items: SegmentedTabItem<K>[];
    activeKey: K;
    onChange: (key: K) => void;

    // ✅ new
    showLabel?: boolean;

    style?: ViewStyle;
};

export function SegmentedTabs<K extends string>({
    items,
    activeKey,
    onChange,
    showLabel = true,
    style,
}: Props<K>) {
    const c = Colors.light;

    return (
        <View style={[styles.wrap, { backgroundColor: c.primary.base }, style]}>
            {items.map((it) => {
                const active = it.key === activeKey;

                return (
                    <Pressable
                        key={it.key}
                        onPress={() => onChange(it.key)}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: active }}
                        accessibilityLabel={it.label} // ✅ label toujours dispo
                        style={[
                            styles.item,
                            active && [
                                styles.itemActive,
                                { backgroundColor: c.secondary.base },
                            ],
                        ]}
                    >
                        {it.icon ? <View style={styles.icon}>{it.icon}</View> : null}

                        {/* ✅ label optionnel visuellement */}
                        {showLabel ? (
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.label,
                                    {
                                        fontFamily: FontFamilies.text.bold,
                                        color: active ? c.primary.base : c.secondary.base,
                                    },
                                ]}
                            >
                                {it.label}
                            </Text>
                        ) : null}
                    </Pressable>
                );
            })}
        </View>
    );
}

const BAR_HEIGHT = 40;
const ACTIVE_HEIGHT = 54;

const styles = StyleSheet.create({
    wrap: {
        width: "100%",
        height: BAR_HEIGHT,          // ✅ barre marron = 40
        borderRadius: 999,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 6,
        gap: 6,
    },

    item: {
        flex: 1,
        height: BAR_HEIGHT,          // ✅ item normal = 40
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 10,
    },

    itemActive: {
        height: ACTIVE_HEIGHT,       // ✅ sélection = 54
        marginTop: -Math.round((ACTIVE_HEIGHT - BAR_HEIGHT) / 2), // ✅ dépasse
        borderRadius: 999,
    },

    icon: {
        alignItems: "center",
        justifyContent: "center",
    },

    label: {
        fontSize: 14,
        includeFontPadding: false,
    },
});


// à utiliser pour login register 
{/* <SegmentedTabs<AuthTabKey>
    items={[
        { key: "login", label: "Connexion" },
        { key: "register", label: "Créer un compte" },
    ]}
    activeKey={active}
    onChange={setActive}
    showLabel={true}
/> */}
