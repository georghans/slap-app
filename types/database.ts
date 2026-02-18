export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  image_url: string;
  description: string | null;
  latitude: number;
  longitude: number;
  location_name: string | null;
  created_at: string;
  updated_at: string;
};

export type PostWithProfile = Post & {
  profiles: Pick<Profile, "display_name" | "avatar_url">;
};
