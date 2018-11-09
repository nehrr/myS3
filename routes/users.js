import { Router } from 'express';
import User from '../models/user';

const api = Router();

api.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ data: { users }, meta: {} });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

export default api;
