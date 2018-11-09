import { Router } from 'express';
import Blob from '../models/blob';

const api = Router();

api.get('/', async (req, res) => {
  try {
    const blobs = await Blob.findAll();
    res.status(200).json({ data: { blobs }, meta: {} });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.get('/:id', async (req, res) => {
  try {
    const blob = await Blob.findById(req.params.id);
    res.status(200).json({ blob });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.delete('/:id', async (req, res) => {
  try {
    const blob = await Blob.destroy({ where: { uuid: req.params.id } });
    res.status(204).json({ blob });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

export default api;
