import { Router } from 'express';
import ControlerData from '../controller/controller.js';
const publicationRouter = Router();
publicationRouter.get('/:userid/publication', async (req, res,next) => {
  try {
    const { userid } = req.params;
  const publications = await ControlerData.getPublications(userid);

  res.json(publications);
  } catch (error) {
    next(error)
  }
  
});

publicationRouter.get('/publications', async (req, res,next) => {
  try {
    const publications = await ControlerData.getPublicationController();

  res.json(publications );
  } catch (error) {
    next(error)
  }
  
});
publicationRouter.delete('/publications/:id', async (req, res,next) => {
  try {
     const { id } = req.params;
  const deletedPublication = await ControlerData.deletePublicationController(id);
  res.status(204).json(deletedPublication);
  } catch (error) {
    next(error)
  }
 
});

export default publicationRouter;
