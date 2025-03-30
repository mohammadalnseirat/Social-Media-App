"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ImageIcon, Loader, SendIcon } from "lucide-react";
import { useState } from "react";
import { createPost } from "@/actions/post.action";
import showToast from "./ShowToast";

function CreatePost() {
  const { user } = useUser();
  if (!user) return null;
  const [postContent, setPostContent] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  //? Function To Handle Create Post:
  const handleCreatePost = async () => {
    if (!postContent.trim() && !postImageUrl) return;

    setIsPosting(true);
    try {
      const result = await createPost(postContent, postImageUrl);
      if (result?.success) {
        setPostContent("");
        setPostImageUrl("");
      }

      //? Show success toast
      showToast({ message: "Post created successfully!" });
    } catch (error) {
      console.log("Failed to create post:", error);
      // ! show toast error:
      showToast({ message: "Failed to create post!", type: "error" });
    } finally {
      setIsPosting(false);
    }
  };
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4 mb-4">
          <div className="flex space-x-4">
            <Avatar className="size-10">
              <AvatarImage src={user.imageUrl || "/modern.webp"} />
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              disabled={isPosting}
              className="min-h-[100px] resize-none border-none focus-visible:ring-2 focus-visible:ring-green-500 text-[13px] sm:text-sm md:text-base"
            />
          </div>
        </div>

        {/* TODO: SHOW IMAGE UPLOADER */}

        <div className="border-t pt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant={"ghost"}
              size={"sm"}
              className="text-muted-foreground hover:text-primary"
            >
              <ImageIcon className="size-4" />
              Add Photo
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="submit"
              variant={"default"}
              onClick={handleCreatePost}
              disabled={(!postContent.trim() && !postImageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  Posting...
                  <Loader className="size-5 animate-spin text-green-600" />
                </>
              ) : (
                <>
                  Post
                  <SendIcon className="size-4 text-green-600" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CreatePost;
