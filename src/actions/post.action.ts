"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

//! 1-Function To Create a Post:
export async function createPost(content: string, image: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

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

//! 2-Function to get Posts from Database:
export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    revalidatePath("/");
    return posts;
  } catch (error) {
    console.log("Failed to get posts:", error);
    return [];
  }
}

//! 3-Function to handle Like A Post:
export async function toggleLikePost(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const existingLikePost = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    //?Find Post By Id:
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found!");

    if (existingLikePost) {
      //! Delete existing like post:
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      //! Create new Like Post:
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId, //! recipient (post author)
                  creatorId: userId, //! person who liked
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Failed to toggle like post:", error);
    return { success: false, error: "Failed to like and unlike post!" };
  }
}

//! 4-Function To Handle Add Comment:
export async function addComment(postId: string, content: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;
    //! check the content of comment:
    if (!content) throw new Error("Content of comment is Required");

    //! find the post:
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found!");

    //! Add Comment and Notification by using transaction:
    const [comment] = await prisma.$transaction(async (tx) => {
      //* Create A Comment first:
      const newComment = await tx.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
        },
      });

      //* Create a Notification if someOne comment on the post:
      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            userId: post.authorId,
            creatorId: userId,
            postId,
            commentId: newComment.id,
          },
        });
      }

      return [newComment];
    });

    revalidatePath(`/posts/${postId}`);
    return { success: true, comment };
  } catch (error) {
    console.log("Error adding comment:", error);
    return { success: false, error: "Failed to add comment!" };
  }
}

//! 5-Function To Handle Delete Post:
export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found!");
    if (post.authorId !== userId)
      throw new Error("You are not authorized to delete this post!");

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error deleting post:", error);
    return { success: false, error: "Failed to delete post!" };
  }
}
