"use client";

import {
  getAllNotifications,
  markNotificationAsRead,
} from "@/actions/notification.action";
import { NotificationsSkeleton } from "@/components/NotificationSkeleton";
import showToast from "@/components/ShowToast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HeartIcon, MessageCircle, UserPlus } from "lucide-react";
import DeleteDialog from "@/components/DeleteDialog";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

type Notifications = Awaited<ReturnType<typeof getAllNotifications>>;
type Notification = Notifications[number];

//! Function To Get Notifications Icon:
function getNotificationIcon(notificationType: string) {
  switch (notificationType) {
    case "LIKE":
      return <HeartIcon className="size-5 text-red-500" />;
    case "COMMENT":
      return <MessageCircle className="size-5 text-blue-500" />;
    case "FOLLOW":
      return <UserPlus className="size-5 text-green-500" />;
    default:
      return null;
  }
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchAllNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await getAllNotifications();
        setNotifications(data);

        const unreadIds = data
          .filter((notification) => !notification.read)
          .map((not) => not.id);
        if (unreadIds.length > 0) {
          await markNotificationAsRead(unreadIds);
        }
      } catch (error) {
        showToast({ message: "Failed to fetch notifications!", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    //! Call Afunction To Fetch All Notifications:
    fetchAllNotifications();
  }, []);

  if (isLoading) {
    return <NotificationsSkeleton />;
  }
  return (
    <div className="space-y-4 ">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader className="relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gradient-to-r after:from-blue-500 after:to-green-500">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg md:text-xl bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Notifications :
            </CardTitle>
            <span
              className={`text-xs sm:text-sm font-semibold text-blue-500 ${
                notifications.filter((not) => !not.read).length > 0 &&
                "animate-pulse text-red-500"
              }`}
            >
              {notifications.filter((not) => !not.read).length} unread
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {notifications.length === 0 ? (
              <Notifications />
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 border-b hover:bg-muted/50 transition-colors ${
                    !notification.read ? "bg-muted/50" : ""
                  }`}
                >
                  <Avatar className="mt-1">
                    <AvatarImage
                      src={notification.creator.image ?? "/modern.webp"}
                    />
                  </Avatar>
                  <div className="flex-1 space-y-2 mt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <span className="font-medium">
                        {notification.creator.name ??
                          notification.creator.username}
                      </span>
                      <span
                        className={`${
                          notification.type === "LIKE"
                            ? "text-red-500"
                            : notification.type === "FOLLOW"
                            ? "text-green-500"
                            : "text-blue-500"
                        } animate-pulse`}
                      >
                        {notification.type === "FOLLOW"
                          ? "Started Followed you"
                          : notification.type === "LIKE"
                          ? " liked your post"
                          : "Add commented on your post"}
                      </span>
                    </div>
                    {/* Post Notification */}
                    {notification.post &&
                      (notification.type === "LIKE" ||
                        notification.type === "COMMENT") && (
                        <div className="pl-6 space-y-2">
                          <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                            <p>{notification.post.content}</p>
                            {notification.post.image && (
                              <div className="relative overflow-hidden">
                                <Image
                                  src={notification.post.image}
                                  fill
                                  alt="Post Image"
                                  className="mt-2 w-full rounded-md max-w-[200px] h-auto object-cover"
                                />
                              </div>
                            )}
                          </div>
                          {notification.type === "COMMENT" && (
                            <div className="p-2 bg-accent/50 rounded-md text-sm">
                              {notification.comment?.content}
                            </div>
                          )}
                        </div>
                      )}
                    <p className="text-sm text-muted-foreground pl-6">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotificationsPage;

const Notifications = () => {
  const letters = Array.from("No Notifications Found");
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.05 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="flex items-center mt-5 justify-center text-blue-500 hover:text-blue-600 transition-colors  cursor-pointer"
    >
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          key={index}
          className="text-base sm:text-lg md:text-2xl font-bold text-center"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};
