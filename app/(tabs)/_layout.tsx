import { Tabs } from "expo-router";
import React from "react";
import { Colors } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { HapticTab } from "@/components/haptic-tab";
import { FontFamilies } from "@/constants/typography";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="search"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.primary.base,
        tabBarInactiveTintColor: Colors.light.greyscale[60],
        tabBarButton: HapticTab,

        tabBarLabelStyle: {
          fontFamily: FontFamilies.text.bold,
          fontSize: 12,
        },
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
          title: "Favoris",
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
