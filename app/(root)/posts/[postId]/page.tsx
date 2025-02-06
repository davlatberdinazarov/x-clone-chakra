"use client";

import { getPostAction, getPostComments } from "@/actions/post.actions";
import CommentItem from "@/components/shared/comment-item";
import Form from "@/components/shared/form";
import Header from "@/components/shared/header";
import { Avatar } from "@/components/ui/avatar";
import { sliceText } from "@/lib/utils";
import { IPost } from "@/types";
import { formatDistanceToNowStrict } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const params = useParams<{ postId: string }>();
  const { data: session, status }: any = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingComment, setIsFetchingComment] = useState(false);
  const [post, setPost] = useState<IPost | null>(null);
  const [comments, setComments] = useState<IPost[]>([]);

  const getPost = async () => {
    try {
      setIsLoading(true);
      const response = await getPostAction(params.postId);
      setPost(response.data); // Ma'lumotni set qilish
      if (response.success) {
        setPost(response.data); // Ma'lumotni set qilish
      } else {
        console.error("Error:", response.error);
      }

      setIsLoading(false);
    } catch (error) {
      console.log("Error in getPost:", error);
      setIsLoading(false);
    }
  };

  const getComments = async () => {
    try {
      setIsFetchingComment(true);
      const response = await getPostComments(params.postId);
      console.log("�� Fetched comments: ", response);
      if (response) {
        if (response.data) {
          setComments(response.data);
        }
      }
      setIsFetchingComment(false);
    } catch (error) {
      console.log(error);
      setIsFetchingComment(false);
    }
  };

  useEffect(() => {
    if (!params.postId || post || comments.length > 0) return; // Avoid re-fetching if data is already present
    getPost();
    getComments();
  }, []);

  console.log("Commments  ",comments)

  return (
    <>
      <Header label="Posts" isBack />

      {isLoading || status === "loading" ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="animate-spin text-sky-500" />
        </div>
      ) : (
        <>
          <div className="border-b-[1px] border-neutral-800 p-5 cursor-pointer bg-neutral-900 transition">
            <div className="flex flex-row items-center gap-3">
              <Avatar name={post?.user.name[0]} src={post?.user.profileImage} />

              <div>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-white font-semibold cursor-pointer hover:underline">
                    {post?.user.name}
                  </p>
                  <span className="text-neutral-500 cursor-pointer hover:underline hidden md:block">
                    {post && post?.user.username
                      ? `@${sliceText(post.user.username, 20)}`
                      : post && sliceText(post.user.email, 20)}
                  </span>
                  <span className="text-neutral-500 text-sm">
                    {post &&
                      post.createdAt &&
                      formatDistanceToNowStrict(new Date(post.createdAt))}
                  </span>
                </div>
                <div className="text-white mt-1">{post?.body}</div>
              </div>
            </div>
          </div>

          <Form
            placeholder="Post your reply?"
            user={JSON.parse(JSON.stringify(session.currentUser))}
            setPosts={setComments}
            postId={params.postId}
            isComment
          />

          {isFetchingComment ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="animate-spin text-sky-500" />
            </div>
          ) : Array.isArray(comments) ? (
            comments.map((comment) => (
              <CommentItem
                comment={comment}
                key={comment._id}
                user={JSON.parse(JSON.stringify(session.currentUser))}
                setComments={setComments}
                comments={comments}
              />
            ))
          ) : (
            <p>No comments available.</p>
          )}
        </>
      )}
    </>
  );
};

export default Page;
