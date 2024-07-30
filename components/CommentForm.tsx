"use client";
import { useUser } from '@clerk/nextjs';
import React, { useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import createCommentAction from '@/actions/createCommentAction';
import { toast } from 'sonner';

function CommentForm({postId}:{postId:string}) {
  const ref=useRef<HTMLFormElement>(null);
  const {user}=useUser();

  const createCommentActionWithPostId = createCommentAction.bind(null, postId);


  const handleCommentAction=async (formData:FormData):Promise<void>=>{
        const formDataCopy=formData;
        ref.current?.reset();

        try{
          if(!user?.id){
            throw new Error("User not Authenticated");
          }
          await createCommentActionWithPostId(formDataCopy);
        }catch (error) {
          console.error(`Error creating comment: ${error}`);
    
          // Display toast
        }
  }
  return (
    <form ref={ref} action={(formData)=>{
      const promise = handleCommentAction(formData);
      toast.promise(promise,{
        loading: "Poasting Comment...",
        success: "Commented Post!",
        error: "Error creating the post"
    })
    }} className='flex items-center space-x-1'>
       <Avatar>
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-1 bg-white border rounded-full px-3 py-2'>
           <input type="text" name="commentInput" placeholder='Add a comment...' className='outline-none flex-1 text-sm bg-transparent'/>
           <button type="submit">
                submit
           </button>
        </div>
    </form>
  )
}

export default CommentForm