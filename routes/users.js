import { Router } from 'express';
import { pick } from 'lodash';
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

api.get('/:uuid', async (req, res) => {
  try {
    const user = await User.findById(req.params.uuid);
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.delete('/:uuid', async (req, res) => {
  try {
    const user = await User.destroy({ where: { uuid: req.params.uuid } });
    res.status(204).json();
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.put('/:uuid', async (req, res) => {
  try {
    const user = await User.findById(req.params.uuid);

    if (user) {
      const fields = pick(req.body, ['nickname', 'email', 'password', 'password_confirmation']);

      await user.update(fields);
      res.status(204).json();
    }
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

export default api;
