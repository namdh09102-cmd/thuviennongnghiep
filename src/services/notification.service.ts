import prisma from '../config/prisma';

export const getNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
};

export const markAsRead = async (id: string, userId: string) => {
  const notification = await prisma.notification.findUnique({
    where: { id }
  });

  if (!notification) {
    throw new Error('Notification not found');
  }

  if (notification.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return prisma.notification.update({
    where: { id },
    data: { read: true }
  });
};

export const markAllAsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true }
  });
};

export const createNotification = async (data: {
  userId: string;
  type: string;
  data: any;
}) => {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      data: data.data,
      read: false
    }
  });
};
