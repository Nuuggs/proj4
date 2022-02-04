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
/**
 * Controller to govern functionality regarding manipulating user data
 * @constructor
 * @param {string} name - the name of the controller (used to check that the controller was running during setup)
 * @param {object} model - Match.db for ease of access to the model
 * @param {object} db - to access other models if necessary
 */
class UserCtrl {
  constructor(name, model, db) {
    this.name = name;
    this.model = model;
    this.db = db;
  }

  /**
   * Function that sends the initial html page
   * @param {object} req - unused
   * @param {*} res - sends the html page packaged by webpack
   */
  getMain(req, res) {
    console.log('GET Request: /home');
    console.log(`Running ${this.name} controller`);
    res.status(200).sendFile(resolve('dist', 'main.html'));
  }

  /**
   * Function that saves the user registration data into the db; creates json web token for user authentication
   * @param {string} req.body - takes in user's email, name, and password
   * @param {object} res - res to return the status codes and back-end data
   * @returns the appropriate responses from the backend
   */
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

  /**
   * Function that takes user login data to compare with the stored data in the db; creates json web token on successful login for user authentication
   * @param {string} req.body - takes in user's email, name, and password
   * @param {object} res - res to return the status codes and back-end data
   * @returns the appropriate responses from the backend
   */
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

  /**
   * Function that validates that the email is a valid one using regex
   * @param {string} req.body.email - the user's email
   * @param {object} res - res to return the status codes and back-end data
   * @returns the appropriate responses from the backend
   */
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

  /**
   * Function that adds friends to the user's list of friends
   * @param {object} req.body - user's email and id
   * @param {object} res - res to return the status codes and back-end data
   * @returns the appropriate responses from the backend
   */
  async addFriends(req, res) {
    console.log('POST Request: /user/friends');
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

      // Validation. Prevents user from adding self
      if (Number(friendData.id) === Number(currentUserId)) return res.status(400).send({ isValid: false });

      let updatedUser;
      // If user currently has no friends
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
      // If user has friends
      else if (currentUser.friendsUid) {
        // Current user friends - array
        const { friendsList } = currentUser.friendsUid;

        // Validation. Prevents user from adding the same person twice
        for (let i = 0; i < friendsList.length; i += 1) {
          if (friendsList[i].id === friendData.id) throw 'error: added person already in friend list';
        }
        // Create an updated list, adding the new friend to the previous list of friends
        const updatedFriendsList = [...friendsList, friendData];
        // Update accordingly in the db
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

  /**
   * Function to list all friends of the current user when user enters friends page or is looking for a friend to eat with
   * @param {integer} req.params.id - current user id
   * @param {object} res - res to return the status codes and back-end data
   * @returns the appropriate responses from the backend
   */
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

  /**
   * Function that checks if the user has a current open session
   * @param {integer} req.params.id - current user id 
   * @param {object} res - res to return the status codes and back-end data
   * @returns the appropriate responses from the backend
   */
  async getSession(req, res) {
    console.log('GET Request: /user/session/:id');

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

      // If sessionWithUser returns null
      if (!sessionWithUser) {
        console.log('<=== session with user not found ===>');
        return res.status(200).json({ sessionFound: false }); }

      // If session exists, check likes list for {match: true}
      // If match: true, delete the session
      const { match, informedUsers } = sessionWithUser.likesList;
      if (match) {
        const { id: sessionId } = sessionWithUser;

        // Check if both users have been informed of match
        if (informedUsers.length === 2) {
          const deleteSession = await this.db.Match.destroy(
            { where: { id: sessionId } },
          );

          // Send same message as if sessiionFound === false to front end
          return res.status(200).json({ sessionFound: false });
        }
      }

      // Check if session has ran out of cards for both players
      if (sessionWithUser.lastCard) {
        if (sessionWithUser.lastCard.outOfCardsPlayers.length > 1) {
          const { id: sessionId } = sessionWithUser;

          const deleteSession = await this.db.Match.destroy(
            { where: { id: sessionId } },
          );

          // Send same message as if sessiionFound === false to front end
          return res.status(200).json({ sessionFound: false });
        }
      }

      // id: sessionPK destructures id as sessionPk
      // destructure relevant variables
      const { p1Id, p2Id, id: sessionPk } = sessionWithUser;

      // Determine user role
      if (p2Id === Number(currentUserId)) {
        const player1 = await this.model.findByPk(p1Id);
        // if user is p2, assign host to p1
        // front end will recognise that user is not the host
        const partner = player1.name;
        return res.status(200).json({
          sessionFound: true, userRole: 'p2', sessionPk, partner, p1Id, p2Id, match,
        });
      } if (p1Id === Number(currentUserId)) {
        const player2 = await this.model.findByPk(p2Id);
        const partner = player2.name;
        // if user is p1, assign invitee to p2
        // front end will recognise that user is the host
        return res.status(200).json({
          sessionFound: true, userRole: 'p1', sessionPk, partner, p1Id, p2Id, match,
        });
      }
    } catch (err) { console.log(err); }
  }

  /**
   * Function that deletes session when session is closed
   * @param {integer} req.params.sessionId - current sesssion that is being closed
   * @param {object} res - res to return the status codes and back-end data
   * @returns the appropriate responses from the backend 
   */
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
