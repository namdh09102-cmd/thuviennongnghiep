import prisma from '../config/prisma';

export const createComment = async (data: {
  postId: string;
  authorId: string;
  content: string;
  parentId?: string;
}) => {
  const post = await prisma.post.findUnique({
    where: { id: data.postId }
  });

  if (!post) {
    throw new Error('Post not found');
  }

  const user = await prisma.user.findUnique({
    where: { id: data.authorId }
  });

  const isExpertAnswer = user?.role === 'EXPERT';

  if (data.parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: data.parentId }
    });
    if (!parentComment) {
      throw new Error('Parent comment not found');
    }
    if (parentComment.parentId) {
      throw new Error('Maximum comment nesting level reached');
    }
  }

  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        postId: data.postId,
        authorId: data.authorId,
        content: data.content,
        parentId: data.parentId || null,
        isExpertAnswer
      },
      include: {
        author: { select: { id: true, username: true, role: true } }
      }
    }),
    prisma.post.update({
      where: { id: data.postId },
      data: { commentCount: { increment: 1 } }
    }),
    prisma.user.update({
      where: { id: data.authorId },
      data: { reputationPoints: { increment: isExpertAnswer ? 10 : 2 } }
    })
  ]);

  return comment;
};

export const getCommentsByPostId = async (postId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      parentId: null
    },
    take: 10,
    include: {
      author: { select: { id: true, username: true, role: true, isVerifiedExpert: true } },
      replies: {
        include: {
          author: { select: { id: true, username: true, role: true, isVerifiedExpert: true } }
        },
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return comments;
};

export const likePost = async (postId: string, userId: string) => {
  const existingLike = await prisma.postLike.findUnique({
    where: {
      postId_userId: { postId, userId }
    }
  });

  if (existingLike) {
    throw new Error('You have already liked this post');
  }

  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    throw new Error('Post not found');
  }

  const [like] = await prisma.$transaction([
    prisma.postLike.create({
      data: { postId, userId }
    }),
    prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } }
    }),
    prisma.user.update({
      where: { id: post.authorId },
      data: { reputationPoints: { increment: 5 } }
    })
  ]);

  return like;
};

export const unlikePost = async (postId: string, userId: string) => {
  const existingLike = await prisma.postLike.findUnique({
    where: {
      postId_userId: { postId, userId }
    }
  });

  if (!existingLike) {
    throw new Error('You have not liked this post yet');
  }

  await prisma.$transaction([
    prisma.postLike.delete({
      where: {
        postId_userId: { postId, userId }
      }
    }),
    prisma.post.update({
      where: { id: postId },
      data: { likeCount: { decrement: 1 } }
    })
  ]);

  return { message: 'Unliked successfully' };
};

export const savePost = async (postId: string, userId: string) => {
  const existingSave = await prisma.postSave.findUnique({
    where: {
      postId_userId: { postId, userId }
    }
  });

  if (existingSave) {
    throw new Error('You have already saved this post');
  }

  return prisma.postSave.create({
    data: { postId, userId }
  });
};

export const unsavePost = async (postId: string, userId: string) => {
  const existingSave = await prisma.postSave.findUnique({
    where: {
      postId_userId: { postId, userId }
    }
  });

  if (!existingSave) {
    throw new Error('You have not saved this post yet');
  }

  await prisma.postSave.delete({
    where: {
      postId_userId: { postId, userId }
    }
  });

  return { message: 'Unsaved successfully' };
};
