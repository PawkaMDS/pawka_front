import { Tabs } from "expo-router";
import React from "react";
import UserIcon from "@/assets/icons/user.svg";
import ScanIcon from "@/assets/icons/scan.svg";
import HeartIcon from "@/assets/icons/heart.svg";
import SearchIcon from "@/assets/icons/search.svg";
import HistoryIcon from "@/assets/icons/history.svg";
import { PawkaTabBar } from "@/components/navigation/PawkaTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="search"
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { position: 'absolute', backgroundColor: 'transparent', elevation: 0, borderTopWidth: 0 },
        sceneStyle: { backgroundColor: 'transparent' },
      }}
      tabBar={(props) => <PawkaTabBar {...props} />}
    >
      <Tabs.Screen
        name="scan/scan"
        options={{
          title: "Scan",
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
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
          tabBarIcon: ({ color }) => (
            <HistoryIcon width={22} height={22} fill={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="recommendation"
        options={{
          title: "Favoris",
          tabBarIcon: ({ color }) => (
            <HeartIcon width={22} height={22} fill={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Recherche",
          tabBarIcon: ({ color }) => (
            <SearchIcon width={22} height={22} fill={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="user/profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <UserIcon width={22} height={22} fill={color} />
          ),
        }}
      />
    </Tabs>
  );
}
