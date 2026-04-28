import prisma from '../config/prisma';

export const followUser = async (followerId: string, targetUsername: string) => {
  const targetUser = await prisma.user.findUnique({
    where: { username: targetUsername }
  });

  if (!targetUser) {
    throw new Error('User to follow not found');
  }

  if (targetUser.id === followerId) {
    throw new Error('You cannot follow yourself');
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId: targetUser.id
      }
    }
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUser.id
        }
      }
    });
    return { message: 'Unfollowed successfully', isFollowing: false };
  }

  await prisma.follow.create({
    data: {
      followerId,
      followingId: targetUser.id
    }
  });

  return { message: 'Followed successfully', isFollowing: true };
};

export const getUserProfile = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { username: true, role: true } }
        }
      },
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true
        }
      }
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
