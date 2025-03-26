"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

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
  if (!clerkId) throw new Error("Unauthorized user!");
  // ?Find User By ClerkId:
  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found!");
  }

  return user.id;
}
