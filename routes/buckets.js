import { Router } from 'express';
import Bucket from '../models/bucket';

const api = Router();

api.get('/', async (req, res) => {
  try {
    const buckets = await Bucket.findAll();
    res.status(200).json({ data: { buckets }, meta: {} });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.get('/:id', async (req, res) => {
  try {
    const bucket = await Bucket.findById(req.params.id);
    res.status(200).json({ bucket });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.delete('/:id', async (req, res) => {
  try {
    const bucket = await Bucket.destroy({ where: { uuid: req.params.id } });
    res.status(204).json({ bucket });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

export default api;
