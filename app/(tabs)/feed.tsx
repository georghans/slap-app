import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native";
import { Text } from "@/components/ui/text";
import { PostCard } from "@/components/posts/PostCard";
import { usePosts } from "@/hooks/usePosts";

export default function FeedScreen() {
  const { posts, isLoading, refresh } = usePosts();

  if (isLoading && posts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerClassName="p-4"
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard post={item} />}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refresh} />
      }
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center pt-24">
          <Text variant="h3" className="mb-2">
            No posts yet
          </Text>
          <Text variant="muted">
            Be the first to share a sticker sighting!
          </Text>
        </View>
      }
    />
  );
}
