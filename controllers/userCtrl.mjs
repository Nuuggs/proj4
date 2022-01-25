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

  async getSession(req, res) {
    console.log('GET Request: /user/session');
    // need to find a way to pass data into get request... if not use post

    try {
      const result = await this.db.Match.findOne({ where: { p2_id: 2 }})
      if(!result)return res.json({sessionFound: false}); // return works... think of what to do with this return...
      console.log(result);
      console.log(result.id);
      console.log(result.p1_id);
      return res.json({sessionFound: true});
    } catch (err) {console.log(err)};
  }

  async postSession(req, res) {
    console.log('POST Request: /user/session/new');
    console.log(req.body);
    const {userId, matchId, parameters} = req.body;
    try {
      const result = await this.db.Match.create({ p1_id: userId, p2_id: matchId, parameters });
      console.log(result);
    } catch (err) {console.log(err)};
  }
}

export default UserCtrl;
