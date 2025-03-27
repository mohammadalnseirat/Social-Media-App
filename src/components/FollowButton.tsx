"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import showToast from "./ShowToast";
import { toggleFollowUser } from "@/actions/user.action";

interface IFollowButtonProps {
  userId: string;
}

const FollowButton = ({ userId }: IFollowButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setIsLoading(true);
      const result = await toggleFollowUser(userId);
      if (result?.success) {
        showToast({ message: "User followed successfully!", type: "success" });
      }
    } catch (error) {
      console.log("Failed to follow user:", error);
      showToast({ message: "Failed to follow user!", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      size={"sm"}
      variant={"default"}
      onClick={handleFollow}
      className="w-20"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader className="size-4 animate-spin text-green-500" />
      ) : (
        "Follow"
      )}
    </Button>
  );
};

export default FollowButton;
