import { IPostDocument} from '@/mongodb/models/post'
import React from 'react'
import Post from './Post'
import { Types } from 'mongoose';

function PostFeed({posts}:{posts:IPostDocument[]}) {
  return (
    <div className='space-y-2 pb-20 mt-2'>
        {
            posts.map((post) => {
                return <Post  post={post} />;
              })              
        }
    </div>
  )
}

export default PostFeed