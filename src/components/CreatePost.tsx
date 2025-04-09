import { useState } from "react"

export const CreatePost = () => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const handleSubmit = (event: React.FormEvent) =>{
        event.preventDefault();
    }
    return <form>
        <div>
            <label>Title</label>
            <input type="text" id='title' required onChange={(event)=> setTitle(event.target.value)}/>
        </div>
        <div>
            <label>Content</label>
            <textarea id='content' required rows={5} onChange={(event)=> setContent(event.target.value)}/>
        </div>
    <button type="submit"> Create Post</button>
    </form>
}