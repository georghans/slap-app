import { Redirect } from "expo-router";

// Placeholder screen required by Expo Router for the tab.
// The tab press is intercepted by a custom tabBarButton, so this never renders.
export default function CreatePlaceholder() {
  return <Redirect href="/(tabs)/feed" />;
}
