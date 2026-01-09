import { Tabs } from "expo-router";
import React from "react";
import { Colors } from "@/constants/theme";
import { HapticTab } from "@/components/haptic-tab";
import { FontFamilies } from "@/constants/typography";
import UserIcon from "@/assets/icons/user.svg";
import ScanIcon from "@/assets/icons/scan.svg";
import HeartIcon from "@/assets/icons/heart.svg";
import SearchIcon from "@/assets/icons/search.svg";
import HistoryIcon from "@/assets/icons/history.svg";

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
          textAlign: "center",
        },
      }}
    >
      <Tabs.Screen
        name="scan/scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) => (
            <ScanIcon width={22} height={22} fill={color} />
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
        name="history"
        options={{
          title: "Historique",
          tabBarIcon: ({ color, size }) => (
            <HistoryIcon width={22} height={22} fill={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="recommendation"
        options={{
          title: "Favoris",
          tabBarIcon: ({ color, size }) => (
            <HeartIcon width={22} height={22} fill={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Recherche",
          tabBarIcon: ({ color, size }) => (
            <SearchIcon width={22} height={22} fill={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="user/profile"
        options={{
          title: "Profil",
          tabBarLabel: "Profil",
          tabBarIcon: ({ color, size }) => (
            <UserIcon width={22} height={22} fill={color} />
          ),
        }}
      />
    </Tabs>
  );
}
