import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { HapticTab } from "@/components/haptic-tab";

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="search"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          title: "Recherche",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="magnifyingglass" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="scan/scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="qrcode.viewfinder" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="scan/_result"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="recommendation"
        options={{
          title: "Recommandation",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="star.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "Historique",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="clock.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="user/profile"
        options={{
          title: "Profil",
          tabBarLabel: "Profil",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
