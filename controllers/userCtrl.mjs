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
      console.log('bcrypt compare is running ~~~~~~~');
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

  async addFriends(req, res) {
    console.log('POST Request: /user/friends');
    console.log(req.body);
    // Find current user
    const { email, currentUserId } = req.body;
    const currentUser = await this.model.findOne({
      where: {
        id: currentUserId,
      },
    });

    console.log('current user', currentUser);
    // try: query friend's email in db, if no such user,
    // catch: throws error, front end will catch error to render error box

    try {
      // Find friend
      const chosenFriend = await this.model.findOne({ where: { email } });
      console.log('chosen friend', chosenFriend);
      const { id, name } = chosenFriend;
      const friendData = { id, email, name };

      let updatedUser;
      // if user currently has no friends
      if (!currentUser.friendsUid) {
        const friendsList = [];
        friendsList.push(friendData);
        updatedUser = await currentUser.update({ friendsUid: { friendsList } },
          {
            where: {
              id: currentUserId,
            },
          });

        console.log(updatedUser.friendsUid);
      }
      // if user has friends
      else if (currentUser.friendsUid) {
        const { friendsList } = currentUser.friendsUid;
        const updatedFriendsList = [...friendsList, friendData];
        updatedUser = await currentUser.update({ friendsUid: { friendsList: updatedFriendsList } },
          {
            where: {
              id: currentUserId,
            },
          });
      }
      return res.status(200).send(
        { isValid: true, updatedUser },
      );
    } catch (error) {
      return res.status(400).send({ isValid: false });
    }
  }

  async getFriends(req, res) {
    console.log('GET Request: /user/allFriends/:id');
    // current user id sent via req.params
    const { id } = req.params;
    const currentUser = await this.model.findOne({
      where: {
        id,
      },
    });

    // if user has no friends, front end will render no friends message
    if (!currentUser.friendsUid) {
      console.log('no friends');
      return res.status(200).send(null);
    }
    // if user has friends, front end will render friends
    const { friendsList } = currentUser.friendsUid;
    return res.status(200).send(friendsList);
  }

  async getSession(req, res) {
    console.log('GET Request: /user/session/:id');
    console.log('req params', req.params);
    // id of current user
    const { id } = req.params;

    try {
      const result = await this.db.Match.findOne({ where: { p2_id: id } });
      if (!result) return res.json({ sessionFound: false }); // return works... think of what to do with this return...
      console.log(result);
      console.log(result.id);
      console.log(result.p1_id);
      return res.json({ sessionFound: true });
    } catch (err) { console.log(err); }
  }

  // To be deleted: this has been moved to /match
  // async postSession(req, res) {
  //   console.log('POST Request: /user/session/new');
  //   console.log(req.body);
  //   const { userId, matchId, parameters } = req.body;
  //   try {
  //     const result = await this.db.Match.create({ p1_id: userId, p2_id: matchId, parameters });
  //     console.log(result);
  //   } catch (err) { console.log(err); }
  // }
}

export default UserCtrl;
