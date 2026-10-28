import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const authorSelect = {
  id: true,
  username: true,
  profileImg: true,
  description: true,
};

class prismaModel {
  static async createUserModel(username, password) {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new Error("Username already exists");
    }

    try {
      const userCreate = await prisma.user.create({
        data: {
          username,
          password,
        },
      });
      return userCreate;
    } catch (e) {
      throw new Error(e.message || "Error creating user");
    }
  }

  static async updateUserModel(username, profile, description) {
    const updateUser = await prisma.user.update({
      where: {
        username,
      },
      data: {
        ...(typeof description === 'string' && { description }),
        ...(profile && { profileImg: profile }),
      },
    });
    return updateUser;
  }

  static async createPublicationModel(userid, url, description) {
    const publication = await prisma.publications.create({
      data: {
        user_id: userid,
        image_url: url,
        content: description,
      },
      include: {
        author: {
          select: authorSelect,
        },
      },
    });
    return publication;
  }

  static async getPublicationModel(userid) {
    const publication = await prisma.publications.findMany({
      where: {
        user_id: userid,
      },
      include: {
        author: {
          select: authorSelect,
        },
      },
      orderBy: {
        create_at: 'desc',
      },
    });
    return publication;
  }

  static async createCommentModel(comment, userId, publicationId) {
    const createComment = await prisma.comments.create({
      data: {
        content: comment,
        post_id: publicationId,
        user_id: userId,
      },
      include: {
        author: {
          select: authorSelect,
        },
      },
    });
    return createComment;
  }

  static async deleteCommentModel(commentId) {
    const deleted = await prisma.comments.delete({
      where: {
        id: commentId,
      },
    });
    return deleted;
  }

  static async getCommentsModel(publicationId) {
    const comments = await prisma.comments.findMany({
      include: {
        author: {
          select: authorSelect,
        },
      },
      where: {
        post_id: publicationId,
      },
      orderBy: {
        create_at: 'asc',
      },
    });
    return comments;
  }

  static async getUserModel(query, quantity) {
    const users = await prisma.user.findMany({
      where: query
        ? {
            username: {
              contains: query,
              mode: 'insensitive',
            },
          }
        : undefined,
      take: parseInt(quantity) || 30,
      orderBy: {
        create_at: 'desc',
      },
    });
    return users;
  }

  static async getPublicationsModel() {
    const publications = await prisma.publications.findMany({
      include: {
        author: {
          select: authorSelect,
        },
      },
      orderBy: {
        create_at: 'desc',
      },
    });
    return publications;
  }

  static async createMessageModel(message, receptorUser, user) {
    const messageCreated = await prisma.messages.create({
      data: {
        content: message,
        sender_id: user,
        receptor_id: receptorUser,
      },
    });
    return messageCreated;
  }

  static async getMessagesModel() {
    const messages = await prisma.messages.findMany({
      orderBy: {
        create_at: 'asc',
      },
    });
    return messages;
  }

  static async postLikePublicationModel(likes, publicationID, userActiveID) {
    const likesPublication = await prisma.likes.create({
      data: {
        user_id: userActiveID,
        post_id: publicationID,
      },
    });

    try {
      const post = await prisma.publications.findUnique({
        where: { id: publicationID },
        select: { user_id: true },
      });
      if (post && post.user_id !== userActiveID) {
        await prisma.notifcations.create({
          data: {
            user_id: post.user_id,
            type: 'like',
            actorId: userActiveID,
          },
        });
      }
    } catch {
      // ignore non-critical notification error
    }

    return likesPublication;
  }

  static async deleteLikePublicationModel(likeId) {
    const likesPublication = await prisma.likes.delete({
      where: {
        id: likeId,
      },
    });
    return likesPublication;
  }

  static async getLikePublicationModel() {
    const likesPublication = await prisma.likes.findMany();
    return likesPublication;
  }

  static async followingUserModel(userSessionId, userlId) {
    const followingUser = await prisma.following.create({
      data: {
        follower_id: userlId,
        following_id: userSessionId,
      },
    });

    if (userSessionId !== userlId) {
      try {
        await prisma.notifcations.create({
          data: {
            user_id: userlId,
            type: 'follow',
            actorId: userSessionId,
          },
        });
      } catch {
        // ignore non-critical notification error
      }
    }
    return followingUser;
  }

  static async getfollowingUser() {
    const following = await prisma.following.findMany();
    return following;
  }

  static async letFollow(followId) {
    const following = await prisma.following.delete({
      where: {
        id: followId,
      },
    });
    return following;
  }

  static async deletePublicationModel(publicationID) {
    const deletedPublication = await prisma.publications.delete({
      where: {
        id: publicationID,
      },
    });
    return deletedPublication;
  }

  static async updatePublicationModel(publicationId, url, description) {
    const data = { content: description };

    if (url) {
      data.image_url = url;
    }
    const updatedPublication = await prisma.publications.update({
      where: {
        id: publicationId,
      },
      data,
      include: {
        author: {
          select: authorSelect,
        },
      },
    });
    return updatedPublication;
  }

  static async getuserModel(username) {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    return user;
  }

  static async getNotificationModel(userId) {
    const notification = await prisma.notifcations.findMany({
      where: {
        user_id: userId,
      },
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            profileImg: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });
    return notification;
  }

  static async updateNotificationModel(userId) {
    return await prisma.notifcations.updateMany({
      data: {
        read: true,
      },
      where: {
        user_id: userId,
      },
    });
  }
}

export { prisma };
export default prismaModel;
