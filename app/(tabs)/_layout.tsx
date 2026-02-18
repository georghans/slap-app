import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const handleCreatePress = async () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Location Required",
        "SLAP needs your location to tag where you found the sticker. Please enable location access in Settings.",
      );
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    router.push({
      pathname: "/post/create" as any,
      params: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="square.stack.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "",
          tabBarButton: () => (
            <View style={styles.createButtonWrapper}>
              <Pressable style={styles.createButton} onPress={handleCreatePress}>
                <IconSymbol size={32} name="plus.circle.fill" color="#fff" />
              </Pressable>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="map.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  createButtonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  createButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
});
