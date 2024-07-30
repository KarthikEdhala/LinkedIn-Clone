"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { S3 } from "aws-sdk";
import { revalidatePath } from "next/cache";
import { Readable } from "stream";

//AWS S3 Configuration
const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

// Utility function to convert a File to a readable stream
const fileToStream = async (file: File): Promise<Readable> => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return Readable.from(buffer);
};

// Function to upload file to S3
const uploadImageToS3 = async (file: File): Promise<string> => {
    const fileStream = await fileToStream(file);

    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `uploads/${Date.now()}_${file.name}`, // You might want to make the filename unique
        Body: fileStream,
        ContentType: file.type,
        //ACL: 'public-read', // Adjust permissions as needed
    };

    const { Location } = await s3.upload(uploadParams);
    return Location;
};

export default async function createPostAction(formData: FormData){
    const user= await currentUser();

    if(!user){
        throw new Error("User not authenticated");
    }

    const postInput=formData.get("postInput") as string;
    const image=formData.get("image") as File;
    let imageURL=undefined;

    if(!postInput){
        throw new Error("post input is required");
    }

    //define user
    const userDB: IUser={
        userId: user.id,
        userImage: user.imageUrl,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
    }
    
    try{
        if (image.size>0){
            //1.upload image if there is one
            //2.create the post in the database with image
            imageURL = await uploadImageToS3(image);

            const body:AddPostRequestBody={
                user:userDB,
                text:postInput,
                imageUrl:imageURL,
            }

            await Post.create(body);
        }
        else{
            //1.create the post in the databse without image.
            const body:AddPostRequestBody={
                user:userDB,
                text:postInput,
            }
    
            await Post.create(body);
        }
    }catch(error:any){
        console.log("Fialed to create post",error);
    }

    //revalidate the home page
    revalidatePath('/');
}