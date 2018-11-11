import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import Blob from '../models/blob';
import Bucket from '../models/bucket';
import { getExtension } from '../lib/utils';
import Filesystem from '../lib/filesystem';

const api = Router({ mergeParams: true });

const storage = multer.diskStorage({
  async destination(req, file, cb) {
    const { uuid } = req.user;
    const { id } = req.params;

    try {
      const bucket = await Bucket.findById(id);
      const pathName = path.join('/opt/workspace/myS3/', uuid, bucket.name);
      cb(null, pathName);
    } catch (e) {
      throw new Error('could not get bucket name');
    }
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

api.post('/', upload.single('blob'), async (req, res) => {
  const { id } = req.params;
  const { uuid } = req.user;

  try {
    if (!req.file) {
      req.status(400).json({ err: 'no file was sent or file was corrupted' });
    }

    const { originalname, size } = req.file;

    const bucket = await Bucket.findById(id);

    const pathName = path.join('/opt/workspace/myS3/', uuid, bucket.name, originalname);

    const blob = new Blob({
      name: originalname,
      path: pathName,
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
    let newPath = path.substr(0, path.length - (filename.length + extension.length));
    newPath = `${newPath}${newName}`;

    const newBlob = new Blob({
      name: newName,
      path: newPath,
      size,
      bucket_id,
    });

    Filesystem.duplicateBlob(path, newPath);

    await newBlob.save();

    res.status(201).json({ data: { blob }, meta: {} });
  } catch (err) {
    res.status(400).json({ err: 'error' });
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
  const { id } = req.params;
  try {
    const blob = await Blob.findById(id);
    const { path } = blob;
    await Blob.destroy({ where: { id } });
    Filesystem.removeBlob(path);

    res.status(204).json();
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.get('/download/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const blob = await Blob.findById(id);
    const { path } = blob;
    res.download(path);
  } catch (e) {
    res.status(400).json({ err: 'could not download file' });
  }
});

export default api;
