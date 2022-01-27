import dotenv from 'dotenv';
import { resolve } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Sequelize from 'sequelize';

// Initialize dotenv to pull secrets for salting process
dotenv.config();
// Initialise Op from sequelize for operator or
const { Op } = Sequelize;

const { PW_SALT_ROUNDS, JWT_SALT } = process.env;
console.log('processenv', process.env);
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
      return res.status(500).json({ error: 'registration error' });
    }
    const hash = await bcrypt.hash(password, Number(PW_SALT_ROUNDS));
    const newUser = await this.model.create({ email, name, password: hash });
    const payload = { id: newUser.id, email: newUser.email };
    const token = jwt.sign(payload, JWT_SALT, { expiresIn: '1h' });
    return res.status(200).json({ success: true, token, id: newUser.id });
  }

  async postLogin(req, res) {
    console.log('POST Request: /user/login');
    console.log(req.body);

    const { email, name, password } = req.body;
    if (!email || !name || !password) { return res.status(500).json({ error: 'login error' }); }
    const user = await this.model.findOne({ where: { email } });
    if (!user) { return res.status(404).json({ error: 'user not found' }); }

    const compare = await bcrypt.compare(password, user.password);
    if (compare) {
      console.log('bcrypt compare is running ~~~~~~~');
      const payload = { id: user.id, username: user.username };
      const token = jwt.sign(payload, JWT_SALT, { expiresIn: '1h' });
      return res.status(200).json({ success: true, token, id: user.id });
    }
    return res.status(401).json({ error: 'wrong password!' });
  }

  async postEmail(req, res) {
    console.log('POST Request: /user/email');
    console.log(req.body);
    const { email } = req.body;
    console.log(email);

    // Function to validate email
    const validateEmail = (input) => {
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (input.match(mailformat)) return true;
      return false;
    };

    // Error Handling: No email or invalid email
    let isEmail = true;
    isEmail = validateEmail(email);
    if (isEmail === false) {
      return res.status(500).json({ error: 'invalid email' });
    }
    if (!email) return res.status(500).json({ error: 'login error' });

    const user = await this.model.findOne({ where: { email } }); // user is the entire row in the DB
    if (user) return res.status(200).json({ found: true, name: user.name });
    return res.status(200).json({ found: false });
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

      // validate if user adding self
      console.log('validate against self');
      console.log(friendData.id);
      console.log(currentUserId);
      if (Number(friendData.id) === Number(currentUserId)) return res.status(400).send({ isValid: false });

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
        // current user friends - array
        const { friendsList } = currentUser.friendsUid;
        console.log('FRIENDS LIST: ', friendsList);
        /* 
        { id: 7, name: 'Doraemon', email: 'doraemon@future.com' },
        { id: 7, name: 'Doraemon', email: 'doraemon@future.com' },
        { id: 13, name: 'bryan', email: 'bryan@test.com' }
        */
       
        // valiidate if user already has specific friend
        for (let i=0; i<friendsList.length; i+=1){
          if(friendsList[i].id === friendData.id) throw "error: added person already in friend list";
        }

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

    try {
      // id of current user, it's a number in string form
      const { id: currentUserId } = req.params;
      // find session with user, user could either be stored as p1 or p2 in db
      const sessionWithUser = await this.db.Match.findOne(
        {
          where: {
            [Op.or]: [
              { p2Id: currentUserId },
              { p1Id: currentUserId },
            ],
          },
        },
      );
      console.log('either or session with user', sessionWithUser);

      if (!sessionWithUser) return res.json({ sessionFound: false });

      // id: sessionPK destructures id as sessionPk
      // destructure relevant variables
      const { p1Id, p2Id, id: sessionPk } = sessionWithUser;

      if (p2Id === Number(currentUserId)) {
        const player1 = await this.model.findByPk(p1Id);
        // if user is p2, assign host to p1
        // front end will recognise that user is not the host
        const partner = player1.name;
        return res.status(200).json({
          sessionFound: true, userRole: 'p2', sessionPk, partner,
        });
      } if (p1Id === Number(currentUserId)) {
        const player2 = await this.model.findByPk(p2Id);
        const partner = player2.name;
        // if user is p1, assign invitee to p2
        // front end will recognise that user is the host
        return res.status(200).json({
          sessionFound: true, userRole: 'p1', sessionPk, partner,
        });
      }
    } catch (err) { console.log(err); }
  }

  async deleteSession(req, res) {
    console.log('DELETE Request: /user/delete/:sessionId');

    const { sessionId } = req.params;
    // finds session row in db via id and destroys it
    const deleteSession = await this.db.Match.destroy(
      { where: { id: sessionId } },
    );

    res.status(204).json({ isDeleted: true });
    if (deleteSession === 0) res.status(404).json({ isDeleted: false });
  }
}

export default UserCtrl;
