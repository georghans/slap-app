import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useCreatePost } from "@/hooks/useCreatePost";

export default function CreatePostModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ latitude: string; longitude: string }>();
  const latitude = parseFloat(params.latitude);
  const longitude = parseFloat(params.longitude);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const { createPost, isLoading } = useCreatePost();

  const pickImage = async (useCamera: boolean) => {
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Camera Access Required",
          "Please allow camera access in Settings to take photos.",
        );
        return;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Photo Library Access Required",
          "Please allow photo library access in Settings to choose photos.",
        );
        return;
      }
    }

    const launchFn = useCamera
      ? ImagePicker.launchCameraAsync
      : ImagePicker.launchImageLibraryAsync;

    const result = await launchFn({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert("Add Photo", "Choose a source", [
      { text: "Take Photo", onPress: () => pickImage(true) },
      { text: "Choose from Gallery", onPress: () => pickImage(false) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSave = async () => {
    if (!imageUri) {
      Alert.alert("Photo Required", "Please add a photo of the sticker.");
      return;
    }

    const success = await createPost({
      imageUri,
      description: description.trim() || undefined,
      latitude,
      longitude,
    });

    if (success) {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.headerAction}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>New Post</Text>
        <Pressable onPress={handleSave} disabled={isLoading} hitSlop={8}>
          <Text
            style={[
              styles.headerAction,
              styles.headerSave,
              isLoading && styles.headerDisabled,
            ]}
          >
            {isLoading ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.imagePicker} onPress={showImageOptions}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <IconSymbol name="camera.fill" size={48} color="#999" />
              <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
            </View>
          )}
        </Pressable>

        <TextInput
          style={styles.descriptionInput}
          placeholder="Add a description (optional)"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={500}
          textAlignVertical="top"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 16 : 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  headerAction: {
    fontSize: 17,
    color: "#0a7ea4",
  },
  headerSave: {
    fontWeight: "600",
  },
  headerDisabled: {
    opacity: 0.5,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
    gap: 16,
  },
  imagePicker: {
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: "#999",
  },
  descriptionInput: {
    fontSize: 16,
    minHeight: 80,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
});
