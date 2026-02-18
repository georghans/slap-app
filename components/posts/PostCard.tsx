import { Image, View } from "react-native";
import { Text } from "@/components/ui/text";
import type { PostWithProfile } from "@/types/database";

function timeAgo(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function PostCard({ post }: { post: PostWithProfile }) {
  const displayName = post.profiles?.display_name ?? "Anonymous";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <View className="bg-card mb-3 overflow-hidden rounded-xl border border-border">
      {/* Author row */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        {post.profiles?.avatar_url ? (
          <Image
            source={{ uri: post.profiles.avatar_url }}
            className="h-8 w-8 rounded-full bg-muted"
          />
        ) : (
          <View className="h-8 w-8 items-center justify-center rounded-full bg-muted">
            <Text className="text-sm font-semibold text-muted-foreground">
              {initials}
            </Text>
          </View>
        )}
        <Text className="flex-1 font-semibold">{displayName}</Text>
        <Text variant="muted">{timeAgo(post.created_at)}</Text>
      </View>

      {/* Image */}
      <Image
        source={{ uri: post.image_url }}
        className="aspect-square w-full"
        resizeMode="cover"
      />

      {/* Description */}
      {post.description ? (
        <View className="px-4 py-3">
          <Text>{post.description}</Text>
        </View>
      ) : null}
    </View>
  );
}
