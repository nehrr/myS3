import { Router } from 'express';
import { pick } from 'lodash';
import Bucket from '../models/bucket';
import Filesystem from '../lib/filesystem';

const api = Router();

api.post('/', async (req, res) => {
  const { name } = req.body;
  const { uuid } = req.user;

  try {
    const bucket = new Bucket({
      name,
      user_uuid: uuid,
    });

    try {
      Filesystem.createBucket(uuid, name);
      await bucket.save();
      res.status(201).json({ data: { bucket }, meta: {} });
    } catch (err) {
      res.status(400).json({ err: err.message });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});

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
    res.status(200).json({ data: { bucket } });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.delete('/:id', async (req, res) => {
  try {
    await Bucket.destroy({ where: { id: req.params.id } });
    res.status(204).json();
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.put('/:id', async (req, res) => {
  console.log(req.params);
  try {
    const bucket = await Bucket.findById(req.params.id);

    if (bucket) {
      const fields = pick(req.body, ['name']);

      await bucket.update(fields);
      res.status(204).json();
    }
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

export default api;
