import prismaModel from '../model/prismamodel.js';
class ControlerData {
static async createUserController(username, password ) {
  try {
    const userCreate = await prismaModel.createUserModel(username, password);
    return userCreate;
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target.includes("username")) {
      throw new Error("Username already exists");
    }
    throw error; 
  }
}


  static async updateProfileController (username, profile, description) {
    const updateUser = await prismaModel.updateUserModel(username, profile, description);
    return updateUser;
  }

  static async createPubliationController (userid, url, description) {
    const publication = await prismaModel.createPublicationModel(userid, url, description);
    return publication;
  }

  static async getPublications (userid) {
    const publications = await prismaModel.getPublicationModel(userid);
    return publications;
  }

  static async createCommentController (comment, userID, publicationID) {
    const createComment = await prismaModel.createCommentModel(comment, userID, publicationID);
    return createComment;
  }

  static async getCommentController (publicationId) {
    const comments = await prismaModel.getCommentsModel(publicationId);
    return comments;
  }

  static async getUserController (query,quantity) {
    const users = await prismaModel.getUserModel(query,quantity);
    return users;
  }

  static async getPublicationController () {
    const publications = await prismaModel.getPublicationsModel();
    return publications;
  }

  static async createMessageController (message, receptorUser, user) {
    const messageCreated = await prismaModel.createMessageModel(message, receptorUser, user);
    return messageCreated;
  }

  static async getMessagesController () {
    const messages = await prismaModel.getMessagesModel();
    return messages;
  }

  static async postLikePublication (likes, publicationID, userActiveID) {
    const likesPublication = await prismaModel.postLikePublicationModel(likes, publicationID, userActiveID);
    return likesPublication;
  }

  static async deleteLikePublication (likeId) {
    const likesPublication = await prismaModel.deleteLikePublicationModel(likeId);
    return likesPublication;
  }

  static async getLikePublication () {
    const likesPublication = await prismaModel.getLikePublicationModel();
    return likesPublication;
  }

  static async followingUser (userSessionId, userlId) {
    const following = await prismaModel.followingUserModel(userSessionId, userlId);
    return following;
  }

  static async getfollowingUser () {
    const following = await prismaModel.getfollowingUser();
    return following;
  }

  static async letFollow (followId) {
    const letFollow = await prismaModel.letFollow(followId);
    return letFollow;
  }

  static async deletePublicationController (publicationID) {
    const deletedPublication = await prismaModel.deletePublicationModel(publicationID);
    return deletedPublication;
  }

  static async updatePublicationController (publicationId, url, description) {
    const updatedPublication = await prismaModel.updatePublicationModel(publicationId, url, description);
    return updatedPublication;
  }

  static async getuserController (username) {
    const user = await prismaModel.getuserModel(username);
    return user;
  }
  static async getNotifyController(userid){
  const notification=await prismaModel.getNotificationModel(userid)
    return notification 
  }
  static async updateNotifyController(userId){
    const notifcations=await prismaModel.updateNotificationModel(userId)
    return notifcations
  }
}
export default ControlerData;
