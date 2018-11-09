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
    res.status(204).json({ user });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

api.put('/:uuid', async (req, res) => {
  try {
    const { nickname, email } = await User.findById(req.params.uuid);
    const newNickname = req.body.nickname !== undefined ? req.body.nickname : nickname;
    const newEmail = req.body.email !== undefined ? req.body.email : email;

    // const newPassword = req.body.password !== undefined ? req.body.password : password;
    // const newPasswordConfirm = req.body.password_confirmation !== undefined
    //   ? req.body.password_confirmation
    //   : password_confirmation;

    console.log(newNickname, newEmail);
    const user = await User.update(
      { nickname: newNickname, email: newEmail },
      { where: { uuid: req.params.uuid } },
    );
    res.status(204).json({ user });
  } catch (err) {
    res.status(400).json({ err: `could not connect to database, err: ${err.message}` });
  }
});

export default api;
