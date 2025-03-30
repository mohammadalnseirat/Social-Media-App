"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

//! 1-Function To Sync ClerkUser with the prisma(POST request):
export async function syncUser() {
  try {
    const user = await currentUser();
    const { userId } = await auth();

    if (!user || !userId) return;

    //?Find Existing User:
    const existingUser = await prisma.user.findUnique({
      where: {
        clerKId: userId,
      },
    });

    //?If User Exists, Return:
    if (existingUser) return existingUser;

    //?Create New User:
    const dbUser = await prisma.user.create({
      data: {
        clerKId: userId,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        image: user.imageUrl,
      },
    });

    //?Return New User:
    return dbUser;
  } catch (error) {
    console.log("Failed to sync user", error);
  }
}

//! 2-Function To Get User From Database based on The ClerkId:
export async function getUserByClerkId(clerKId: string) {
  return await prisma.user.findUnique({
    where: {
      clerKId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}

//! 3-Function To Get UserId from The Database:
export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  // ?Find User By ClerkId:
  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found!");
  }

  return user.id;
}

//! 4-Function To Get Suggested Users:
export async function getSuggestedUsers() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];
    //* get 6 random users exclude ourselves & users that we already follow
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        image: true,
        name: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
    });

    return randomUsers;
  } catch (error) {
    console.log("Error getting suggested users:", error);
    return [];
  }
}

//! 5-Function To Follow User:
export async function toggleFollowUser(targetUserId: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;
    if (userId === targetUserId) throw new Error("You can't follow yourself!");
    //* check if user is already following the target user:
    const existingFollowUser = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollowUser) {
      //! Unfollow User:
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      //! Follow User:
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),

        //! Create Notification:
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId, //? The user that is being followed
            creatorId: userId,
          },
        }),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error toggling follow user:", error);
    return { success: false, error: "Failed to toggle follow!" };
  }
}
