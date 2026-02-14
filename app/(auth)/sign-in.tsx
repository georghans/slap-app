import { StyleSheet, View, Text, Pressable } from "react-native";
import { useAuth } from "@/hooks/useAuth";

export default function SignInScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SLAP</Text>
        <Text style={styles.subtitle}>
          Discover stickers in the wild
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.googleButton} onPress={signInWithGoogle}>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#000",
  },
  header: {
    alignItems: "center",
    marginBottom: 64,
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginTop: 8,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 320,
  },
  googleButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
