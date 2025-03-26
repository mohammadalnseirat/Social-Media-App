"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

//! 1-Function To Create a Post:
export async function createPost(content: string, image: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) {
      throw new Error("Unauthorized user!");
    }

    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error: "Failed to create post!" };
  }
}
