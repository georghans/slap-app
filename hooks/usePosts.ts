import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { PostWithProfile } from "@/types/database";

export function usePosts() {
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(display_name, avatar_url)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch posts:", error);
    } else {
      setPosts(data as PostWithProfile[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchPosts();
  }, [fetchPosts]);

  return { posts, isLoading, refresh };
}
