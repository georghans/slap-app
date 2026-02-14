import { StyleSheet, View, Text, Pressable } from "react-native";
import { useAuth } from "@/hooks/useAuth";

export default function MapScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map</Text>
      <Text style={styles.subtitle}>
        Signed in as {user?.user_metadata?.full_name ?? user?.email}
      </Text>
      <Pressable style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  signOutButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  signOutText: {
    color: "#fff",
    fontWeight: "600",
  },
});
