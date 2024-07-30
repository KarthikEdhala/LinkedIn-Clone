
import PostFeed from "@/components/PostFeed";
import PostForm from "@/components/PostForm";
import UserInformation from "@/components/UserInformation";
import Widget from "@/components/Widget";
import { connectDB } from "@/mongodb/db";
import { IComment } from "@/mongodb/models/comment";
import { IPostDocument, Post } from "@/mongodb/models/post";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";



export default async function Home() {
  await connectDB();
  const posts: IPostDocument[] = await Post.find()
    .populate({ path: "comments", options: { sort: { createdAt: -1 } } })
    .lean();
  return (
    <main className="grid grid-cols-8 mt-5 sm:px-5">
          {/*User Information*/}
          <section className="hidden md:inline md:col-span-2">
            <UserInformation posts={posts}/>
          </section>

          {/*Post Form*/} {/*Post Feed*/}
          <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full">
              <SignedIn>
                  <PostForm/>
              </SignedIn>
              <PostFeed posts={posts}/>
          </section>

          {/*widget*/}
          <section className="hidden xl:inline justify-center xl:col-span-2 ">
               <Widget/>
          </section>
    </main>
  );
}
