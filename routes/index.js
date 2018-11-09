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

api.use('/users', passport.authenticate('jwt', { session: false }), users);
api.use('/auth', auth);
api.use('/users/:uuid/:bucket/blob', passport.authenticate('jwt', { session: false }), blobs);
api.use('/users/:uuid/bucket', passport.authenticate('jwt', { session: false }), buckets);

export default api;
