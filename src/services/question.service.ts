import prisma from '../config/prisma';

export interface GetQuestionsQuery {
  status?: string;
  expertId?: string;
  userId?: string;
}

export const createQuestion = async (data: {
  title: string;
  content: string;
  userId: string;
  expertId?: string;
}) => {
  return prisma.question.create({
    data: {
      title: data.title,
      content: data.content,
      status: 'OPEN',
      user: {
        connect: { id: data.userId }
      },
      ...(data.expertId ? {
        expert: {
          connect: { id: data.expertId }
        }
      } : {})
    },
    include: {
      user: { select: { id: true, username: true, role: true } },
      expert: { select: { id: true, username: true, role: true } }
    }
  });
};

export const getQuestions = async (query: GetQuestionsQuery) => {
  const where: any = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.expertId) {
    where.expertId = query.expertId;
  }

  if (query.userId) {
    where.userId = query.userId;
  }

  return prisma.question.findMany({
    where,
    include: {
      user: { select: { id: true, username: true, role: true } },
      expert: { select: { id: true, username: true, role: true } },
      _count: { select: { answers: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getQuestionById = async (id: string) => {
  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true, role: true } },
      expert: { select: { id: true, username: true, role: true } },
      answers: {
        include: {
          user: { select: { id: true, username: true, role: true, isVerifiedExpert: true } }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!question) {
    throw new Error('Question not found');
  }

  return question;
};

export const createAnswer = async (data: {
  questionId: string;
  userId: string;
  content: string;
}) => {
  const question = await prisma.question.findUnique({
    where: { id: data.questionId }
  });

  if (!question) {
    throw new Error('Question not found');
  }

  const user = await prisma.user.findUnique({
    where: { id: data.userId }
  });

  const isExpert = user?.role === 'EXPERT';

  const answer = await prisma.$transaction(async (tx) => {
    const newAnswer = await tx.answer.create({
      data: {
        questionId: data.questionId,
        userId: data.userId,
        content: data.content
      },
      include: {
        user: { select: { id: true, username: true, role: true } }
      }
    });

    // Nếu là Expert trả lời, tự động cập nhật status của Question thành ANSWERED
    await tx.question.update({
      where: { id: data.questionId },
      data: { status: isExpert ? 'ANSWERED' : question.status }
    });

    // Tăng điểm uy tín
    await tx.user.update({
      where: { id: data.userId },
      data: { reputationPoints: { increment: isExpert ? 15 : 5 } }
    });

    return newAnswer;
  });

  return answer;
};

export const acceptAnswer = async (questionId: string, answerId: string, userId: string) => {
  const question = await prisma.question.findUnique({
    where: { id: questionId }
  });

  if (!question) {
    throw new Error('Question not found');
  }

  if (question.userId !== userId) {
    throw new Error('You are not authorized to accept an answer for this question');
  }

  const answer = await prisma.answer.findUnique({
    where: { id: answerId }
  });

  if (!answer || answer.questionId !== questionId) {
    throw new Error('Answer not found or does not belong to this question');
  }

  await prisma.$transaction(async (tx) => {
    await tx.answer.update({
      where: { id: answerId },
      data: { isAccepted: true }
    });

    await tx.question.update({
      where: { id: questionId },
      data: { status: 'CLOSED' }
    });

    // Thưởng thêm điểm cho người trả lời được chấp nhận
    await tx.user.update({
      where: { id: answer.userId },
      data: { reputationPoints: { increment: 30 } }
    });
  });

  return { message: 'Answer accepted successfully' };
};
