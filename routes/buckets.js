import { Router } from 'express';
import { pick } from 'lodash';
import Bucket from '../models/bucket';
import Blob from '../models/blob';
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
    await bucket.save();

    try {
      Filesystem.createBucket(uuid, bucket.id);

      res.status(201).json({ data: { bucket }, meta: {} });
    } catch (err) {
      res.status(400).json({ err: `could not create bucket, err: ${err.message}` });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});

api.get('/', async (req, res) => {
  try {
    const { uuid } = req.user;
    const buckets = await Bucket.findAll({ where: { user_uuid: uuid } });

    res.status(200).json({ data: { buckets }, meta: {} });
  } catch (err) {
    res.status(400).json({ err: `could not get buckets, err: ${err.message}` });
  }
});

api.head('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bucket = await Bucket.findById(id);

    if (bucket) {
      console.log('exists');
      res.status(200).end();
    } else {
      console.log('does not exist');
      res.status(400).end();
    }
  } catch (err) {
    res.status(400).json({ err: `could not get bucket, err: ${err.message}` });
  }
});

api.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bucket = await Bucket.findById(id);
    const blobs = await Blob.findAll({ where: { bucket_id: id } });

    if ((blobs, bucket)) {
      res.status(200).json({ data: { bucket, blobs } });
    }
  } catch (err) {
    res.status(400).json({ err: `could get bucket, err: ${err.message}` });
  }
});

api.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { uuid } = req.user;

    const bucket = await Bucket.findById(id);

    if (bucket) {
      await Bucket.destroy({ where: { id } });
      Filesystem.removeBucket(uuid, id);

      res.status(204).json();
    }
  } catch (err) {
    res.status(400).json({ err: `could not delete bucket, err: ${err.message}` });
  }
});

api.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const bucket = await Bucket.findById(id);

    if (bucket) {
      const fields = pick(req.body, ['name']);
      await bucket.update(fields);

      res.status(204).json();
    }
  } catch (err) {
    res.status(400).json({ err: `could not rename bucket, err: ${err.message}` });
  }
});

export default api;
