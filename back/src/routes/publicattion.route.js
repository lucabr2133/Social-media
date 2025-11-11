import { Router } from 'express';
import ControlerData from '../controller/controller.js';
const publicationRouter = Router();
publicationRouter.get('/:userid/publication', async (req, res) => {
  const { userid } = req.params;
  const publications = await ControlerData.getPublications(userid);

  res.json(publications);
});

publicationRouter.get('/publications', async (req, res) => {
  const publications = await ControlerData.getPublicationController();

  res.json(publications );
});
publicationRouter.delete('/publications/:id', async (req, res) => {
  const { id } = req.params;
  const deletedPublication = await ControlerData.deletePublicationController(id);
  res.json(deletedPublication);
});

export default publicationRouter;
