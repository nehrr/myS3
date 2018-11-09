import { Router } from 'express';
import { pick } from 'lodash';
import Blob from '../models/blob';

const api = Router();

api.post('/', async (req, res) => {
  const { name } = req.body;
  const { uuid } = req.user;

  try {
    const blob = new Blob({
      name,
      user_uuid: uuid,
    });
    await blob.save();

    res.status(201).json({ data: { bucket }, meta: {} });
  } catch (err) {
    res.status(400).json({ err });
  }
});

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

    if (blob) {
      const fields = pick(req.body, ['name']);
      await blob.update(fields);

      res.status(204).json();
    }
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.delete('/:id', async (req, res) => {
  try {
    const blob = await Blob.destroy({ where: { id: req.params.id } });
    res.status(204).json({ blob });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

export default api;
