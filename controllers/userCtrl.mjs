import dotenv from 'dotenv';
import { resolve } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Initialize dotenv to pull secrets for salting process
dotenv.config();

const { PW_SALT_ROUNDS, JWT_SALT } = process.env;

class UserCtrl {
  constructor(name, model, db) {
    this.name = name;
    this.model = model;
    this.db = db;
  }

  getMain(req, res) {
    console.log('GET Request: /home');
    console.log(`Running ${this.name} controller`);
    res.status(200).sendFile(resolve('dist', 'main.html'));
  }

  async postRegister(req, res) {
    console.log('POST Request: /user/register');
    console.log(req.body);
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(500).json({ msg: 'registration error' });
    }
    const hash = await bcrypt.hash(password, Number(PW_SALT_ROUNDS));
    const newUser = await this.model.create({ email, name, password: hash });
    const payload = { id: newUser.id, email: newUser.email };
    const token = jwt.sign(payload, JWT_SALT, { expiresIn: '1h' });
    return res.status(200).json({ newUser, token });
  }

  async postLogin(req, res) {
    console.log('POST Request: /user/login');
    console.log(req.body);

    const { email, name, password } = req.body;
    if (!email || !name || !password) { return res.status(500).json({ msg: 'login error' }); }
    const user = await this.model.findOne({ where: { email } });
    if (!user) { return res.status(404).json({ msg: 'user not found' }); }

    const compare = await bcrypt.compare(password, user.password);
    if (compare) {
      const payload = { id: user.id, username: user.username };
      const token = jwt.sign(payload, JWT_SALT, { expiresIn: '1h' });
      return res.status(200).json({ success: true, token, id: user.id });
    }
    return res.status(401).json({ msg: 'error: wrong password!' });
  }

  async postEmail(req, res) {
    console.log('POST Request: /user/email');
    console.log(req.body);
    const { email } = req.body;
    console.log(email);
    if (!email) return res.status(500).json({ msg: 'login error' });
    const user = await this.model.findOne({ where: { email } }); // user is the entire row in the DB
    return res.status(200).json({ success: true, name: user.name });
  }

  async getUsers(req, res) {
    console.log('POST Request: /user/friends');
    console.log(req.body);
    // Find current user
    const { email, currentUserId } = req.body;
    const currentUser = await this.model.findOne({
      where: {
        id: currentUserId,
      },
    });

    // Find friend
    const chosenFriend = await this.model.findOne({ where: { email } });
    // console.log('chosen friend', chosenFriend);
    // console.log('chosen friend id', chosenFriend.id);
    // console.log('chosen friend name', chosenFriend.name);
    // console.log('current user', currentUser);
    const { id, name } = chosenFriend;

    console.log(currentUser.friendsUid);

    const friendData = { id, email, name };

    let updatedUser;

    // BUG!!!
    if (!currentUser.friendsUid) {
      const friendList = [];
      friendList.push(friendData);
      updatedUser = await currentUser.update({ friendsUid: { friendList } });
      console.log(currentUser.friendsUid);
    } else if (currentUser.friendsUid) {
      const { friendList } = currentUser.friendsUid;
      console.log('pre-update friend list', friendList);
      friendList.push(friendData);
      console.log('post-update friend list', friendList);

      updatedUser = await currentUser.update({
        friendsUid: {
          friendList,
        },
      });
      console.log(updatedUser.friendsUid);
    }

    if (!chosenFriend) {
      // Bug: not sure how to handle error
      return res.status(200).send({ isValid: false });
    }

    // chosenFriend.update({ friendsUid: { chosenFriend.id } });
    return res.status(200).send({ isValid: true, updatedUser });
  }
}

export default UserCtrl;
