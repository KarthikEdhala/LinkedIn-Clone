import { IUser } from "@/types/user";
import mongoose,{Document, Model, Schema, Types, models} from "mongoose";
import { Comment, IComment, ICommentBase } from "./comment";


export interface IPostBase{
    user: IUser;
    text: string;
    imageUrl?: string;
    comments?: IComment[];
    likes?: string[];
}

export interface IPost extends IPostBase,Document{
    _id:Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

interface IPostMethods{
    likePost(userId: string): Promise<void>;
    unlikePost(userId: string): Promise<void>;
    commentOnPost(comment:ICommentBase): Promise<void>;
    getAllComments(): Promise<IComment>;
    removePost(): Promise<void>;
}

export interface IPostDocument extends IPost,IPostMethods{
}

const PostSchema = new Schema<IPostDocument>(
    {
      user: {
        userId: { type: String, required: true },
        userImage: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String },
      },
      text: { type: String, required: true },
      imageUrl: { type: String },
      comments: { type: [Schema.Types.ObjectId], ref: "Comment", default: [] },
      likes: { type: [String] },
    },
    {
      timestamps: true,
    }
  );

PostSchema.methods.likePost=async function(userId: string){
    try{
           await this.updateOne({$addToSet:{likes:userId}});
    }catch(error){
        console.log("Failed to like post",error);
    }
}

PostSchema.methods.unlikePost=async function(userId: string){
    try{
        console.log("unliking");
           await this.updateOne({$pull:{likes:userId}});
    }catch(error){
        console.log("Failed to unlike post",error);
    }
}

PostSchema.methods.removePost=async function(){
    try{
        await this.model("Post").deleteOne({_id:this._id});
    }catch(error){
        console.log("error when removing the post",error);
    }
}

PostSchema.methods.commentOnPost = async function(commentToAdd: ICommentBase) {
    try {
        const comment = await Comment.create(commentToAdd);
        this.comments.push(comment._id);
        await this.save();
    } catch (error) {
        console.log("error when commenting on post", error);
    }
};


PostSchema.methods.getAllComments=async function(){
    try{
         await this.populate({
            path:"comments",
            options: {sort:{createdAt:-1}}
         });
         return this.comments;
    }catch(error){
        console.log("error when getting all comments", error);
    }
}


export const Post = models.Post || mongoose.model<IPostDocument>("Post",PostSchema);



