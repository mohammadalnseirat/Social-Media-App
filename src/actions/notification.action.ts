"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";

//! 1-Function To Get All Notifications From Database:
export async function getAllNotifications() {
  try {
    const userId = await getDbUserId();

    if (!userId) return [];
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            image: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return notifications;
  } catch (error) {
    console.log("Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications!");
  }
}

//! 2-Function To Mark Notification As Read:
export async function markNotificationAsRead(notificationIds: string[]) {
  try {
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.log("Error marking notification as read:", error);
    throw new Error("Failed to mark notification as read!");
    return { success: false };
  }
}

//! 3-Function To Delete Notification:
export async function deleteNotification(notificationId: string) {
  try {
    await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });

    return { success: true };
  } catch (error) {
    console.log("Error deleting notification:", error);
    throw new Error("Failed to delete notification!");
    return { success: false };
  }
}
