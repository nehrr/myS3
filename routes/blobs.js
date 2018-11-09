import { Router } from 'express';
import { pick } from 'lodash';
import Blob from '../models/blob';

const api = Router();

api.post('/', async (req, res) => {
  const { name } = req.body;
  // const { id } = req.params;
  // console.log(req.params);

  try {
    const blob = new Blob({
      name,
      path: 'patth',
      size: 'size',
      bucket_id: 3,
    });
    await blob.save();
    res.status(201).json({ data: { blob }, meta: {} });
  } catch (err) {
    res.status(400).json({ err });
  }
});

api.get('/', async (req, res) => {
  try {
    // get bucket id
    const blobs = await Blob.findAll({ where: { bucket_id: 2 } });
    res.status(200).json({ data: { blobs }, meta: {} });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.get('/:id', async (req, res) => {
  try {
    const blob = await Blob.findById(req.params.id);
    res.status(200).json({ data: { blob } });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.delete('/:id', async (req, res) => {
  try {
    await Blob.destroy({ where: { id: req.params.id } });
    res.status(204).json();
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

export default api;
