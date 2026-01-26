import prismaModel from '../model/prismamodel.js';
import { AppError } from '../AppError.js';
class ControlerData {
static async createUserController(username, password ) {
  if(!username|| !password){
    throw new AppError("Username and password are required",400)
  }
  try {
    return await prismaModel.createUserModel(username, password);
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target.includes("username")) {
      throw new Error("Username already exists",409);
    }
      throw new AppError('Database error', 500);
  }
}


  static async updateProfileController (username, profile, description) {
    if(!username && !profile && !description) throw new AppError('username , description and profile are required',400)
      try {
    const updateUser = await prismaModel.updateUserModel(username, profile, description);
    return updateUser;
        
      } catch (error) {
          if (error.code === 'P2025') {
      throw new AppError('User not found', 404)
    }

    if (error.code === 'P2003') {
      throw new AppError('Invalid relation data', 400)
    }

    throw new AppError('Internal server error', 500)
  }
      }
  

  static async createPubliationController (userid, url, description) {
    if(!userid ||!url ||!description) throw new AppError('userId , description and url are required',400)
      try {
    const publication = await prismaModel.createPublicationModel(userid, url, description);
    return publication;
        
      } catch (error) {
    
        if(error.code==="P2002"){
          throw new AppError('Publication already exist ',409)
        }
        throw new AppError('Internal server error',500)
      }
  }

static async getPublications(userid) {
  if (!userid) {
    throw new AppError('user id is required', 400)
  }

  try {
    return await prismaModel.getPublicationModel(userid)

  } catch (error) {
    console.error(error)
    throw new AppError('Internal server error', 500)
  }
}


  static async createCommentController (comment, userID, publicationID) {
    if(!comment|| !userID|| !publicationID) throw new AppError('user id , comment, publication id Are required',400)
      try{
      const createComment = await prismaModel.createCommentModel(comment, userID, publicationID);
    return createComment;
  }catch(error){
    if (error.code==='P2002'){
      throw new AppError('Comment already exist',409)
    }
        throw new AppError('Internal Server Error',500)

  }
  }

  static async getCommentController (publicationId) {
try {
      const comments = await prismaModel.getCommentsModel(publicationId);
    return comments;
} catch (error) {
  if(error.code==='P2005'){
    throw new AppError('Comments not found',404)
  }
        throw new AppError('Internal Server Error',500)

}

  }

  static async getUserController (query,quantity) {
try {
      const users = await prismaModel.getUserModel(query,quantity);
    return users;
} catch (error) {
  if(error.code==="P2005"){
    throw new AppError('Users not found',404)
  }
  throw new AppError('Internal server error',500)
}

  }

  static async getPublicationController () {
    try {
          const publications = await prismaModel.getPublicationsModel();
    return publications;
    } catch (error) {
    
  throw new AppError('Internal server error',500)

    }

  }

  static async createMessageController (message, receptorUser, user) {
    if(!message|| !receptorUser ||!user) throw new AppError('message , receptor user and user are required',400)
      try {
    const messageCreated = await prismaModel.createMessageModel(message, receptorUser, user);
    return messageCreated;     
      } catch (error) {
        if(error.code==='P2002'){
          throw new AppError('Message already exits',409)
        }
        throw new AppError('Internal Server Error', 500)        
      }
   
  }

  static async getMessagesController () {
    try {
    const messages = await prismaModel.getMessagesModel();
    return messages;
      
    } catch (error) {

   throw new AppError('Internal Server Error', 500)        

    }
  }

static async postLikePublication(likes, publicationID, userActiveID) {
  if (!likes || !publicationID || !userActiveID) {
    throw new AppError(
      'likes, publication id and userActive id are required',
      400
    )
  }

  try {
    return await prismaModel.postLikePublicationModel(
      likes,
      publicationID,
      userActiveID
    )

  } catch (error) {

    if (error.code === 'P2002') {
      throw new AppError('Publication already liked', 409)
    }

    if (error.code === 'P2025') {
      throw new AppError('Publication not found', 404)
    }

    console.error(error)
    throw new AppError('Internal server error', 500)
  }
}


static async deleteLikePublication(likeId) {
  if (!likeId) {
    throw new AppError('likeId is required', 400)
  }

  try {
    return await prismaModel.deleteLikePublicationModel(likeId)

  } catch (error) {

    if (error.code === 'P2025') {
      throw new AppError('Like not found', 404)
    }

    console.error(error)
    throw new AppError('Internal server error', 500)
  }
}


 static async getLikePublication() {
  try {
    return await prismaModel.getLikePublicationModel()

  } catch (error) {
    console.error(error)
    throw new AppError('Internal server error', 500)
  }
}


  static async followingUser(userSessionId, userlId) {
  // 1️⃣ Validación
  if (!userSessionId || !userlId) {
    throw new AppError(
      'user session id and user id are required',
      400
    )
  }

  try {
    return await prismaModel.followingUserModel(
      userSessionId,
      userlId
    )

  } catch (error) {

    if (error.code === 'P2002') {
      throw new AppError('Already following this user', 409)
    }

    console.error(error)
    throw new AppError('Internal server error', 500)
  }
}


static async getfollowingUser() {
  try {
    return await prismaModel.getfollowingUser()

  } catch (error) {
    console.error(error)
    throw new AppError('Internal server error', 500)
  }
}

static async letFollow(followId) {
  if (!followId) {
    throw new AppError('followId is required', 400)
  }

  try {
    return await prismaModel.letFollow(followId)

  } catch (error) {

    if (error.code === 'P2025') {
      throw new AppError('Follow not found', 404)
    }

    console.error(error)
    throw new AppError('Internal server error', 500)
  }
}


static async deletePublicationController(publicationID) {
  if (!publicationID) {
    throw new AppError('publicationID is required', 400)
  }

  try {
    return await prismaModel.deletePublicationModel(publicationID)

  } catch (error) {
    if (error.code === 'P2025') {
      throw new AppError('Publication not found', 404)
    }

    console.error(error)
    throw new AppError('Internal server error', 500)
  }
}


static async updatePublicationController(publicationId, url, description) {
  if (!publicationId  || !description) {
    throw new AppError(
      'publicationId, url and description are required',
      400
    )
  }

  try {
    return await prismaModel.updatePublicationModel(
      publicationId,
      url,
      description
    )

  } catch (error) {
    if (error.code === 'P2025') {
      throw new AppError('Publication not found', 404)
    }

    console.error(error)
    throw new AppError('Internal server error', 500)
  }
}

static async getuserController(username) {
  if (!username) {
    throw new AppError('username is required', 400)
  }

  try {
    const user = await prismaModel.getuserModel(username)

    if (!user) {
      throw new AppError('User not found', 404)
    }

    return user

  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    console.error(error)
    throw new AppError('Internal server error', 500)
  }
}

 static async getNotifyController(userid) {
  if (!userid) {
    throw new AppError('userid is required', 400)
  }

  try {
    return await prismaModel.getNotificationModel(userid)

  } catch (error) {
    console.error(error)
    throw new AppError('Internal server error', 500)
  }
}

 static async updateNotifyController(userId) {
  if (!userId) {
    throw new AppError('userId is required', 400)
  }

  try {
    return await prismaModel.updateNotificationModel(userId)

  } catch (error) {
    console.error(error)
    throw new AppError('Internal server error', 500)
  }
}

}
export default ControlerData;
