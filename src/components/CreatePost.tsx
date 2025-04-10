import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react"
import { superbase } from "../superbase-client";

interface PostInput {
    title: string;
    content: string;
}



const createPost = async (post: PostInput, imageFile: File) =>{
    
    const filePath = `${post.title}-${Date.now()}-${imageFile.name}`

    const {error: uploadError} = await superbase.storage.from("posts-images").upload(filePath, imageFile)

    if (uploadError) throw new Error(uploadError.message);

    const {data: publicURLData} = superbase.storage.from("posts-images").getPublicUrl(filePath)

    const {data, error} = await superbase.from("posts").insert({...post, image_url: publicURLData.publicUrl});

    if (error) throw new Error(error.message);

   return data; 
}

export const CreatePost = () => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const {mutate} = useMutation({mutationFn: (data: {post: PostInput, imageFile: File}) =>{
       return createPost(data.post, data.imageFile); 
    }})
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) =>{
        if(e.target.files && e.target.files[0]){
            setSelectedFile(e.target.files[0]);
        }
    }

    const handleSubmit = (event: React.FormEvent) =>{
        event.preventDefault();
        if(!selectedFile) return;
        mutate({post:{title, content}, imageFile: selectedFile});
    }
    return  <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
    <div>
      <label htmlFor="title" className="block mb-2 font-medium">
        Title
      </label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-white/10 bg-transparent p-2 rounded"
        required
      />
    </div>
    <div>
      <label htmlFor="content" className="block mb-2 font-medium">
        Content
      </label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border border-white/10 bg-transparent p-2 rounded"
        rows={5}
        required
      />
    </div>

   

    <div>
      <label htmlFor="image" className="block mb-2 font-medium">
        Upload Image
      </label>
      <input
        type="file"
        id="image"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full text-gray-200"
      />
    </div>
    <button
      type="submit"
      className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
    >
      Create Post
    </button>

  </form>
}