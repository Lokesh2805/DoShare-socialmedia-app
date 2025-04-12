import { useQuery } from "@tanstack/react-query";
import { superbase } from "../superbase-client";
import { PostItem } from "./PostItem";

export interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    image_url: string;
}

const fetchPosts = async (): Promise<Post[]> => {
 const {data, error} = await superbase.from("posts").select("*").order("created_at", {ascending: false});

 if(error) throw new Error(error.message);

 return data as Post[];
};

export const PostLists = () => {
  const {data, error, isLoading} = useQuery<Post[]>({ queryKey: ["posts"], queryFn: fetchPosts });

  if(isLoading) <div>Loading posts...</div>

  if(error) <div>Error: {error.message}</div>

  console.log(data);
  return <div className="flex flex-wrap gap-6 justify-center">
  {data?.map((post, key) => (
    <PostItem post={post} key={key} />
  ))}
</div>
};
