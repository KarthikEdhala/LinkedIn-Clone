'use client'

import { useUser } from '@clerk/nextjs'
import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { ImageIcon, XIcon } from 'lucide-react';
import createPostAction from '@/actions/createPostAction';
import { toast } from 'sonner';


function PostForm() {
  
  const {user}=useUser();
  const ref=useRef<HTMLFormElement>(null);
  const fileInputRef=useRef<HTMLInputElement>(null);
  const [preview,setPreview]=useState<string | null>(null);
  
  const handleImageChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
    const file=event.target.files?.[0];
    if (file){
        setPreview(URL.createObjectURL(file));
    }
  }
  const handlePostAction= async (formData: FormData)=>{
    const formDataCopy=formData;
    ref.current?.reset();

    const text=formDataCopy.get("postInput") as string;

    if(!text.trim())
        {
            throw new Error("You must provide a post input");
        }

    setPreview(null);
    try{
        await createPostAction(formDataCopy);
    }catch(error){
        console.log("Error creating the post:",error)
    }
  }
  
  return (
    <div>
        <form ref={ref} action={(formData)=>{
            //Handle form submission using the server action
            const promise=handlePostAction(formData);
            toast.promise(promise,{
                loading: "Creating post...",
                success: "Post created!",
                error: (e) => "Error creating post: " + e.message,
            })
            //Toast notification based on the promise above
        }} className='p-3 bg-white rounded-lg border'>
            <div className='flex items-center space-x-2'>
                <Avatar>
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <input type="text" name="postInput" placeholder='start writing a post...'
                  className='flex-1 outline-none rounded-full py-3 px-4 border'/>
                <input ref={fileInputRef} type="file" name="image" accept='image/*' hidden onChange={handleImageChange}/>  
                <button type="submit" hidden>post</button>
            </div>
            {/*preview conditional check*/}
            {
                preview && (
                    <div className='mt-3'>
                        <img src={preview} alt="Preview" className='w-full object-cover'/>
                    </div>
                )
            }
            <div className='flex justify-end mt-2 space-x-2'>
                <Button type="button" variant={preview?'secondary':'outline'} onClick={()=>fileInputRef.current?.click()}>
                    <ImageIcon className='mr-2' size={16} color="currentColor"/>
                    {preview?'Change ':'Add '}image
                </Button>
                {preview && (
                    <Button variant="outline" type="button" onClick={()=>setPreview(null)}>
                        <XIcon className='mr-2' size={16} color="currentcolor"/>
                        Remove Image
                    </Button>
                )}
            </div>
        </form>
        <hr className="mt-2 border-gray-300"/>
    </div>
  )
}

export default PostForm