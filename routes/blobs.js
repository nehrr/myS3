import { Router } from 'express';
import Blob from '../models/blob';
import { getExtension } from '../lib/utils';

const api = Router({ mergeParams: true });

api.post('/', async (req, res) => {
  const { name, path, size } = req.body;
  const { id } = req.params;

  try {
    const blob = new Blob({
      name,
      path,
      size,
      bucket_id: id,
    });
    await blob.save();
    res.status(201).json({ data: { blob }, meta: {} });
  } catch (err) {
    res.status(400).json({ err });
  }
});

api.post('/duplicate/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const blob = await Blob.findById(id);
    const {
      name, path, size, bucket_id,
    } = blob;
    const { name: filename, extension } = getExtension(name);
    const newName = `${filename}.copy${extension}`;
    let newPath = path.substr(0, path.length - (filename.length - 1 + extension.length - 1));
    newPath = `${newPath}${newName}`;

    const newBlob = new Blob({
      name: newName,
      path: newPath,
      size,
      bucket_id,
    });

    await newBlob.save();
    res.status(201).json({ data: { blob }, meta: {} });
  } catch (err) {
    res.status(400).json({ err });
  }
});

api.get('/', async (req, res) => {
  try {
    const { id } = req.params;
    const blobs = await Blob.findAll({ where: { bucket_id: id } });
    res.status(200).json({ data: { blobs }, meta: {} });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.get('/metadata/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blob = await Blob.findById(id);
    res.status(200).json({ data: { blob: { metadata: { size: blob.size, path: blob.path } } } });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blob = await Blob.findById(id);
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
