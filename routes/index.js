import { Router } from 'express';
import users from './users';
import auth from './auth';

const api = Router();

api.get('/', (req, res) => {
  res.json({ hello: 'express.island' });
});

api.use('/users', users);
api.use('/auth', auth);

export default api;
