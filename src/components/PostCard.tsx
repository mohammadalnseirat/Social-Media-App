"use client";

import {
  addComment,
  deletePost,
  getPosts,
  toggleLikePost,
} from "@/actions/post.action";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import showToast from "./ShowToast";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import DeleteDialog from "./DeleteDialog";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Dot,
  HeartIcon,
  Loader,
  LogInIcon,
  MessageCircle,
  SendIcon,
} from "lucide-react";
import { Textarea } from "./ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostCard({ post, dbUserId }: { post: Post; dbUserId: string | null }) {
  const { user } = useUser();
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId)
  );
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const { ref, inView } = useInView();

  //! Function to handle like a post:
  const handleLikePost = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLikePost(post.id);
    } catch (error) {
      console.error("Failed to like post", error);
      setOptimisticLikes(post._count.likes);
      setHasLiked(post.likes.some((like) => like.userId === dbUserId));
    } finally {
      setIsLiking(false);
    }
  };

  //! Function to handle delete a post:
  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result.success)
        showToast({ message: "Post deleted successfully!", type: "success" });
      else throw new Error(result.error);
    } catch (error) {
      console.log("Error deleting post:", error);
      showToast({ message: "Failed to delete post!", type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  //! Function to handle Add Comment:
  const handleAddComment = async () => {
    if (!comment.trim() || isCommenting) return;
    setIsCommenting(true);
    try {
      const result = await addComment(post.id, comment);
      if (result?.success) {
        setComment("");
        showToast({ message: "Comment added successfully!", type: "success" });
      }
    } catch (error) {
      console.log("Failed to add comment:", error);
      showToast({ message: "Failed to add comment!", type: "error" });
    } finally {
      setIsCommenting(false);
    }
  };
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="hover:shadow-md hover:border hover:border-green-500 transition-all duration-200">
        <CardContent className="p-4 sm:p-6">
          <div className="spce-y-4">
            <div className="flex space-x-3 md:space-x-4">
              <Link href={`/profile/${post.author.username}`}>
                <Avatar className="size-8 sm:w-10 sm:h-10">
                  <AvatarImage src={post.author.image ?? "/modern.webp"} />
                </Avatar>
              </Link>
              {/*Post Content Header */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                    <Link
                      href={`/profile/${post.author.username}`}
                      className="truncate font-semibold"
                    >
                      {post.author.name}
                    </Link>
                    <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                      <Link href={`/profile/${post.author.username}`}>
                        @{post.author.username}
                      </Link>
                      <span className="text-green-500">•</span>
                      <span>
                        {formatDistanceToNow(new Date(post.createdAt))} ago
                      </span>
                    </div>
                  </div>
                  {/* Check if current user is the post author and show delete Dialog */}
                  {post.author.id === dbUserId && (
                    <DeleteDialog
                      title="Confirm Delete Post"
                      description="Are you sure you want to delete this post?"
                      isDeleting={isDeleting}
                      onDelete={handleDeletePost}
                    />
                  )}
                </div>
                {/* Post Content */}
                <p className="mt-3 break-words text-base text-foreground">
                  {post.content}
                </p>
              </div>
            </div>
            {/* Post Image */}
            {post.image && (
              <div className=" relative rounded-lg overflow-hidden">
                <Image
                  src={post.image}
                  fill
                  alt="Post Image"
                  className="object-cover w-full h-auto"
                />
              </div>
            )}
            {/* Like and Comment Section */}
            <div className="flex items-center space-x-4 pt-4">
              {user ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"ghost"}
                        size={"sm"}
                        className={` text-muted-foreground hover:text-red-500 hover:bg-transparent gap-2 ${
                          hasLiked ? "text-red-500 " : ""
                        }`}
                        onClick={handleLikePost}
                      >
                        {hasLiked ? (
                          <HeartIcon className="size-5 fill-current" />
                        ) : (
                          <HeartIcon className="size-5" />
                        )}
                        <span
                          className={`font-medium ${
                            hasLiked ? "text-red-500" : ""
                          }`}
                        >
                          {optimisticLikes}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {hasLiked ? "Unlike" : "Like"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <SignInButton>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground gap-2"
                  >
                    <HeartIcon className={`size-5`} />
                    <span
                      className={`font-medium ${
                        hasLiked ? "text-red-500" : ""
                      }`}
                    >
                      {optimisticLikes}
                    </span>
                  </Button>
                </SignInButton>
              )}
              {/* Comment Section */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"ghost"}
                      size={"sm"}
                      className="text-muted-foreground hover:bg-transparent hover:text-blue-500"
                      onClick={() => setShowComments((prev) => !prev)}
                    >
                      <MessageCircle
                        className={`size-5 ${
                          showComments ? "fill-blue-500 text-blue-500" : ""
                        }`}
                      />
                      <span
                        className={`font-medium  ${
                          post.comments.length > 0 ? "text-blue-500" : ""
                        }`}
                      >
                        {post.comments.length}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add Comments</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {
              //! Show comments if showComments is true
              showComments && (
                <>
                  <div className="pt-4 space-y-4 border-t">
                    <div className="space-y-4">
                      {/* Display comments */}
                      {post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex space-x-3 border-b pb-4"
                        >
                          <Avatar className="size-8 flex-shrink-0">
                            <AvatarImage
                              src={comment.author.image ?? "/modern.webp"}
                            />
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="font-medium hover:underline cursor-pointer">
                                {comment.author.name}
                              </span>
                              <span className="text-sm text-green-500">
                                <Dot />
                              </span>
                              <span className="text-xs text-muted-foreground">
                                @{comment.author.username}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(comment.createdAt)
                                )}
                              </span>
                            </div>
                            <p className="text-sm break-words mt-5">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Comment Form And Check if there is a user */}
                    {user ? (
                      <>
                        <div className="flex space-x-3">
                          <Avatar className="size-8 flex-shrink-0">
                            <AvatarImage
                              src={user.imageUrl ?? "/modern.webp"}
                            />
                          </Avatar>
                          <div className="flex-1">
                            <Textarea
                              placeholder="Add a comment..."
                              value={comment}
                              maxLength={200}
                              rows={3}
                              onChange={(e) => setComment(e.target.value)}
                              className="resize-none min-h-[180px] border focus-visible:ring-2 focus-visible:ring-green-500"
                            />
                            <div className="flex items-center justify-end lg:justify-between mt-4">
                              <p
                                className={`hidden text-xs lg:flex lg:items-center lg:gap-1`}
                              >
                                <span className="text-muted-foreground capitalize">
                                  remaining characters :{" "}
                                </span>
                                <span
                                  className={`font-bold ${
                                    comment.length >= 200
                                      ? "text-red-500"
                                      : "text-blue-500"
                                  }`}
                                >
                                  {200 - comment.length}
                                </span>
                              </p>
                              <Button
                                variant={"default"}
                                size={"sm"}
                                onClick={handleAddComment}
                                disabled={
                                  isCommenting ||
                                  comment.length === 0 ||
                                  !comment.trim()
                                }
                              >
                                {isCommenting ? (
                                  <div className="flex items-center gap-1">
                                    Commenting...
                                    <Loader className="size-4 animate-spin text-green-500" />
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    Comment
                                    <SendIcon className="size-5" />
                                  </div>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
                        <SignInButton mode="modal">
                          <Button variant="outline" className="gap-2">
                            <LogInIcon className="size-4" />
                            Sign in to comment
                          </Button>
                        </SignInButton>
                      </div>
                    )}
                  </div>
                </>
              )
            }
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default PostCard;
