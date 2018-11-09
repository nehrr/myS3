import { Router } from 'express';
import passport from 'passport';
import users from './users';
import auth from './auth';
import blobs from './blobs';
import buckets from './buckets';

const api = Router();

api.get('/', (req, res) => {
  res.json({ hello: 'express.island' });
});

// api.get('*', (req, res) => {
//   res.status(404).json({ err: '404 not found' });
// });

api.use('/users', passport.authenticate('jwt', { session: false }), users);
api.use('/auth', auth);
api.use('/blob', passport.authenticate('jwt', { session: false }), blobs);
api.use('/buckets', passport.authenticate('jwt', { session: false }), buckets);

export default api;
