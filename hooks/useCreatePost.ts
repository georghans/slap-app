import { useState } from "react";
import { Alert } from "react-native";
import { File } from "expo-file-system";
import { decode } from "base64-arraybuffer";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

type CreatePostParams = {
  imageUri: string;
  description?: string;
  latitude: number;
  longitude: number;
};

export function useCreatePost() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const createPost = async (params: CreatePostParams): Promise<boolean> => {
    if (!user) {
      Alert.alert("Error", "You must be signed in to create a post.");
      return false;
    }

    setIsLoading(true);
    try {
      // Read image as base64 using the new File API
      const file = new File(params.imageUri);
      const base64 = await file.base64();

      // Determine file extension from URI
      const ext = params.imageUri.split(".").pop()?.toLowerCase() ?? "jpg";
      const fileName = `${user.id}/${Date.now()}.${ext}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("sticker-images")
        .upload(fileName, decode(base64), {
          contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("sticker-images")
        .getPublicUrl(fileName);

      // Insert post row
      const { error: insertError } = await supabase.from("posts").insert({
        user_id: user.id,
        image_url: urlData.publicUrl,
        description: params.description ?? null,
        latitude: params.latitude,
        longitude: params.longitude,
      });

      if (insertError) {
        throw insertError;
      }

      return true;
    } catch (error: any) {
      console.error("Create post error:", error);
      Alert.alert("Error", error.message ?? "Failed to create post.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPost, isLoading };
}
